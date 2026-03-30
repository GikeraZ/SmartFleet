const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', contractController.getAllContracts);
router.get('/:id', contractController.getContractById);
router.post('/', authorize('admin', 'operations_manager', 'accountant'), contractController.createContract);
router.put('/:id', authorize('admin', 'operations_manager', 'accountant'), contractController.updateContract);
router.delete('/:id', authorize('admin'), contractController.deleteContract);
router.post('/:id/generate-invoice', authorize('admin', 'accountant'), contractController.generateInvoice);

module.exports = router;
