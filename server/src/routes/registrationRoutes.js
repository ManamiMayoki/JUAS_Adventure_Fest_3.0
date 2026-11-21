const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const { registrationLimiter } = require('../middleware/rateLimiter');
const { validate, registrationSchema } = require('../middleware/validationMiddleware');

router.post(
  '/',
  registrationLimiter,
  validate(registrationSchema),
  registrationController.createRegistration
);

router.get('/lookup', registrationController.lookupRegistration);

// Organizer routes
router.get('/', protect, authorize('super_admin', 'organizer'), registrationController.getAllRegistrations);
router.patch('/:id/verify', protect, authorize('super_admin', 'organizer'), registrationController.verifyPayment);

module.exports = router;
