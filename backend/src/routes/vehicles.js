const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.post('/', authorize('admin', 'mechanic'), vehicleController.createVehicle);
router.put('/:id', authorize('admin', 'mechanic'), vehicleController.updateVehicle);
router.delete('/:id', authorize('admin'), vehicleController.deleteVehicle);

module.exports = router;
