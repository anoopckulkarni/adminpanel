const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const urlShortenerController = require('../controllers/urlShortenerController');

router.post('/shorten', authMiddleware, urlShortenerController.generateShortUrl);
router.get('/s/:shortCode', urlShortenerController.redirectToOriginal);
router.get('/analytics/short/:shortCode', authMiddleware, urlShortenerController.getShortUrlAnalytics);
router.get('/short/me', authMiddleware, urlShortenerController.getUserShortUrls); // Optional

module.exports = router;