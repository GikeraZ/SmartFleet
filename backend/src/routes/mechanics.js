const express = require('express');
const router = express.Router();
const mechanicController = require('../controllers/mechanicController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', mechanicController.getAllMechanics);
router.get('/:id', mechanicController.getMechanicById);
router.get('/:id/performance', mechanicController.getMechanicPerformance);

module.exports = router;
