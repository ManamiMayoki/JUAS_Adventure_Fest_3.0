const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/juas_fest_3',
  mongoMaxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '50', 10),
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  redisEnabled: process.env.REDIS_ENABLED !== 'false',
  jwtSecret: process.env.JWT_SECRET || 'fallback_juas_fest_secret_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000', 10),
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL || 'admin@juas.org',
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || 'AdventureFest2026!',
  seedOrganizerEmail: process.env.SEED_ORGANIZER_EMAIL || 'organizer@juas.org',
  seedOrganizerPassword: process.env.SEED_ORGANIZER_PASSWORD || 'WildQuest2026!',
};
