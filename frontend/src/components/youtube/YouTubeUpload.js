import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const YouTubeUpload = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [privacyStatus, setPrivacyStatus] = useState('private');
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    const [authUrl, setAuthUrl] = useState('');

    useEffect(() => {
        const fetchAuthUrl = async () => {
            try {
                const response = await api.get('/api/auth/google');
                setAuthUrl(response.data.authUrl);
            } catch (error) {
                console.error('Error fetching Google Auth URL:', error);
                setUploadError('Failed to fetch Google authentication URL.');
            }
        };

        fetchAuthUrl();
    }, []);

    const handleFileChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploadError('');
        setUploadSuccess('');

        if (!videoFile) {
            setUploadError('Please select a video file.');
            return;
        }

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('tags', tags);
        formData.append('privacyStatus', privacyStatus);

        try {
            const response = await api.post('/api/upload/youtube', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadSuccess(response.data.message);
            // Optionally clear the form
            setTitle('');
            setDescription('');
            setTags('');
            setVideoFile(null);
        } catch (err) {
            setUploadError(err.response?.data?.message || 'Failed to upload video to YouTube.');
        }
    };

    return (
        <div>
            <h2>Upload to YouTube</h2>
            {uploadError && <p className="error-message">{uploadError}</p>}
            {uploadSuccess && <p className="success-message">{uploadSuccess}</p>}

            {authUrl ? (
                <p><a href={authUrl} target="_blank" rel="noopener noreferrer">Authorize with Google to Upload</a></p>
            ) : (
                <p>Fetching Google authentication URL...</p>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="videoFile">Video File:</label>
                    <input type="file" id="videoFile" accept="video/*" onChange={handleFileChange} required />
                    {videoFile && <p>Selected file: {videoFile.name}</p>}
                </div>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="tags">Tags (comma-separated):</label>
                    <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="privacyStatus">Privacy Status:</label>
                    <select id="privacyStatus" value={privacyStatus} onChange={(e) => setPrivacyStatus(e.target.value)}>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="unlisted">Unlisted</option>
                    </select>
                </div>
                <button type="submit" disabled={!videoFile}>Upload Video</button>
            </form>
        </div>
    );
};

export default YouTubeUpload;