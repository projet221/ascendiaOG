const Post = require('../models/Post');
const { tweetWithImage, getAllTweets, getUserId } = require('./twitter/functions');
const axios = require("axios");

const postController = {
  // Récupérer toutes les publications
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.find().populate('userId', 'username email').sort({ createdAt: -1 });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Créer une nouvelle publication
  createPost: async (req, res) => {
    try {
      const { userId, networks, message } = req.body;
      const fileBuffer = req.file ? req.file.buffer : null;
      const mimeType = req.file ? req.file.mimetype : null;

      // Récupérer les tokens associés à l'utilisateur
      const response = await axios.get(`${process.env.PROXY_GATEWAY}/api/socialauth/tokens/${userId}`);
      
      if (networks.includes("twitter")) {
        const { accessToken, secretToken } = response.data.filter(item => item.provider === "twitter")[0];
        const client = new TwitterApi({
          appKey: process.env.TWITTER_KEY,
          appSecret: process.env.TWITTER_SECRET,
          accessToken,
          accessSecret: secretToken,
        });

        const twitterClient = client.readWrite;
        await tweetWithImage(fileBuffer, mimeType, message, twitterClient);
      }

      res.status(200).json({ message: "Post publié avec succès" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Planifier une publication
  schedulePost: async (req, res) => {
    try {
      const { userId, message, networks, scheduleDate } = req.body;
      const mediaFiles = req.file ? [{ data: req.file.buffer, contentType: req.file.mimetype }] : [];

      const newPost = new Post({
        userId,
        content: message,
        platform: networks,
        mediaFiles,
        scheduledFor: new Date(scheduleDate),
        status: "scheduled",
      });

      await newPost.save();
      res.status(200).json({ message: "Post planifié avec succès" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

 const getUserTweets = async (req, res) => {
  try {
    const userId = req.params.userId;  // Récupérer le userId à partir de l'URL
    // Logique pour récupérer les tweets de l'utilisateur (par exemple via une API ou la base de données)
    const tweets = await getTweetsFromDatabaseOrApi(userId);  // Exemple de fonction pour récupérer les tweets

    // Renvoyer les tweets en réponse
    res.status(200).json(tweets);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tweets', error: error.message });
  }
};

// Fonction fictive pour récupérer les tweets d'une source quelconque
async function getTweetsFromDatabaseOrApi(userId) {
  // Par exemple, récupérer des tweets depuis une API externe ou une base de données
  return [
    { id: 1, text: "Premier tweet" },
    { id: 2, text: "Deuxième tweet" },
  ];
}

module.exports = { getUserTweets };

module.exports = postController;
