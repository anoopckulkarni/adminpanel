const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const podcastController = require('../controllers/podcastController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

router.post('/episodes', authMiddleware, podcastController.createEpisode);
router.get('/episodes', podcastController.getAllEpisodes);
router.get('/episodes/:id', podcastController.getEpisodeById);
router.put('/episodes/:id', authMiddleware, podcastController.updateEpisode);
router.delete('/episodes/:id', authMiddleware, podcastController.deleteEpisode);

// Routes for handling file uploads (adjust based on your needs)
router.post('/episodes/upload/audio', authMiddleware, uploadMiddleware.uploadAudio, (req, res) => {
    if (req.file) {
        res.status(200).json({ message: 'Audio uploaded successfully', audioUrl: `/uploads/${req.file.filename}` });
    } else {
        res.status(400).json({ message: 'No audio file uploaded or invalid file type' });
    }
});

router.post('/episodes/upload/video', authMiddleware, uploadMiddleware.uploadVideo, (req, res) => {
    if (req.file) {
        res.status(200).json({ message: 'Video uploaded successfully', videoUrl: `/uploads/${req.file.filename}` });
    } else {
        res.status(400).json({ message: 'No video file uploaded or invalid file type' });
    }
});

module.exports = router;