const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.post('/', authorize('admin', 'accountant'), invoiceController.createInvoice);
router.put('/:id', authorize('admin', 'accountant'), invoiceController.updateInvoice);
router.delete('/:id', authorize('admin'), invoiceController.deleteInvoice);
router.post('/:id/payment', authorize('admin', 'accountant'), invoiceController.recordPayment);
router.get('/:id/pdf', invoiceController.generatePDF);

module.exports = router;
