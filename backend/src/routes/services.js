const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.post('/', authorize('admin', 'mechanic'), serviceController.createService);
router.put('/:id', authorize('admin', 'mechanic'), serviceController.updateService);
router.delete('/:id', authorize('admin'), serviceController.deleteService);

module.exports = router;
