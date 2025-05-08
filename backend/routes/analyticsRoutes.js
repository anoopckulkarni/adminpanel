const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const analyticsController = require('../controllers/analyticsController');

router.get('/analytics/uptime', authMiddleware, analyticsController.getUptimeAnalytics);

module.exports = router;