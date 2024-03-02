const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chatbotpro', {
      serverSelectionTimeoutMS: 2000 // Fast timeout for local development fallbacks
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.dbConnected = true;
  } catch (error) {
    console.warn(`MongoDB Connection Failed: ${error.message}`);
    console.warn(`Falling back to Local JSON Database: config/mock_db.json`);
    global.dbConnected = false;
  }
};

module.exports = connectDB;
