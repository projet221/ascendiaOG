const sharp = require('sharp');  // Import de sharp
const fs = require('fs');  // Import de fs pour gérer les fichiers
const { TwitterApi } = require("twitter-api-v2");
const { tweetWithImage } = require('./twitter/functions');
const axios = require("axios");
const {join} = require("node:path");
const  Post = require("../models/Post");

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
                    const twitterId=twitterTokens.profile.id;
                    if (!twitterTokens) {
                        return res.status(400).json({ error: "Twitter tokens not found" });
                    }
    
                    const client = new TwitterApi({
                        appKey: process.env.TWITTER_KEY,
                        appSecret: process.env.TWITTER_SECRET,
                        accessToken: twitterTokens.accessToken,
                        accessSecret: twitterTokens.secretToken,
                    });
                
                    const twitterClient = client.readOnly;
                
                    try {
                        // Get the authenticated user's data
                        /*const { data: user } = await twitterClient.v2.me({
                            "user.fields": ["id", "name", "username", "profile_image_url"],
                        });*/

                        
                        const userId = twitterId;
                        //recuperer les tweets avec l'id
                        const tweets = await twitterClient.v2.userTimeline(userId, {
                            expansions: ['author_id', 'attachments.media_keys'],
                            'tweet.fields': ['created_at', 'public_metrics', 'text', 'attachments'],
                            'media.fields': ['url', 'preview_image_url'],
                            max_results: 10, // Max allowed per request (default: 10)
                        
                        });
                        const allTweets = [];
                        for await (const tweet of tweetIterator) {
                            allTweets.push(tweet);
                        }
                        allTweets =  allTweets.map(tweet => ({
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
        // Chemin de sauvegarde des médias
        const uploadDir = join(__dirname, 'uploads');

        // Vérifier si le dossier existe, sinon le créer
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Définir le chemin du fichier converti en JPEG
        const uploadPath = join(uploadDir, req.file.originalname.replace(/\.[^/.]+$/, ".jpg"));

        // Conversion en JPEG avant la sauvegarde
        sharp(req.file.buffer)
        .jpeg({ quality: 90 })  // Qualité de compression de l'image
        .toFile(uploadPath, (err, info) => {
            if (err) {
                console.error('Erreur lors de la conversion et de la sauvegarde de l\'image:', err);
                return;
            }

            console.log('Image convertie et sauvegardée avec succès:', info);
        });
        try {
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
                        console.log("facebook test ");
                        const facebookTokens = tokens.find(item => item.provider === "facebook");

                        if (facebookTokens) {
                            const pageId = '619080624619257'; // ID de la page Facebook
                            const accessToken = facebookTokens.accessToken; // Le token d'accès de la page

                            if (fileBuffer) {
                                // Si tu veux publier une photo
                                const formData = new FormData();
                                formData.append('message', message);
                                formData.append('url', `${process.env.PROXY_POSTS}/uploads/${req.file.originalname}`);
                                formData.append('access_token', accessToken);
                                console.log(formData);
                                try {
                                    const response = await axios.post(
                                        `https://graph.facebook.com/${pageId}/photos`, // Endpoint de publication sur la page
                                        formData, // Corps de la requête (les données)
                                        { headers: { 'Content-Type': 'multipart/form-data' } } // En-tête nécessaire pour envoyer des fichiers
                                    );
                                    console.log('Photo publiée avec succès', response.data);
                                } catch (err) {
                                    console.error('Erreur lors de la publication de la photo', err);
                                }
                            } else {
                                // Si tu veux publier juste un message
                                try {
                                    const response = await axios.post(
                                        `https://graph.facebook.com/${pageId}/feed`, // Endpoint de publication sur la page
                                        {
                                            message: message, // Message à publier
                                            access_token: accessToken // Token d'accès de la page
                                        }
                                    );
                                    console.log('Message publié avec succès', response.data);
                                } catch (err) {
                                    console.error('Erreur lors de la publication du message', err);
                                }
                            }
                        }
                        console.log("pas d'erreur de facebook");
                        break;


                    case "instagram":
                        const instagramTokens = tokens.find(item => item.provider === "instagram");
                        if (!fileBuffer) {
                            return res.status(400).json({ error: "Instagram requiert une image pour publier." });
                        }

                        // Si le réseau social est Instagram, on convertit l'image en JPEG
                        if (instagramTokens) {

                            // Étape 1 : Créer un media
                            const formData = new FormData();
                            formData.append("image_url", `${process.env.PROXY_POSTS}/uploads/${req.file.originalname.replace(/\.[^/.]+$/, ".jpg")}`);
                            formData.append("caption", message);
                            console.log("voici le userid du compte instagram : ")
                            const createMediaResponse = await axios.post(
                                `https://graph.instagram.com/${instagramTokens.profile.id}/media`,
                                formData,
                                {
                                    headers: {
                                        Authorization: `Bearer ${instagramTokens.accessToken}`,
                                    }
                                }
                            );

                            // Vérifier la réponse et récupérer l'ID du média
                            const mediaId = createMediaResponse.data.id;
                            if (!mediaId) {
                                return res.status(500).json({ error: "Erreur lors de la création du média Instagram." });
                            }

                            // Étape 2 : Publier le media
                            const publishResponse = await axios.post(
                                `https://graph.instagram.com/${instagramTokens.profile.id}/media_publish`,
                                { media_id: mediaId },
                                {
                                    headers: {
                                        Authorization: `Bearer ${instagramTokens.accessToken}`
                                    }
                                }
                            );

                            // Suppression de l'image après l'envoi réussi
                            fs.unlinkSync(tempFilePath); // Supprime le fichier après utilisation
                            console.log("Image supprimée du serveur après l'envoi.");

                            // Retourner la réponse de la publication
                            return res.status(200).json({ success: "Image publiée sur Instagram avec succès.", data: publishResponse.data });
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