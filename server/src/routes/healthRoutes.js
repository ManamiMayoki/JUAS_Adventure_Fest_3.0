const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { getClient } = require('../config/redis');

router.get('/', async (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const redis = getClient();
  const redisStatus = redis.status === 'ready' ? 'connected' : (redis.isReady ? 'in-memory-fallback' : 'disconnected');

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      mongodb: mongoStatus,
      cache: redisStatus,
    },
    system: {
      memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
      nodeVersion: process.version,
    },
  });
});

module.exports = router;
