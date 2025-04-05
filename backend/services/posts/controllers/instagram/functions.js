// controllers/instagram/functions.js

const Post = require("../../models/Post");

const getInstagramPostsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const posts = await Post.find({
      user: userId,
      provider: "instagram", // Assurez-vous que les posts ont bien ce champ
    }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Erreur récupération posts Instagram :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  getInstagramPostsByUser,
};
