const express = require('express');
const router = express.Router();
const mechanicServiceController = require('../controllers/mechanicServiceController');
const { authenticate, checkRole } = require('../middleware/auth');

router.use(authenticate);

router.post('/', checkRole(['admin', 'mechanic']), mechanicServiceController.createMechanicServiceRecord);
router.get('/my', checkRole(['admin', 'mechanic']), mechanicServiceController.getMyServiceRecords);
router.get('/', checkRole(['admin']), mechanicServiceController.getAllMechanicServiceRecords);
router.get('/:id', checkRole(['admin', 'mechanic']), mechanicServiceController.getMechanicServiceRecordById);
router.put('/:id', checkRole(['admin']), mechanicServiceController.updateMechanicServiceRecord);
router.delete('/:id', checkRole(['admin']), mechanicServiceController.deleteMechanicServiceRecord);

module.exports = router;
