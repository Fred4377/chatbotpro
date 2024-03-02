const mongoose = require('mongoose');
const jsonDb = require('../config/jsonDb');

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ConversationSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  botOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [MessageSchema],
  customerName: {
    type: String
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  totalMessages: {
    type: Number,
    default: 0
  }
});

const MongooseConversation = mongoose.model('Conversation', ConversationSchema);

// Helper to attach save capability to plain conversations
const attachSave = (convObj) => {
  if (!convObj) return null;
  return {
    ...convObj,
    save: async function() {
      const { save, ...dataToSave } = this;
      return jsonDb.findOneAndUpdate('conversations', { sessionId: this.sessionId }, dataToSave);
    }
  };
};

const ConversationWrapper = {
  find: function(query) {
    return {
      sort: function(sortCriteria) {
        return {
          then: async function(resolve, reject) {
            try {
              if (global.dbConnected) {
                const conversations = await MongooseConversation.find(query).sort(sortCriteria);
                return resolve(conversations);
              }
              const conversations = await jsonDb.find('conversations', query);
              // Handle basic sort by lastMessageAt descending
              if (sortCriteria && sortCriteria.lastMessageAt === -1) {
                conversations.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
              }
              return resolve(conversations.map(c => attachSave(c)));
            } catch (err) {
              if (reject) reject(err);
            }
          }
        };
      },
      then: async function(resolve, reject) {
        try {
          if (global.dbConnected) {
            const conversations = await MongooseConversation.find(query);
            return resolve(conversations);
          }
          const conversations = await jsonDb.find('conversations', query);
          return resolve(conversations.map(c => attachSave(c)));
        } catch (err) {
          if (reject) reject(err);
        }
      }
    };
  },

  findOne: async function(query) {
    if (global.dbConnected) {
      return MongooseConversation.findOne(query);
    }
    const conv = await jsonDb.findOne('conversations', query);
    return attachSave(conv);
  },

  create: async function(convData) {
    if (global.dbConnected) {
      return MongooseConversation.create(convData);
    }
    const conv = await jsonDb.create('conversations', {
      ...convData,
      startedAt: convData.startedAt || new Date().toISOString(),
      lastMessageAt: convData.lastMessageAt || new Date().toISOString()
    });
    return attachSave(conv);
  },

  findOneAndDelete: async function(query) {
    if (global.dbConnected) {
      return MongooseConversation.findOneAndDelete(query);
    }
    return jsonDb.findOneAndDelete('conversations', query);
  }
};

module.exports = ConversationWrapper;
