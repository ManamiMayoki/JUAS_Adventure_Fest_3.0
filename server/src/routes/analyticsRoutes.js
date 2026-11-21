const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/public-stats', analyticsController.getPublicStats);

module.exports = router;
