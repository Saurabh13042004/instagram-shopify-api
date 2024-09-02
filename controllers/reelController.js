const axios = require('axios');
const Reel = require('../models/Reel');

// Fetch Reels from Instagram API
const fetchInstagramReels = async (req, res) => {
  const username = req.params.username;
  const accessToken = req.body.accessToken || req.query.accessToken;

  if (!accessToken) {
    return res.status(400).json({ success: false, message: 'Access token is required' });
  }

  try {
    // Fetch Instagram user data
    const userResponse = await axios.get(`https://graph.facebook.com/v20.0/me/accounts?fields=instagram_business_account{id}&access_token=${accessToken}`);
    const userId = userResponse.data.data[0].instagram_business_account.id;

    // Fetch Instagram Reels data
    let reels = [];
    let nextPageUrl = `https://graph.facebook.com/v20.0/${userId}?fields=business_discovery.username(${username}){media{media_url,media_type,id}}&access_token=${accessToken}`;

    while (nextPageUrl && reels.length < 10) {
      const response = await axios.get(nextPageUrl);
      const data = response.data;
      const mediaData = data.business_discovery.media.data;

      // Filter and add valid Reels
      mediaData.forEach(media => {
        if (media.media_type === 'VIDEO' && media.media_url && reels.length < 10) {
          reels.push({
            media_url: media.media_url,
            media_type: media.media_type,
            instagram_id: media.id,
          });
        }
      });

      // Check if there's a next page and limit not reached
      if (data.business_discovery.media.paging && data.business_discovery.media.paging.cursors && data.business_discovery.media.paging.cursors.after) {
        const nextCursor = data.business_discovery.media.paging.cursors.after;
        nextPageUrl = `https://graph.facebook.com/v20.0/${userId}?fields=business_discovery.username(${username}){media.after(${nextCursor}){media_url,media_type,id}}&access_token=${accessToken}`;
      } else {
        nextPageUrl = null;
      }
    }

    // Store Reels in the database
    await Reel.deleteMany({}); // Clear existing Reels
    const savedReels = await Reel.insertMany(reels);

    res.status(200).json({ success: true, reels: savedReels });
  } catch (error) {
    console.error('Error fetching reels:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch reels' });
  }
};

// Get Reels from the database
const getReels = async (req, res) => {
  try {
    const reels = await Reel.find().sort({ created_at: -1 });
    res.status(200).json({ success: true, reels });
  } catch (error) {
    console.error('Error retrieving reels:', error.message);
    res.status(500).json({ success: false, message: 'Failed to retrieve reels' });
  }
};


//Delete Reels from the database
const deleteReels = async (req, res) => {
  try {
    const reels = await Reel.deleteMany({}).sort({ created_at: -1 });
    res.status(200).json({ success: true, reels });
  } catch (error) {
    console.error('Error deleting reels:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete reels' });
  }
};

module.exports = { fetchInstagramReels, getReels,deleteReels };
