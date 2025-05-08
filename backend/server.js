import shortenerRoutes from './routes/shortener.js';
app.use('/api/shorten', shortenerRoutes);
app.use('/r', shortenerRoutes); // This handles redirection
router.get('/mine', protect, async (req, res) => {
    const links = await ShortUrl.find({ createdBy: req.user.id });
    res.json(links);
  });
  