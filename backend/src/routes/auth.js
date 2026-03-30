const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/profile', authenticate, authController.getProfile);
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;
