const express = require('express');
const axios = require('axios');
const router = express.Router();

const igUserId = 17841472341351112;
const accessToken = process.env.INSTATOKEN;

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
    console.error('❌ Erreur Instagram API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des publications Instagram.' });
  }
});

module.exports = router;
