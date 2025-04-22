const axios = require('axios');

const igUserId = process.env.INSTAID;
const accessToken = process.env.INSTATOKEN;

// 📥 Récupérer les publications
exports.getInstagramPosts = async (req, res) => {
  console.log(' [CONTROLLER] ➤ GET /api/socialauth/instagram/posts');

  if (!igUserId || !accessToken) {
    console.error('INSTAID ou INSTATOKEN manquant dans les variables d’environnement');
    return res.status(500).json({ error: 'INSTAID ou INSTATOKEN manquant.' });
  }

  console.log(' INSTAID:', igUserId);
  console.log(' Token partiel:', accessToken.slice(0, 15) + '...');

  try {
    const response = await axios.get(`https://graph.facebook.com/v19.0/${igUserId}/media`, {
      params: {
        access_token: accessToken,
        fields: 'id,caption,media_type,media_url,permalink,timestamp,thumbnail_url,like_count,comments_count'
      },
    });

    const posts = response.data.data;
    console.log(`${posts.length} publications Instagram reçues.`);

    res.json(posts);
  } catch (error) {
    console.error(' Erreur lors de la requête à Instagram Graph API :');
    console.error(error.response?.data || error.message);

    res.status(500).json({ error: 'Erreur lors de la récupération des publications Instagram.' });
  }
};

// 📥 Récupérer une publication par ID
exports.getInstagramPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`https://graph.facebook.com/v19.0/${id}`, {
      params: {
        access_token: accessToken,
        fields: 'id,caption,media_type,media_url,permalink,timestamp,thumbnail_url,like_count,comments_count'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Erreur récupération d’un post Instagram :", error.response?.data || error.message);
    res.status(500).json({ error: "Impossible de récupérer la publication." });
  }
};

// 💬 Récupérer les commentaires
exports.getInstagramPostComments = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`https://graph.facebook.com/v19.0/${id}/comments`, {
      params: {
        access_token: accessToken,
        fields: 'id,text,username,like_count,timestamp'
      }
    });

    res.json(response.data.data || []);
  } catch (error) {
    console.error("Erreur récupération des commentaires :", error.response?.data || error.message);
    res.status(500).json({ error: "Impossible de récupérer les commentaires." });
  }
};

// 📊 Récupérer les insights analytiques (vues, impressions, reach, engagement)
exports.getInstagramPostInsights = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`https://graph.facebook.com/v19.0/${id}/insights`, {
      params: {
        access_token: accessToken,
        metric: 'impressions,reach,engagement,video_views'
      }
    });

    res.json(response.data.data || []);
  } catch (error) {
    console.error("Erreur récupération des insights :", error.response?.data || error.message);
    res.status(500).json({ error: "Impossible de récupérer les insights du post." });
  }
};

// 📸 Récupérer les stories du compte
exports.getInstagramStories = async (req, res) => {
  try {
    const response = await axios.get(`https://graph.facebook.com/v19.0/${igUserId}/stories`, {
      params: {
        access_token: accessToken,
        fields: 'id,media_type,media_url,timestamp'
      }
    });

    res.json(response.data.data || []);
  } catch (error) {
    console.error("Erreur récupération des stories :", error.response?.data || error.message);
    res.status(500).json({ error: "Impossible de récupérer les stories." });
  }
};
