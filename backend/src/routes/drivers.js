const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', driverController.getAllDrivers);
router.get('/:id', driverController.getDriverById);
router.post('/', authorize('admin', 'operations_manager'), driverController.createDriver);
router.put('/:id', authorize('admin', 'operations_manager'), driverController.updateDriver);
router.delete('/:id', authorize('admin'), driverController.deleteDriver);

module.exports = router;
