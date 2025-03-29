const Post = require('../models/Post');
const { TwitterApi } = require("twitter-api-v2");
const { tweetWithImage } = require('./twitter/functions');
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
            console.log("file recu",req.file); // ça plante
            const { userId, networks, message } = req.body;
            const fileBuffer = req.file ? req.file.buffer : null;
            const mimeType = req.file ? req.file.mimetype : null;
            const scheduleDate = req.scheduleDate;
            //demande de token associé à un user id
            const response = await axios.get(process.env.PROXY_GATEWAY+`/api/socialauth/tokens/${userId}`);
            //console.log(response.data);
            console.log("userid:"+userId+", message:"+message + " "+networks + " "+typeof(networks) +" " +networks.includes("twitter"));
            //si twitter fait parti des choix frontend

            
            if(networks.includes("twitter")){

                const {accessToken, secretToken} = response.data.filter(item => item.provider === "twitter")[0];
                console.log("access token twitter"+accessToken,"access token secret"+secretToken);
                const client = new TwitterApi({
                appKey: process.env.TWITTER_KEY,
                appSecret: process.env.TWITTER_SECRET,
                accessToken: accessToken,
                accessSecret: secretToken,
                });

                //const bearer = new TwitterApi(process.env.TWITTER_BEARER);

                const twitterClient = client.readWrite;
                //const twitterBearer = bearer.readOnly;

                    //const filepath = URL.createObjectURL(fichier);
                    console.log("le fichier en buffer :",fileBuffer);
                    await tweetWithImage(fileBuffer,mimeType,message,twitterClient);

            
        }


            res.status(200).json({ message: "Post publié avec succès" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
        // Planifier une publication
        schedulePost: async (req, res) => {
            try {
                let mediaFiles = [];
                const {userId, message, networks,scheduleDate} = req.body;
                    if (req.file) {  // Si un fichier a été uploadé
                        mediaFiles.push({
                            data: req.file.buffer,  // Enregistrement du Buffer
                            contentType: req.file.mimetype  // Enregistrement du type MIME
                        });
                    }
                    const newPost = new Post({
                        userId: userId,  // Remplace par un vrai ID d'utilisateur
                        content: message,
                        platform: networks,
                        mediaFiles: mediaFiles,
                        scheduledFor: new Date(scheduleDate),  // Planifié pour le 2 avril 2025 à 14h
                        status: "scheduled",
                    });
    
                    
                    newPost.save()
                    .then(savedPost => {
                        console.log('Post enregistré avec succès:', savedPost);
                    })
                    .catch(err => {
                        console.log('Erreur lors de l\'enregistrement du post:', err);
                    });
                    res.status(200).json({ message: "Post publié avec succès" });

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
