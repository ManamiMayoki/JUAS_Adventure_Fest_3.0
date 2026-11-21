const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    next(error);
  }
};

const registrationSchema = z.object({
  body: z.object({
    avatarClass: z.enum(['Pathfinder Fox', 'Skywatcher Bird']),
    leadParticipant: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Invalid email address'),
      phone: z.string().min(11, 'Valid phone number required (e.g., 017XXXXXXXX)'),
      university: z.string().min(2, 'University name is required'),
      department: z.string().min(2, 'Department name is required'),
      studentId: z.string().min(2, 'Student / National ID is required'),
      emergencyContact: z.string().min(11, 'Emergency contact number required'),
      tShirtSize: z.enum(['S', 'M', 'L', 'XL', 'XXL']).optional(),
    }),
    squadName: z.string().optional(),
    squadMembers: z
      .array(
        z.object({
          name: z.string().min(2),
          email: z.string().email(),
          phone: z.string().min(11),
          studentId: z.string().optional(),
          tShirtSize: z.enum(['S', 'M', 'L', 'XL', 'XXL']).optional(),
        })
      )
      .optional(),
    segmentIds: z.array(z.string()).min(1, 'Select at least one event segment'),
    payment: z.object({
      method: z.enum(['bKash', 'Nagad', 'Rocket', 'CashOnDesk']),
      transactionId: z.string().min(4, 'Valid transaction ID required'),
      senderNumber: z.string().min(11, 'Valid sender mobile number required'),
      amountPaidBDT: z.number().min(0, 'Amount must be greater than or equal to 0'),
    }),
  }),
});

const budgetItemSchema = z.object({
  body: z.object({
    category: z.enum([
      'Logistics & Permits',
      'Kits, Medals & T-Shirts',
      'Marathon Hydration & Medical',
      'Treasure Hunt & Quest Props',
      'Food & Refreshments',
      'Sound, Lighting & Stage',
      'Branding & Printing',
      'Emergency & Contingency',
      'Sponsorship & Grant Inflow',
    ]),
    title: z.string().min(2, 'Title is required'),
    description: z.string().optional(),
    isIncome: z.boolean().optional(),
    plannedAmountBDT: z.number().min(0),
    actualAmountBDT: z.number().min(0).optional(),
    receiptNumber: z.string().optional(),
    receiptNote: z.string().optional(),
    status: z.enum(['planned', 'approved', 'disbursed', 'settled']).optional(),
  }),
});

module.exports = {
  validate,
  registrationSchema,
  budgetItemSchema,
};
