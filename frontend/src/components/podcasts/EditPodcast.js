import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EditPodcast = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [podcast, setPodcast] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [audioUrl, setAudioUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [tags, setTags] = useState('');
    const [categories, setCategories] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPodcast = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/episodes/${id}`);
                setPodcast(response.data);
                setTitle(response.data.title);
                setDescription(response.data.description || '');
                setReleaseDate(response.data.releaseDate ? response.data.releaseDate.slice(0, 10) : '');
                setAudioUrl(response.data.audioUrl || '');
                setVideoUrl(response.data.videoUrl || '');
                setTags(response.data.tags ? response.data.tags.join(', ') : '');
                setCategories(response.data.categories ? response.data.categories.join(', ') : '');
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch podcast details');
            } finally {
                setLoading(false);
            }
        };

        fetchPodcast();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        try {
            const response = await api.put(`/api/episodes/${id}`, {
                title,
                description,
                releaseDate,
                audioUrl,
                videoUrl,
                tags: tags.split(',').map(tag => tag.trim()),
                categories: categories.split(',').map(cat => cat.trim()),
            });
            setSuccessMessage(response.data.message);
            setTimeout(() => navigate('/podcasts'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update podcast');
        }
    };

    if (loading) {
        return <div>Loading podcast details...</div>;
    }

    if (!podcast) {
        return <div>Podcast not found.</div>;
    }

    return (
        <div>
            <h2>Edit Podcast Episode</h2>
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
                </div>
                <div>
                    <label htmlFor="videoUrl">Video URL:</label>
                    <input type="text" id="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="tags">Tags (comma-separated):</label>
                    <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="categories">Categories (comma-separated):</label>
                    <input type="text" id="categories" value={categories} onChange={(e) => setCategories(e.target.value)} />
                </div>
                <button type="submit">Update Podcast</button>
            </form>
        </div>
    );
};

export default EditPodcast;