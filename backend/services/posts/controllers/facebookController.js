const axios = require("axios");

//const pageId = process.env.FACEBOOK_PAGE_ID;
//const accessToken = process.env.FACEBOOK_PAGE_TOKEN;

async function getUserPages(accessToken) {
  const url = `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`;
  const res = await axios.get(url);
  return res.data.data; // Liste des pages
}
exports.getFacebookPosts = async (req, res) => {
  console.log(" [CONTROLLER] ➤ GET /api/facebook/posts appelée");

  const id = req.params.id;
  const response = await axios.get(`${process.env.PROXY_GATEWAY}/api/socialauth/tokens/${id}`);
  console.log("tokennnnnnnnnnns", response);
  const tokens = response.data;
  const facebookTokens = tokens.find(item => item.provider === "facebook");
                    
                    if (!facebookTokens) {
                        return res.status(400).json({ error: "Twitter tokens not found" });
                    }
  console.log("mes tokens", tokens);

  const accessToken = facebookTokens.accessToken;



  const pages = await getUserPages(accessToken);
  const pageId = pages[0].id;
  const accessToken_page = pages[0].access_token;

  if (!pageId || !accessToken) {
    console.error("FACEBOOK_PAGE_ID ou FACEBOOK_PAGE_TOKEN manquant");
    return res.status(500).json({ error: "Variables d’environnement Facebook manquantes." });
  }

  console.log(" PAGE ID:", pageId);
  console.log(" Token partiel:", accessToken.slice(0, 15) + "...");

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${pageId}/feed`,
      {
        params: {
          access_token: accessToken_page,
          fields: "id,message,full_picture,created_time,permalink_url,likes.summary(true),comments.summary(true)",
        },
      }
    );

    const posts = response.data.data || [];
    console.log(`${posts.length} publications Facebook reçues.`);
    console.log(posts);

    res.json(posts);
  } catch (error) {
    console.error(" Erreur lors de l'appel à Facebook Graph API :");
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Erreur lors de la récupération des publications Facebook." });
  }
};

  exports.getFacebookPostById = async (req, res) => {
    const { id } = req.params;
    const accessToken = process.env.INSTATOKEN;
  
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
  
  exports.getFacebookPostComments = async (req, res) => {
    const { id } = req.params;
    const accessToken = process.env.INSTATOKEN;
  
    try {
      const response = await axios.get(`https://graph.facebook.com/v19.0/${id}/comments`, {
        params: {
          access_token: accessToken,
          fields: 'id,text,username,like_count,timestamp'
        }
      });
      console.log(response.data);
      res.json(response.data.data || []);
    } catch (error) {
      console.error("Erreur récupération des commentaires :", error.response?.data || error.message);
      res.status(500).json({ error: "Impossible de récupérer les commentaires." });
    }
  };

