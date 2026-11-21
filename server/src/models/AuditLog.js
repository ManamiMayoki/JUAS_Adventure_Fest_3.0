const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        'BUDGET_ITEM_CREATE',
        'BUDGET_ITEM_UPDATE',
        'BUDGET_ITEM_DELETE',
        'PAYMENT_VERIFIED',
        'PAYMENT_REJECTED',
        'SLOT_ALLOCATION_UPDATE',
        'ORGANIZER_LOGIN',
      ],
      index: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    performerEmail: {
      type: String,
      required: true,
      index: true,
    },
    performerRole: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    diff: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
