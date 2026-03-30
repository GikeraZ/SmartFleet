const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', routeController.getAllRoutes);
router.get('/:id', routeController.getRouteById);
router.post('/', authorize('admin', 'operations_manager'), routeController.createRoute);
router.put('/:id', authorize('admin', 'operations_manager'), routeController.updateRoute);
router.delete('/:id', authorize('admin'), routeController.deleteRoute);

module.exports = router;
