const Post = require('../models/Post');
const { TwitterApi } = require("twitter-api-v2");
const { tweetWithImage } = require('./twitter/functions');
const { download } = require("./twitter/utilities");
const axios = require("axios");

const postController = {
    // Récupérer toutes les publications
    getAllPosts: async (req, res) => {
        try {
            const posts = await Post.find()
                .populate('userId', 'username email')
                .sort({ createdAt: -1 });
            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Créer une nouvelle publication
    createPost: async (req, res) => {
        try {
            const {userId, networks, message} = req.body;
            const response = await axios.get(process.env.PROXY_GATEWAY+`/api/socialauth/tokens/${userId}`);
            console.log("userid:"+userId+", message:"+message);
            const {access_token,access_secret} = response.data.filter(item => item.provider === "twitter")[0];
            const client = new TwitterApi({
            appKey: process.env.TWITTER_KEY,
            appSecret: process.env.TWITTER_SECRET,
            accessToken: access_token,
            accessSecret: access_secret,
            });

            const bearer = new TwitterApi(process.env.TWITTER_BEARER);

            const twitterClient = client.readWrite;
            const twitterBearer = bearer.readOnly;

            
            tweetWithImage(null,message,twitterClient);
            res.status(201).json("publication réussie");
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Récupérer une publication par ID
    getPostById: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id)
                .populate('userId', 'username email');
            if (!post) return res.status(404).json({ message: 'Publication non trouvée' });
            res.json(post);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Mettre à jour une publication
    updatePost: async (req, res) => {
        try {
            const post = await Post.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true, runValidators: true }
            ).populate('userId', 'username email');

            if (!post) return res.status(404).json({ message: 'Publication non trouvée' });
            res.json(post);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Supprimer une publication
    deletePost: async (req, res) => {
        try {
            const post = await Post.findByIdAndDelete(req.params.id);
            if (!post) return res.status(404).json({ message: 'Publication non trouvée' });
            res.json({ message: 'Publication supprimée avec succès' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Récupérer les publications d'un utilisateur
    getUserPosts: async (req, res) => {
        try {
            const posts = await Post.find({ userId: req.params.userId })
                .populate('userId', 'username email')
                .sort({ createdAt: -1 });
            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Planifier une publication
    schedulePost: async (req, res) => {
        try {
            const post = await Post.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        scheduledFor: req.body.scheduledFor,
                        status: 'scheduled'
                    }
                },
                { new: true, runValidators: true }
            );

            if (!post) return res.status(404).json({ message: 'Publication non trouvée' });
            res.json(post);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Mettre à jour les analytics d'une publication
    updateAnalytics: async (req, res) => {
        try {
            const post = await Post.findByIdAndUpdate(
                req.params.id,
                { $set: { analytics: req.body.analytics } },
                { new: true }
            );

            if (!post) return res.status(404).json({ message: 'Publication non trouvée' });
            res.json(post);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = postController;
