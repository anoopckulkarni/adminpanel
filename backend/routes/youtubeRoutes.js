const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtubeController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware'); // To handle the video file

router.get('/auth/google', youtubeController.getAuthUrl);
router.get('/auth/google/callback', youtubeController.googleCallback);
router.post('/upload/youtube', authMiddleware, uploadMiddleware.uploadVideo, youtubeController.uploadVideo);

module.exports = router;