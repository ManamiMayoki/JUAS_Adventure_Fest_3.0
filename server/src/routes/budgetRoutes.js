const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const { validate, budgetItemSchema } = require('../middleware/validationMiddleware');

// Restricted to Organizer and Super Admin
router.use(protect, authorize('super_admin', 'organizer'));

router.get('/summary', budgetController.getBudgetSummary);
router.get('/items', budgetController.getAllBudgetItems);
router.post('/items', validate(budgetItemSchema), budgetController.createBudgetItem);
router.put('/items/:id', budgetController.updateBudgetItem);
router.delete('/items/:id', budgetController.deleteBudgetItem);
router.get('/export/csv', budgetController.exportBudgetCSV);

module.exports = router;
