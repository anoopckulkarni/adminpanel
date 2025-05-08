const PodcastEpisode = require('../models/PodcastEpisode');
const slugify = require('slugify'); // You might want to use a dedicated slugify library

// Controller to create a new podcast episode
exports.createEpisode = async (req, res) => {
    try {
        const { title, description, releaseDate, tags, categories, audioUrl, videoUrl } = req.body;
        const slug = slugify(title, { lower: true });
        const newEpisode = new PodcastEpisode({
            title,
            slug,
            description,
            releaseDate,
            tags,
            categories,
            audioUrl,
            videoUrl,
            createdBy: req.user.id // Assuming user is authenticated
        });
        await newEpisode.save();
        res.status(201).json({ message: 'Podcast episode created successfully', episode: newEpisode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating podcast episode' });
    }
};

// Controller to get all podcast episodes
exports.getAllEpisodes = async (req, res) => {
    try {
        const episodes = await PodcastEpisode.find().populate('createdBy', 'username email');
        res.status(200).json(episodes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching podcast episodes' });
    }
};

// Controller to get a single podcast episode by ID
exports.getEpisodeById = async (req, res) => {
    try {
        const episode = await PodcastEpisode.findById(req.params.id).populate('createdBy', 'username email');
        if (!episode) {
            return res.status(404).json({ message: 'Podcast episode not found' });
        }
        res.status(200).json(episode);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching podcast episode' });
    }
};

// Controller to update a podcast episode
exports.updateEpisode = async (req, res) => {
    try {
        const { title, description, releaseDate, tags, categories, audioUrl, videoUrl } = req.body;
        const slug = title ? slugify(title, { lower: true }) : undefined;
        const updatedEpisode = await PodcastEpisode.findByIdAndUpdate(
            req.params.id,
            { title, slug, description, releaseDate, tags, categories, audioUrl, videoUrl, updatedAt: Date.now() },
            { new: true, runValidators: true }
        ).populate('createdBy', 'username email');
        if (!updatedEpisode) {
            return res.status(404).json({ message: 'Podcast episode not found' });
        }
        res.status(200).json({ message: 'Podcast episode updated successfully', episode: updatedEpisode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating podcast episode' });
    }
};

// Controller to delete a podcast episode
exports.deleteEpisode = async (req, res) => {
    try {
        const deletedEpisode = await PodcastEpisode.findByIdAndDelete(req.params.id);
        if (!deletedEpisode) {
            return res.status(404).json({ message: 'Podcast episode not found' });
        }
        res.status(200).json({ message: 'Podcast episode deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting podcast episode' });
    }
};