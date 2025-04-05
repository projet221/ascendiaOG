const axios = require("axios");
const SocialAuth = require("../../models/SocialAuth");

const getInstagramPostsFromApi = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Récupère l'enregistrement SocialAuth pour Instagram
    const auth = await SocialAuth.findOne({
      user: userId,
      provider: "instagram",
    });

    if (!auth) {
      return res.status(404).json({ message: "Aucun compte Instagram connecté." });
    }

    const accessToken = auth.accessToken;
    const igUserId = auth.profile.id;

    // Appel de l'API Instagram Graph
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${igUserId}/media`,
      {
        params: {
          fields: "id,caption,media_url,timestamp",
          access_token: accessToken,
        },
      }
    );

    res.status(200).json(response.data.data); // tableau de posts
  } catch (error) {
    console.error("Erreur récupération posts IG:", error.response?.data || error.message);
    res.status(500).json({ message: "Erreur lors de la récupération des publications Instagram." });
  }
};

module.exports = {
  getInstagramPostsFromApi,
};
