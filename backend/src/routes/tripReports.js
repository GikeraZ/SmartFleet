const express = require('express');
const router = express.Router();
const tripReportController = require('../controllers/tripReportController');
const { authenticate, checkRole } = require('../middleware/auth');

router.use(authenticate);

router.post('/', checkRole(['admin', 'driver']), tripReportController.createTripReport);
router.get('/my', checkRole(['admin', 'driver']), tripReportController.getMyTripReports);
router.get('/', checkRole(['admin']), tripReportController.getAllTripReports);
router.get('/:id', checkRole(['admin', 'driver']), tripReportController.getTripReportById);
router.put('/:id', checkRole(['admin']), tripReportController.updateTripReport);
router.delete('/:id', checkRole(['admin']), tripReportController.deleteTripReport);

module.exports = router;
