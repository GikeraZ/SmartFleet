const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', expenseController.getAllExpenses);
router.get('/summary', expenseController.getExpenseSummary);
router.get('/:id', expenseController.getExpenseById);
router.post('/', authorize('admin', 'accountant'), expenseController.createExpense);
router.put('/:id', authorize('admin', 'accountant'), expenseController.updateExpense);
router.delete('/:id', authorize('admin'), expenseController.deleteExpense);

module.exports = router;
