const mongoose = require('mongoose');
const jsonDb = require('../config/jsonDb');

const BotConfigSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  botName: {
    type: String,
    default: 'Assistant'
  },
  welcomeMessage: {
    type: String,
    default: 'Hi! How can I help you today?'
  },
  primaryColor: {
    type: String,
    default: '#1E90FF'
  },
  businessInfo: {
    type: String,
    required: [true, 'Please add details about your business']
  },
  personality: {
    type: String,
    enum: ['friendly', 'professional', 'casual', 'formal'],
    default: 'friendly'
  },
  language: {
    type: String,
    default: 'English'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  fallbackMessage: {
    type: String,
    default: "I'm not sure about that. Please contact us directly."
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MongooseBotConfig = mongoose.model('BotConfig', BotConfigSchema);

// Helper to attach save capability to plain configs
const attachSave = (configObj) => {
  if (!configObj) return null;
  return {
    ...configObj,
    save: async function() {
      // In JSON DB, we can write back the values of this config
      const { save, ...dataToSave } = this;
      return jsonDb.findOneAndUpdate('botconfigs', { _id: this._id }, dataToSave);
    }
  };
};

const BotConfigWrapper = {
  findOne: function(query) {
    return {
      populate: function(field) {
        return {
          then: async function(resolve, reject) {
            try {
              if (global.dbConnected) {
                const config = await MongooseBotConfig.findOne(query).populate(field);
                return resolve(config);
              }
              const config = await jsonDb.findOne('botconfigs', query);
              if (config && field === 'owner') {
                const ownerUser = await jsonDb.findById('users', config.owner);
                config.owner = ownerUser;
              }
              return resolve(attachSave(config));
            } catch (err) {
              if (reject) reject(err);
            }
          }
        };
      },
      then: async function(resolve, reject) {
        try {
          if (global.dbConnected) {
            const config = await MongooseBotConfig.findOne(query);
            return resolve(config);
          }
          const config = await jsonDb.findOne('botconfigs', query);
          return resolve(attachSave(config));
        } catch (err) {
          if (reject) reject(err);
        }
      }
    };
  },

  create: async function(configData) {
    if (global.dbConnected) {
      return MongooseBotConfig.create(configData);
    }
    const config = await jsonDb.create('botconfigs', {
      ...configData,
      createdAt: new Date().toISOString()
    });
    return attachSave(config);
  }
};

module.exports = BotConfigWrapper;
