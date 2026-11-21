const mongoose = require('mongoose');

const squadMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    studentId: { type: String },
    tShirtSize: { type: String, enum: ['S', 'M', 'L', 'XL', 'XXL'], default: 'L' },
  },
  { _id: false }
);

const registrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    avatarClass: {
      type: String,
      enum: ['Pathfinder Fox', 'Skywatcher Bird'],
      required: true,
      default: 'Pathfinder Fox',
    },
    leadParticipant: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true, index: true },
      phone: { type: String, required: true, trim: true },
      university: { type: String, required: true, trim: true },
      department: { type: String, required: true, trim: true },
      studentId: { type: String, required: true, trim: true },
      emergencyContact: { type: String, required: true, trim: true },
      tShirtSize: { type: String, enum: ['S', 'M', 'L', 'XL', 'XXL'], default: 'L' },
    },
    squadName: {
      type: String,
      trim: true,
      default: '',
    },
    squadMembers: [squadMemberSchema],
    segments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Segment',
        required: true,
        index: true,
      },
    ],
    totalFeeBDT: {
      type: Number,
      required: true,
      min: 0,
    },
    payment: {
      method: {
        type: String,
        enum: ['bKash', 'Nagad', 'Rocket', 'CashOnDesk'],
        required: true,
      },
      transactionId: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        index: true,
      },
      senderNumber: {
        type: String,
        required: true,
        trim: true,
      },
      amountPaidBDT: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
        index: true,
      },
      verifiedAt: {
        type: Date,
      },
      verifiedBy: {
        type: String,
      },
      verificationNote: {
        type: String,
      },
    },
    questLevelStars: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    qrCodeDataUrl: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// High-speed compound indexes for 1,000+ concurrent lookups
registrationSchema.index({ registrationId: 1, 'leadParticipant.email': 1 });
registrationSchema.index({ 'payment.status': 1, createdAt: -1 });
registrationSchema.index({ 'payment.transactionId': 1, 'payment.method': 1 });

module.exports = mongoose.model('Registration', registrationSchema);
