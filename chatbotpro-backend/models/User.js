const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jsonDb = require('../config/jsonDb');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    select: false
  },
  businessName: {
    type: String,
    required: [true, 'Please add a business name']
  },
  businessType: {
    type: String,
    required: [true, 'Please select a business type']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const MongooseUser = mongoose.model('User', UserSchema);

// Helper to attach password compare utility to plain objects
const attachMethods = (userObj) => {
  if (!userObj) return null;
  return {
    ...userObj,
    matchPassword: async function(enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    }
  };
};

const UserWrapper = {
  findOne: function(query) {
    return {
      select: async function(fields) {
        if (global.dbConnected) {
          return MongooseUser.findOne(query).select(fields);
        }
        const user = await jsonDb.findOne('users', query);
        return attachMethods(user);
      },
      then: async function(resolve, reject) {
        try {
          if (global.dbConnected) {
            const user = await MongooseUser.findOne(query);
            return resolve(user);
          }
          const user = await jsonDb.findOne('users', query);
          return resolve(attachMethods(user));
        } catch (err) {
          if (reject) reject(err);
        }
      }
    };
  },

  create: async function(userData) {
    if (global.dbConnected) {
      return MongooseUser.create(userData);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    const user = await jsonDb.create('users', {
      ...userData,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });
    return attachMethods(user);
  },

  findById: async function(id) {
    if (global.dbConnected) {
      return MongooseUser.findById(id);
    }
    const user = await jsonDb.findById('users', id);
    return attachMethods(user);
  }
};

module.exports = UserWrapper;
