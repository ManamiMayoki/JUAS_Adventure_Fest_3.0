const express = require('express');
const router = express.Router();
const segmentController = require('../controllers/segmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.get('/', segmentController.getAllSegments);
router.get('/:id', segmentController.getSegmentById);
router.post('/', protect, authorize('super_admin', 'organizer'), segmentController.createSegment);
router.put('/:id', protect, authorize('super_admin', 'organizer'), segmentController.updateSegment);

module.exports = router;
