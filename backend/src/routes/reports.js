const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/financial', authorize('admin', 'accountant'), reportController.generateFinancialReport);
router.get('/financial/pdf', authorize('admin', 'accountant'), reportController.downloadReportPDF);
router.get('/export', authorize('admin', 'accountant'), reportController.exportToCSV);

module.exports = router;
