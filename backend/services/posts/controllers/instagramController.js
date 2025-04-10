const axios = require('axios');


exports.getInstagramPosts = async (req, res) => {
  console.log(' [CONTROLLER] ➤ GET /api/instagram/posts appelée');
  const id = req.params.id;
  const response = await axios.get(`${process.env.PROXY_GATEWAY}/api/socialauth/tokens/${id}`);
  console.log('access token twitter',id);
  const tokens = response.data;
  InstaTokens = tokens.find(item => item.provider === "instagram");
  const igUserId = InstaTokens.profile.id;
  const accessToken = InstaTokens.accessToken;

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
