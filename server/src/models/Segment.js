const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Athletics', 'Tactical Exploration', 'Bushcraft & Survival', 'Creative & Science'],
      default: 'Tactical Exploration',
    },
    difficulty: {
      type: String,
      enum: ['Recruit', 'Veteran', 'Elite'],
      default: 'Veteran',
    },
    squadMin: {
      type: Number,
      default: 1,
    },
    squadMax: {
      type: Number,
      default: 1,
    },
    feeBDT: {
      type: Number,
      required: true,
      min: 0,
    },
    totalSlots: {
      type: Number,
      required: true,
      default: 200,
    },
    registeredSlots: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['open', 'almost_full', 'closed'],
      default: 'open',
    },
    rules: [
      {
        type: String,
      },
    ],
    scheduleTime: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    iconName: {
      type: String,
      default: 'Compass',
    },
  },
  {
    timestamps: true,
  }
);

segmentSchema.virtual('remainingSlots').get(function () {
  return Math.max(0, this.totalSlots - this.registeredSlots);
});

segmentSchema.set('toJSON', { virtuals: true });
segmentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Segment', segmentSchema);
