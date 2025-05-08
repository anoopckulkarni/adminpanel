const mongoose = require('mongoose');
const shortid = require('shortid');

const shortUrlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true, default: shortid.generate },
    clicks: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ShortUrl', shortUrlSchema);