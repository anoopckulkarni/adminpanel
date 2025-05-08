const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have an auth middleware
const userController = require('../controllers/userController');

router.get('/users', authMiddleware, userController.authorize(['Super Admin', 'IT Head']), userController.getAllUsers);
router.post('/users', authMiddleware, userController.createUser); // Protected by auth and role

module.exports = router;