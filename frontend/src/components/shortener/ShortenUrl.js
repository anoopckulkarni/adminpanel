import React, { useState } from 'react';
import api from '../../services/api';

const ShortenUrl = () => {
    const [originalUrl, setOriginalUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setShortUrl('');
        try {
            const response = await api.post('/api/shorten', { originalUrl });
            setShortUrl(response.data.shortUrl);
            setOriginalUrl('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to shorten URL');
        }
    };

    return (
        <div>
            <h2>URL Shortener</h2>
            {error && <p className="error-message">{error}</p>}
            {shortUrl && <p>Shortened URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="originalUrl">Original URL:</label>
                    <input
                        type="url"
                        id="originalUrl"
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Shorten URL</button>
            </form>
        </div>
    );
};

export default ShortenUrl;