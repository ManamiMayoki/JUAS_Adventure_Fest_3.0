const Redis = require('ioredis');
const config = require('./env');
const logger = require('../utils/logger');

// Resilient In-Memory Fallback Cache when Redis is unavailable
class InMemoryCache {
  constructor() {
    this.store = new Map();
    this.ttls = new Map();
    this.isReady = true;
  }

  async get(key) {
    const expireTime = this.ttls.get(key);
    if (expireTime && Date.now() > expireTime) {
      this.store.delete(key);
      this.ttls.delete(key);
      return null;
    }
    const val = this.store.get(key);
    return val !== undefined ? val : null;
  }

  async set(key, value, mode, duration) {
    this.store.set(key, value);
    if (mode === 'EX' && duration) {
      this.ttls.set(key, Date.now() + duration * 1000);
    }
    return 'OK';
  }

  async del(...keys) {
    let count = 0;
    for (const key of keys) {
      if (this.store.delete(key)) count++;
      this.ttls.delete(key);
    }
    return count;
  }

  async flushall() {
    this.store.clear();
    this.ttls.clear();
    return 'OK';
  }
}

let redisClient = null;
const memoryCache = new InMemoryCache();

if (config.redisEnabled) {
  try {
    redisClient = new Redis(config.redisUrl, {
      maxRetriesPerRequest: 1,
      retryStrategy(times) {
        if (times > 3) {
          logger.warn('[Redis] Connection failed. Falling back gracefully to in-memory cache.');
          return null; // Stop reconnecting and use fallback
        }
        return Math.min(times * 100, 1000);
      },
      lazyConnect: true,
      enableOfflineQueue: false,
    });

    redisClient.on('connect', () => {
      logger.info('[Redis] High-speed cache connected successfully.');
    });

    redisClient.on('error', (err) => {
      logger.warn(`[Redis] Notice: ${err.message}. Operating in resilient memory-cache mode.`);
    });

    redisClient.connect().catch((err) => {
      logger.warn(`[Redis] Connect failed (${err.message}). Using in-memory fallback.`);
    });
  } catch (error) {
    logger.warn(`[Redis] Initialization warning: ${error.message}. Using in-memory fallback.`);
  }
}

const getClient = () => {
  if (redisClient && redisClient.status === 'ready') {
    return redisClient;
  }
  return memoryCache;
};

module.exports = {
  getClient,
  memoryCache,
  redisClient,
};
