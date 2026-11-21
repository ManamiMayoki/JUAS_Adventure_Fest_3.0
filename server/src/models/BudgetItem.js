const mongoose = require('mongoose');

const budgetItemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        'Logistics & Permits',
        'Kits, Medals & T-Shirts',
        'Marathon Hydration & Medical',
        'Treasure Hunt & Quest Props',
        'Food & Refreshments',
        'Sound, Lighting & Stage',
        'Branding & Printing',
        'Emergency & Contingency',
        'Sponsorship & Grant Inflow',
      ],
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    isIncome: {
      type: Boolean,
      default: false,
    },
    plannedAmountBDT: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    actualAmountBDT: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    receiptNumber: {
      type: String,
      default: '',
    },
    receiptNote: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['planned', 'approved', 'disbursed', 'settled'],
      default: 'planned',
    },
    updatedBy: {
      type: String,
      default: 'System Admin',
    },
  },
  {
    timestamps: true,
  }
);

budgetItemSchema.index({ category: 1, isIncome: 1 });

module.exports = mongoose.model('BudgetItem', budgetItemSchema);
