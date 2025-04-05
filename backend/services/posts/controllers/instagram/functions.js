const axios = require("axios");
const SocialAuth = require("../../../socialAuth/models/SocialAuth");

const getInstagramPostStats = async (req, res) => {
  const userId = req.params.userId;

  try {
    const auth = await SocialAuth.findOne({ user: userId, provider: "instagram" });

    if (!auth) {
      return res.status(404).json({ message: "Instagram non connecté" });
    }

    const accessToken = auth.accessToken;
    const igUserId = auth.profile.id;

    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${igUserId}/media`,
      {
        params: {
          access_token: accessToken,
          fields: 'id,caption,media_type,media_url,permalink,timestamp,thumbnail_url',
        },
      }
    );

    return res.status(200).json(response.data.data);
  } catch (err) {
    console.error("Erreur récupération stats IG :", err.response?.data || err.message);
    return res.status(500).json({ message: "Erreur lors de la récupération des posts Instagram." });
  }
};

module.exports = {
  getInstagramPostStats,
};
