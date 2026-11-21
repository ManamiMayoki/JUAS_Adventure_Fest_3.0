const mongoose = require('mongoose');
const config = require('./env');
const logger = require('../utils/logger');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const options = {
    maxPoolSize: config.mongoMaxPoolSize,
    minPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  };

  try {
    const conn = await mongoose.connect(config.mongoUri, options);
    isConnected = true;
    logger.info(`[Database] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`[Database] Connection error: ${error.message}`);
    // Do not crash during initial offline dev, retry gracefully
    if (config.nodeEnv === 'production') {
      process.exit(1);
    }
  }

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    logger.warn('[Database] MongoDB disconnected. Attempting to reconnect...');
  });

  mongoose.connection.on('error', (err) => {
    logger.error(`[Database] MongoDB runtime error: ${err.message}`);
  });
};

module.exports = { connectDB, mongoose };
