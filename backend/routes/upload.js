import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadToYouTube } from '../services/youtube.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post(
  '/youtube',
  protect,
  authorize('moderator', 'it-head', 'super-admin'),
  upload.fields([{ name: 'video' }, { name: 'thumbnail' }]),
  async (req, res) => {
    try {
      const { title, description, tags } = req.body;
      const videoPath = req.files.video[0].path;
      const thumbnailPath = req.files.thumbnail?.[0]?.path;

      const result = await uploadToYouTube({
        title,
        description,
        tags: tags?.split(',') || [],
        videoPath,
        thumbnailPath,
      });

      res.json({ success: true, videoId: result.id });
    } catch (error) {
      console.error('Upload error:', error.message);
      res.status(500).json({ message: 'YouTube upload failed' });
    }
  }
);
const youtubeURL = `https://www.youtube.com/watch?v=${result.id}`;
const tweetMessage = `${title} is now live! 🎙️\n${youtubeURL}`;
try {
  const tweet = await postToTwitter({ message: tweetMessage });
  res.json({
    success: true,
    videoId: result.id,
    tweetId: tweet.data.id,
    tweetURL: `https://twitter.com/user/status/${tweet.data.id}`,
  });
} catch (tweetErr) {
  console.warn('Tweet failed:', tweetErr.message);
  res.json({
    success: true,
    videoId: result.id,
    tweetError: tweetErr.message,
  });
}
