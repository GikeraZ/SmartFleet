const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', busController.getAllBuses);
router.get('/stats', authorize('admin', 'operations_manager'), busController.getBusStats);
router.get('/:id', busController.getBusById);
router.post('/', authorize('admin', 'operations_manager'), busController.createBus);
router.put('/:id', authorize('admin', 'operations_manager'), busController.updateBus);
router.delete('/:id', authorize('admin'), busController.deleteBus);

module.exports = router;
