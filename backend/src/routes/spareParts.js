const express = require('express');
const router = express.Router();
const sparePartController = require('../controllers/sparePartController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', sparePartController.getAllSpareParts);
router.get('/alerts/low-stock', sparePartController.getLowStockAlerts);
router.get('/:id', sparePartController.getSparePartById);
router.post('/', authorize('admin', 'mechanic'), sparePartController.createSparePart);
router.put('/:id', authorize('admin', 'mechanic'), sparePartController.updateSparePart);
router.delete('/:id', authorize('admin'), sparePartController.deleteSparePart);
router.post('/:id/adjust-stock', authorize('admin', 'mechanic'), sparePartController.adjustStock);

module.exports = router;
