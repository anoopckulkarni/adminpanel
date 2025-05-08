import express from 'express';
import ShortUrl from '../models/ShortUrl.js';
import { nanoid } from 'nanoid';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create short URL
router.post('/', protect, async (req, res) => {
  const { fullUrl, customSlug } = req.body;

  let slug = customSlug || nanoid(6);

  const exists = await ShortUrl.findOne({ slug });
  if (exists) return res.status(400).json({ message: 'Slug already exists' });

  const newUrl = new ShortUrl({
    slug,
    fullUrl,
    createdBy: req.user.id
  });

  await newUrl.save();
  const shortLink = `${process.env.BASE_URL || 'https://yourdomain.com'}/r/${slug}`;
  res.json({ shortLink });
});

// Redirect from short URL
router.get('/:slug', async (req, res) => {
  const entry = await ShortUrl.findOne({ slug: req.params.slug });

  if (!entry) return res.status(404).send('URL not found');

  entry.clickCount += 1;
  await entry.save();

  res.redirect(entry.fullUrl);
});
