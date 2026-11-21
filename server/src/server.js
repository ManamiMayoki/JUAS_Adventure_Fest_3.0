const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const morgan = require('morgan');
const config = require('./config/env');
const { connectDB } = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const segmentRoutes = require('./routes/segmentRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Initialize Database Connection
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Trust Proxy for Nginx reverse-proxy on Azure VM
app.set('trust proxy', 1);

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Handled or customized for Three.js canvas & WebGL
    crossOriginEmbedderPolicy: false,
  })
);

// Compression for High-Throughput (1,000+ users)
app.use(compression());

// Body Parsers & Cookie Parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Sanitize MongoDB inputs against NoSQL injections & HTTP Parameter Pollution
app.use(mongoSanitize());
app.use(hpp());

// CORS Configuration
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || config.nodeEnv !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Global Rate Limiting
app.use('/api', apiLimiter);

// Mount API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root informational endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    name: 'JUAS Adventure Fest 3.0 API',
    tagline: 'Wild Campus Meets Neon Quest',
    version: '3.0.0',
    documentation: '/api/health',
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.originalUrl}`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = config.port;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.success(`[JUAS Core API] Server active on port ${PORT} [Mode: ${config.nodeEnv}]`);
  });
}

module.exports = app;
