const ShortUrl = require('../models/ShortUrl');

// Controller to generate a new short URL
exports.generateShortUrl = async (req, res) => {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl) {
            return res.status(400).json({ message: 'Original URL is required' });
        }

        const newShortUrl = new ShortUrl({
            originalUrl,
            createdBy: req.user.id // Assuming user is authenticated
        });
        await newShortUrl.save();
        res.status(201).json({ message: 'Short URL generated successfully', shortUrl: `${req.headers.host}/${newShortUrl.shortCode}`, originalUrl });
    } catch (error) {
        console.error('Error generating short URL:', error);
        res.status(500).json({ message: 'Error generating short URL' });
    }
};

// Controller to redirect to the original URL
exports.redirectToOriginal = async (req, res) => {
    try {
        const { shortCode } = req.params;
        const shortUrl = await ShortUrl.findOne({ shortCode });
        if (shortUrl) {
            shortUrl.clicks++;
            await shortUrl.save();
            return res.redirect(shortUrl.originalUrl);
        } else {
            return res.status(404).json({ message: 'Short URL not found' });
        }
    } catch (error) {
        console.error('Error redirecting:', error);
        res.status(500).json({ message: 'Error redirecting' });
    }
};

// Controller to get analytics for a short URL
exports.getShortUrlAnalytics = async (req, res) => {
    try {
        const { shortCode } = req.params;
        const shortUrl = await ShortUrl.findOne({ shortCode }).populate('createdBy', 'username email');
        if (!shortUrl) {
            return res.status(404).json({ message: 'Short URL not found' });
        }
        res.status(200).json({
            originalUrl: shortUrl.originalUrl,
            shortUrl: `${req.headers.host}/${shortUrl.shortCode}`,
            clicks: shortUrl.clicks,
            createdBy: shortUrl.createdBy,
            createdAt: shortUrl.createdAt
        });
    } catch (error) {
        console.error('Error fetching short URL analytics:', error);
        res.status(500).json({ message: 'Error fetching short URL analytics' });
    }
};

// Controller to get all short URLs created by the logged-in user (optional)
exports.getUserShortUrls = async (req, res) => {
    try {
        const shortUrls = await ShortUrl.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(shortUrls);
    } catch (error) {
        console.error('Error fetching users short URLs:', error);
        res.status(500).json({ message: 'Error fetching user\'s short URLs' });
    }
};