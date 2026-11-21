const Registration = require('../models/Registration');
const Segment = require('../models/Segment');
const AuditLog = require('../models/AuditLog');
const { generateQRCodeDataURL } = require('../utils/qrGenerator');
const { getClient } = require('../config/redis');

// Helper to generate tactical registration ID (e.g. JUAS-3.0#1042)
const generateRegistrationCode = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `JUAS-3.0#${randomNum}`;
};

exports.createRegistration = async (req, res, next) => {
  try {
    const { avatarClass, leadParticipant, squadName, squadMembers, segmentIds, payment } = req.body;

    // Verify segments and calculate total fees
    const segments = await Segment.find({ _id: { $in: segmentIds } });
    if (!segments.length) {
      return res.status(400).json({
        success: false,
        message: 'No valid segments selected.',
      });
    }

    // Check slot availability
    for (const seg of segments) {
      if (seg.registeredSlots >= seg.totalSlots) {
        return res.status(400).json({
          success: false,
          message: `Segment '${seg.title}' is already sold out!`,
        });
      }
    }

    const totalFeeBDT = segments.reduce((sum, seg) => sum + seg.feeBDT, 0);

    // Generate unique ID
    let registrationId = generateRegistrationCode();
    let exists = await Registration.findOne({ registrationId });
    while (exists) {
      registrationId = generateRegistrationCode();
      exists = await Registration.findOne({ registrationId });
    }

    // Generate QR Code containing verification payload
    const qrPayload = JSON.stringify({
      id: registrationId,
      name: leadParticipant.name,
      avatar: avatarClass,
      status: 'SUBMITTED',
      fest: 'JUAS Adventure Fest 3.0',
    });

    const qrCodeDataUrl = await generateQRCodeDataURL(qrPayload);

    const newRegistration = await Registration.create({
      registrationId,
      avatarClass,
      leadParticipant,
      squadName: squadName || '',
      squadMembers: squadMembers || [],
      segments: segmentIds,
      totalFeeBDT,
      payment: {
        method: payment.method,
        transactionId: payment.transactionId.toUpperCase().trim(),
        senderNumber: payment.senderNumber.trim(),
        amountPaidBDT: payment.amountPaidBDT,
        status: 'pending',
      },
      questLevelStars: 5,
      qrCodeDataUrl,
      ipAddress: req.ip,
    });

    // Atomically increment segment registration counts
    await Segment.updateMany(
      { _id: { $in: segmentIds } },
      { $inc: { registeredSlots: 1 } }
    );

    // Invalidate Redis caches
    const cache = getClient();
    await cache.del('juas:segments:all');
    await cache.del('juas:analytics:public');
    await cache.del('juas:budget:summary');

    const populatedReg = await Registration.findById(newRegistration._id).populate('segments');

    res.status(201).json({
      success: true,
      message: 'Quest Registration Successful! Your mission pass is ready.',
      data: populatedReg,
    });
  } catch (error) {
    next(error);
  }
};

exports.lookupRegistration = async (req, res, next) => {
  try {
    const { query } = req.query; // registrationId or email
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a registration ID or registered email address.',
      });
    }

    const cleanQuery = query.trim();
    const registration = await Registration.findOne({
      $or: [
        { registrationId: cleanQuery.toUpperCase() },
        { 'leadParticipant.email': cleanQuery.toLowerCase() },
        { 'payment.transactionId': cleanQuery.toUpperCase() },
      ],
    }).populate('segments');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'No registration pass found matching your search query.',
      });
    }

    res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllRegistrations = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter['payment.status'] = status;
    }

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { registrationId: regex },
        { 'leadParticipant.name': regex },
        { 'leadParticipant.email': regex },
        { 'leadParticipant.phone': regex },
        { 'payment.transactionId': regex },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [registrations, total] = await Promise.all([
      Registration.find(filter)
        .populate('segments')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Registration.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: registrations,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body; // 'verified' or 'rejected'

    if (!['verified', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status value.',
      });
    }

    const registration = await Registration.findById(id).populate('segments');
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found.',
      });
    }

    const previousStatus = registration.payment.status;
    registration.payment.status = status;
    registration.payment.verifiedAt = new Date();
    registration.payment.verifiedBy = req.user.email;
    if (note) registration.payment.verificationNote = note;

    await registration.save();

    // Audit log
    await AuditLog.create({
      action: status === 'verified' ? 'PAYMENT_VERIFIED' : 'PAYMENT_REJECTED',
      targetId: registration.registrationId,
      performerEmail: req.user.email,
      performerRole: req.user.role,
      details: `Payment status changed from ${previousStatus} to ${status}. Note: ${note || 'None'}`,
    });

    const cache = getClient();
    await cache.del('juas:budget:summary');
    await cache.del('juas:analytics:public');

    res.status(200).json({
      success: true,
      message: `Payment status successfully updated to '${status}'.`,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};
