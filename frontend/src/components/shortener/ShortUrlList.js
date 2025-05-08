import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const ShortUrlList = () => {
    const [shortUrls, setShortUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserShortUrls = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/short/me');
                setShortUrls(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch your short URLs');
            } finally {
                setLoading(false);
            }
        };

        fetchUserShortUrls();
    }, []);

    if (loading) {
        return <div>Loading your short URLs...</div>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div>
            <h3>Your Shortened URLs</h3>
            {shortUrls.length === 0 ? (
                <p>No short URLs created yet.</p>
            ) : (
                <ul>
                    {shortUrls.map((url) => (
                        <li key={url._id}>
                            Original: <a href={url.originalUrl} target="_blank" rel="noopener noreferrer">{url.originalUrl}</a> - Short: <a href={`/${url.shortCode}`} target="_blank" rel="noopener noreferrer">{window.location.origin}/{url.shortCode}</a>
                            <Link to={`/analytics/short/${url.shortCode}`}>Analytics</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ShortUrlList;