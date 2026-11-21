const Segment = require('../models/Segment');
const { getClient } = require('../config/redis');

exports.getAllSegments = async (req, res, next) => {
  try {
    const cache = getClient();
    const cacheKey = 'juas:segments:all';

    // Check cache first for 1,000+ concurrent traffic
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        source: 'cache',
        data: JSON.parse(cachedData),
      });
    }

    const segments = await Segment.find().sort({ createdAt: 1 });

    // Cache for 60 seconds
    await cache.set(cacheKey, JSON.stringify(segments), 'EX', 60);

    res.status(200).json({
      success: true,
      source: 'database',
      data: segments,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSegmentById = async (req, res, next) => {
  try {
    const segment = await Segment.findById(req.params.id);
    if (!segment) {
      return res.status(404).json({
        success: false,
        message: 'Segment not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: segment,
    });
  } catch (error) {
    next(error);
  }
};

exports.createSegment = async (req, res, next) => {
  try {
    const segment = await Segment.create(req.body);
    const cache = getClient();
    await cache.del('juas:segments:all');

    res.status(201).json({
      success: true,
      data: segment,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSegment = async (req, res, next) => {
  try {
    const segment = await Segment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!segment) {
      return res.status(404).json({
        success: false,
        message: 'Segment not found.',
      });
    }

    const cache = getClient();
    await cache.del('juas:segments:all');

    res.status(200).json({
      success: true,
      data: segment,
    });
  } catch (error) {
    next(error);
  }
};
