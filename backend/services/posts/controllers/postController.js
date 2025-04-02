const sharp = require('sharp');  // Import de sharp
const fs = require('fs');  // Import de fs pour gérer les fichiers
const { TwitterApi } = require("twitter-api-v2");
const { tweetWithImage } = require('./twitter/functions');
const axios = require("axios");

const postController = {
    // Récupérer toutes les publications
    getAllPosts: async (req, res) => {
        try {
            const network = req.params.networks;
            const id = req.params.id;
            const response = await axios.get(`${process.env.PROXY_GATEWAY}/api/socialauth/tokens/${id}`);
            console.log('access token twitter',id);
            const tokens = response.data;
            console.log("mes tokens", tokens);
            switch (network) {
                case 'twitter': {
                    const twitterTokens = tokens.find(item => item.provider === "twitter");
                    
                    if (!twitterTokens) {
                        return res.status(400).json({ error: "Twitter tokens not found" });
                    }
    
                    const client = new TwitterApi({
                        appKey: process.env.TWITTER_KEY,
                        appSecret: process.env.TWITTER_SECRET,
                        accessToken: twitterTokens.accessToken,
                        accessSecret: twitterTokens.secretToken,
                    });
                
                    const twitterClient = client.readWrite;
                
                    try {
                        // Get the authenticated user's data
                        const { data: user } = await twitterClient.v2.me({
                            "user.fields": ["id", "name", "username", "profile_image_url"],
                        });
                        const userId = user.id;
                        //recuperer les tweets avec l'id
                        const tweets = await twitterClient.v2.userTimeline(userId, {
                            expansions: ['author_id', 'attachments.media_keys'],
                            'tweet.fields': ['created_at', 'public_metrics', 'text', 'attachments'],
                            'media.fields': ['url', 'preview_image_url'],
                            max_results: 100, // Max allowed per request (default: 10)
                        
                        });
                        const allTweets = [];
                        for await (const tweet of tweetIterator) {
                            allTweets.push(tweet);
                        }
                        tweets: allTweets.map(tweet => ({
                            id: tweet.id,
                            text: tweet.text,
                            date: tweet.created_at,
                            likes: tweet.public_metrics?.like_count || 0,
                            retweets: tweet.public_metrics?.retweet_count || 0,
                            media: tweet.attachments?.media_keys?.map(key => 
                                tweet.includes?.media?.find(m => m.media_key === key)?.url
                            ) || []
                        }))
                        
                        return res.status(200).json(tweets); // Send response to client
                    } catch (twitterError) {
                        console.error("Twitter API Error:", twitterError);
                        return res.status(500).json({ error: "Failed to fetch Twitter user data" });
                    }
                    break;
                }
                default:
                    return res.status(400).json({ error: "Unsupported network" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Créer une nouvelle publication
    createPost: async (req, res) => {
        try {
            console.log("Fichier reçu :", req.file);
            console.log("\ndata :", req.body);
            let { userId, networks, message } = req.body;
            const fileBuffer = req.file ? req.file.buffer : null;
            const mimeType = req.file ? req.file.mimetype : null;
            networks = JSON.parse(networks);

            //const scheduleDate = req.scheduleDate;

            // Demande de token associé à un user id
            const response = await axios.get(`${process.env.PROXY_GATEWAY}/api/socialauth/tokens/${userId}`);
            const tokens = response.data;

            // Parcours des réseaux sociaux sélectionnés
            for (const network of networks) {
                switch (network) {
                    case "twitter":
                        console.log("twitter détecté : Test du Post");
                        const twitterTokens = tokens.find(item => item.provider === "twitter");
                        if (twitterTokens) {
                            const client = new TwitterApi({
                                appKey: process.env.TWITTER_KEY,
                                appSecret: process.env.TWITTER_SECRET,
                                accessToken: twitterTokens.accessToken,
                                accessSecret: twitterTokens.secretToken,
                            });
                            const twitterClient = client.readWrite;
                            console.log(`Envoi à Twitter avec message : ${message}`);

                            await tweetWithImage(fileBuffer, mimeType, message, twitterClient);
                        }
                        break;

                    case "facebook":
                        const facebookTokens = tokens.find(item => item.provider === "facebook");
                        if (facebookTokens) {
                            graph.setAccessToken(facebookTokens.accessToken);
                            if (fileBuffer) {
                                const formData = {
                                    message,
                                    source: {
                                        value: fileBuffer,
                                        options: { filename: "image.jpg", contentType: mimeType }
                                    }
                                };
                                await graph.post('/me/photos', formData);
                            } else {
                                await graph.post('/me/feed', { message });
                            }
                        }
                        break;

                    case "instagram":
                        const instagramTokens = tokens.find(item => item.provider === "instagram");
                        if (!fileBuffer) {
                            return res.status(400).json({ error: "Instagram requiert une image pour publier." });
                        }

                        // Si le réseau social est Instagram, on convertit l'image en JPEG
                        if (instagramTokens) {
                            // Conversion de l'image en JPEG et stockage temporaire
                            const tempFilePath = `./uploads/temp_image_${Date.now()}.jpg`;
                            await sharp(fileBuffer)
                            .jpeg({ quality: 90 })  // Conversion en JPEG avec une qualité de 90
                            .toFile(tempFilePath);  // Sauvegarde du fichier converti

                            console.log("Image convertie et sauvegardée temporairement à :", tempFilePath);

                            const formData = new FormData();
                            formData.append("image", fs.createReadStream(tempFilePath), { filename: "image.jpg", contentType: mimeType });
                            formData.append("caption", message);

                            const response = await axios.post(
                                `https://graph.facebook.com/v18.0/${instagramTokens.userId}/media`,
                                formData,
                                {
                                    headers: { Authorization: `Bearer ${instagramTokens.accessToken}`, ...formData.getHeaders() }
                                }
                            );

                            const creationId = response.data.id;
                            await axios.post(
                                `https://graph.facebook.com/v18.0/${instagramTokens.userId}/media_publish`,
                                { creation_id: creationId },
                                { headers: { Authorization: `Bearer ${instagramTokens.accessToken}` } }
                            );

                            // Suppression de l'image après l'envoi réussi
                            fs.unlinkSync(tempFilePath); // Supprime le fichier après utilisation
                            console.log("Image supprimée du serveur après l'envoi.");
                        }
                        break;
                }
            }

            res.status(200).json({ message: "Post publié avec succès" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
,
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



    // Récupérer une publication par ID
    getPostById: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id)
                .populate('userId', 'username email');
            if (!post) return res.status(404).json({ message: 'Publication non trouvée' });
            res.json(post);
        } catch (error) {
            console.error("Erreur :", error);
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