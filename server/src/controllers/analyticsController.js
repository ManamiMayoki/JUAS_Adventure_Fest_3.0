const Registration = require('../models/Registration');
const Segment = require('../models/Segment');
const { getClient } = require('../config/redis');

exports.getPublicStats = async (req, res, next) => {
  try {
    const cache = getClient();
    const cacheKey = 'juas:analytics:public';

    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        source: 'cache',
        data: JSON.parse(cachedData),
      });
    }

    const [totalRegistrations, segments] = await Promise.all([
      Registration.countDocuments(),
      Segment.find({}, 'code title registeredSlots totalSlots status feeBDT'),
    ]);

    const totalSlots = segments.reduce((sum, s) => sum + s.totalSlots, 0);
    const filledSlots = segments.reduce((sum, s) => sum + s.registeredSlots, 0);

    const stats = {
      totalRegisteredQuests: totalRegistrations,
      totalSlots,
      filledSlots,
      slotsAvailable: Math.max(0, totalSlots - filledSlots),
      systemStatus: 'ONLINE // 1,000+ CONCURRENT CAPACITY',
      segmentsSummary: segments,
      lastUpdated: new Date().toISOString(),
    };

    await cache.set(cacheKey, JSON.stringify(stats), 'EX', 30);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
