const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load OAuth 2.0 credentials from environment variables
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Function to get the authentication URL
exports.getAuthUrl = (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline', // Get a refresh token for long-lived access
        scope: ['https://www.googleapis.com/auth/youtube.upload']
    });
    res.json({ authUrl });
};

// Callback after Google authenticates the user
exports.googleCallback = async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // You would typically store these tokens securely in your database
        // associated with the user who authorized the application.
        console.log('Google Tokens:', tokens);

        res.send('Google authentication successful! You can now upload videos.');
        // You might want to redirect the user back to your admin panel
        // res.redirect('/admin');
    } catch (error) {
        console.error('Error retrieving access token:', error);
        res.status(500).json({ message: 'Failed to retrieve Google access token' });
    }
};

// Controller to upload a video to YouTube
exports.uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        // Ensure we have access tokens
        if (!oauth2Client.credentials.access_token) {
            return res.status(401).json({ message: 'Not authorized with Google. Please authenticate first.' });
        }

        const videoPath = path.join(__dirname, '../uploads', req.file.filename); // Adjust path as needed
        const fileSize = fs.statSync(videoPath).size;

        const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

        const request = {
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title: req.body.title || 'Podcast Episode', // Get title from request
                    description: req.body.description || 'Uploaded via Podcast Admin Panel', // Get description
                    tags: req.body.tags ? req.body.tags.split(',') : [] // Get tags
                },
                status: {
                    privacyStatus: req.body.privacyStatus || 'private' // public, private, unlisted
                }
            },
            media: {
                body: fs.createReadStream(videoPath),
            },
        };

        const response = await youtube.videos.insert(request, {
            // Enable chunked uploads for larger files
            media: {
                body: fs.createReadStream(videoPath),
            },
        }, { onUploadProgress: (evt) => {
            const progress = (evt.bytesRead / fileSize) * 100;
            console.log(`${Math.round(progress)}% uploaded`);
            // You could emit this progress to the frontend via WebSockets
        }});

        console.log('YouTube Upload Response:', response.data);
        // Clean up the uploaded file
        fs.unlinkSync(videoPath);

        res.status(200).json({ message: 'Video uploaded to YouTube successfully!', videoUrl: `https://www.youtube.com/watch?v=${response.data.id}` });

    } catch (error) {
        console.error('Error uploading video to YouTube:', error);
        res.status(500).json({ message: 'Failed to upload video to YouTube' });
    }
};