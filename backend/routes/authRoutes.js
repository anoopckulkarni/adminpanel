const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/mfa/enable', authMiddleware, authController.enableMfa);
router.post('/mfa/verify', authController.verifyMfaToken);
router.post('/mfa/disable', authMiddleware, authController.disableMfa);

module.exports = router;