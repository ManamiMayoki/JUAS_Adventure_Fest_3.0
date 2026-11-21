const rateLimit = require('express-rate-limit');
const config = require('../config/env');

// Standard API rate limiter
const apiLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'High traffic alert: Too many requests from this IP. Please wait a few moments.',
  },
});

// Stricter limiter for registration & payment submission
const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Registration rate limit exceeded. Please wait 15 minutes before submitting again.',
  },
});

// Auth login attempts limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

module.exports = {
  apiLimiter,
  registrationLimiter,
  authLimiter,
};
