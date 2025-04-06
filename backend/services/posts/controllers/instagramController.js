const express = require('express');
const router = express.Router();
const axios = require('axios');

const igUserId = process.env.INSTAID;
const accessToken = process.env.INSTATOKEN;

// Route GET /api/instagram/posts
router.get('/posts', async (req, res) => {
  try {
    const response = await axios.get(`https://graph.facebook.com/v22.0/${igUserId}/media`, {
      params: {
        access_token: accessToken,
        fields: 'id,caption,media_type,media_url,permalink,timestamp,thumbnail_url',
      },
    });
    res.json(response.data.data);
  } catch (error) {
    console.error('Erreur Instagram API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur récupération des publications Instagram.' });
  }
});

module.exports = router;
