import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CreatePodcast = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [audioUrl, setAudioUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [tags, setTags] = useState('');
    const [categories, setCategories] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        try {
            const response = await api.post('/api/episodes', {
                title,
                description,
                releaseDate,
                audioUrl,
                videoUrl,
                tags: tags.split(',').map(tag => tag.trim()),
                categories: categories.split(',').map(cat => cat.trim()),
            });
            setSuccessMessage(response.data.message);
            setTimeout(() => navigate('/podcasts'), 1500); // Redirect after success
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create podcast');
        }
    };

    return (
        <div>
            <h2>Create New Podcast Episode</h2>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="releaseDate">Release Date:</label>
                    <input type="date" id="releaseDate" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="audioUrl">Audio URL:</label>
                    <input type="text" id="audioUrl" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} />
                    {/* Add file upload component here or link to upload page */}
                </div>
                <div>
                    <label htmlFor="videoUrl">Video URL:</label>
                    <input type="text" id="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                    {/* Add file upload component here or link to upload page */}
                </div>
                <div>
                    <label htmlFor="tags">Tags (comma-separated):</label>
                    <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="categories">Categories (comma-separated):</label>
                    <input type="text" id="categories" value={categories} onChange={(e) => setCategories(e.target.value)} />
                </div>
                <button type="submit">Create Podcast</button>
            </form>
        </div>
    );
};

export default CreatePodcast;