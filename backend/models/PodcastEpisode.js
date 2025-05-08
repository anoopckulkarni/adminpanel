const mongoose = require('mongoose');

const podcastEpisodeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true, trim: true }, // For SEO-friendly URLs
    description: { type: String },
    releaseDate: { type: Date },
    audioUrl: { type: String }, // URL to the audio file
    videoUrl: { type: String }, // URL to the video file (if applicable)
    tags: [{ type: String }],
    categories: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware to generate a unique slug before saving
podcastEpisodeSchema.pre('save', function(next) {
    if (!this.isModified('title')) {
        return next();
    }
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    // Add logic to ensure uniqueness if needed (e.g., appending a counter)
    next();
});

module.exports = mongoose.model('PodcastEpisode', podcastEpisodeSchema);