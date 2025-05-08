import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const PodcastList = () => {
    const [podcasts, setPodcasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPodcasts = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/episodes');
                setPodcasts(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch podcasts');
            } finally {
                setLoading(false);
            }
        };

        fetchPodcasts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this episode?')) {
            try {
                await api.delete(`/api/episodes/${id}`);
                setPodcasts(podcasts.filter(podcast => podcast._id !== id));
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete podcast');
            }
        }
    };

    if (loading) {
        return <div>Loading podcasts...</div>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div>
            <h2>Podcast Episodes</h2>
            {podcasts.length === 0 ? (
                <p>No podcasts available.</p>
            ) : (
                <ul>
                    {podcasts.map((podcast) => (
                        <li key={podcast._id}>
                            {podcast.title} - Released: {new Date(podcast.releaseDate).toLocaleDateString()}
                            <Link to={`/podcasts/edit/${podcast._id}`}>Edit</Link>
                            <button onClick={() => handleDelete(podcast._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
            <Link to="/podcasts/create">Add New Podcast</Link>
        </div>
    );
};

export default PodcastList;