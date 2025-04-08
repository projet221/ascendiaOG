const axios = require("axios");

const pageId = process.env.FACEBOOK_CLIENT_ID;
const accessToken = process.env.FACEBOOK_PAGE_TOKEN;

exports.getFacebookPosts = async (req, res) => {
  console.log(" [CONTROLLER] ➤ GET /api/facebook/posts appelée");

  if (!pageId || !accessToken) {
    console.error("FACEBOOK_PAGE_ID ou FACEBOOK_PAGE_TOKEN manquant");
    return res.status(500).json({ error: "Variables d’environnement Facebook manquantes." });
  }

  console.log(" PAGE ID:", pageId);
  console.log(" Token partiel:", accessToken.slice(0, 15) + "...");

  try {
    const response = await axios.get(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      params: {
        access_token: accessToken,
        fields:
          "id,message,full_picture,created_time,permalink_url,likes.summary(true),comments.summary(true)",
      },
    });

    const posts = response.data.data || [];
    console.log(`${posts.length} publications Facebook reçues.`);

    res.json(posts);
  } catch (error) {
    console.error(" Erreur lors de la requête à Facebook Graph API :");
    console.error(error.response?.data || error.message);

    res.status(500).json({ error: "Erreur lors de la récupération des publications Facebook." });
  }
};
