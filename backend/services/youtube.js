import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

const CLIENT_ID = process.env.YT_CLIENT_ID;
const CLIENT_SECRET = process.env.YT_CLIENT_SECRET;
const REDIRECT_URI = process.env.YT_REDIRECT_URI;
const REFRESH_TOKEN = process.env.YT_REFRESH_TOKEN; // Securely store & retrieve

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client,
});

export const uploadToYouTube = async ({ title, description, tags, videoPath, thumbnailPath }) => {
  const res = await youtube.videos.insert({
    part: 'snippet,status',
    requestBody: {
      snippet: {
        title,
        description,
        tags,
        categoryId: '22', // People & Blogs
      },
      status: {
        privacyStatus: 'public',
      },
    },
    media: {
      body: fs.createReadStream(videoPath),
    },
  });

  if (thumbnailPath) {
    await youtube.thumbnails.set({
      videoId: res.data.id,
      media: {
        body: fs.createReadStream(thumbnailPath),
      },
    });
  }

  return res.data;
};
