const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', paymentController.getAllPayments);
router.get('/summary', paymentController.getPaymentSummary);
router.get('/:id', paymentController.getPaymentById);
router.post('/', authorize('admin', 'accountant'), paymentController.createPayment);
router.delete('/:id', authorize('admin'), paymentController.deletePayment);

module.exports = router;
