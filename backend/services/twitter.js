import { TwitterApi } from 'twitter-api-v2';

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

export const postToTwitter = async ({ message }) => {
  try {
    const client = twitterClient.readWrite;
    const tweet = await client.v2.tweet(message);
    return tweet;
  } catch (err) {
    console.error('Twitter error:', err);
    throw new Error('Failed to post tweet');
  }
};
