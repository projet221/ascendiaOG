const SocialAuth = require("../models/SocialAuth");
const { TwitterApi } = require("twitter-api-v2");
const axios = require("axios");
const socialAuthController = {
    save: async (req, res) => {
        try {
            // Récupération des données du corps de la requête
            let {user_id}  = req.body;
            let {network} = req.body.urlParams;
            // Vérification si un enregistrement de connexion sociale existe déjà
            let socialAuth = await SocialAuth.findOne({ $and: [{ user: user_id }, { provider: network }] });

            if (socialAuth) {
                // Si l'enregistrement existe déjà, retourne un message
                console.log("socialAuth déjà existant", socialAuth);
                return res.status(400).json({
                    message: "Cet utilisateur est déjà connecté à ce réseau social."
                });
            } else {
                // Création d'un nouvel enregistrement SocialAuth
            switch (network) {
                case "instagram": {
                    const getLongLivedToken = async (shortLivedToken) => {
                        if (!shortLivedToken) {
                            throw new Error("Le token d'accès et le client secret sont requis !");
                        }

                        try {
                            const response = await axios.get("https://graph.instagram.com/access_token", {
                                params: {
                                    grant_type: "ig_exchange_token",
                                    client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
                                    access_token: shortLivedToken
                                }
                            });
                            return response.data; // Retourne le long-lived token
                        } catch (error) {
                            if (error.response) {
                                console.error("Erreur API:", error.response.data);
                            } else if (error.request) {
                                console.error("Aucune réponse reçue:", error.request);
                            } else {
                                console.error("Erreur lors de la requête:", error.message);
                            }
                            return null;
                        }
                    };

                    const longtoken = getLongLivedToken(req.body.urlParams.token);
                    // Instagram Graph API
                    const instagramProfile = async (token) => {
                        try {
                            const response = await axios.get(`https://graph.instagram.com/me`, {
                                params: {
                                    fields: "id,username,media_count,account_type,profile_picture_url",
                                    access_token: token
                                }
                            });
                            return response.data;
                        } catch (error) {
                            console.error("Erreur lors de la récupération du profil Instagram:", error);
                            return null;  // Retourner null si une erreur survient
                        }
                    };

                    const profile = await instagramProfile(longtoken);  // Récupérer les infos de profil via le token d'accès
                    if (!profile) {
                        return res.status(400).json({
                            message: "Impossible de récupérer les informations du profil Instagram."
                        });
                    }
                    // Créer l'objet SocialAuth pour Instagram
                    socialAuth = new SocialAuth({
                        user: user_id,  // L'ID de l'utilisateur
                        provider: network,  // Le réseau social (ex: 'facebook', 'twitter')
                        accessToken: longtoken,  // Le token d'accès de l'utilisateur
                        profile: {
                            id: profile.id,  // ID de l'utilisateur Instagram
                            username: profile.username,  // Nom d'utilisateur Instagram
                            name: profile.username,  // Instagram ne fournit pas de champ 'name', tu peux utiliser le 'username'
                            email: null,  // Instagram ne fournit pas l'email par défaut, donc tu peux mettre 'null'
                            photo: profile.profile_picture_url || null,  // URL de la photo de profil
                        },
                    });
                    break;
                }
                case "facebook":{
                    const exchangeForLongLivedToken = async (shortLivedToken) => {
                        try {
                            const response = await axios.get(`https://graph.facebook.com/v18.0/oauth/access_token`, {
                                params: {
                                    grant_type: 'fb_exchange_token',
                                    client_id: process.env.FACEBOOK_CLIENT_ID,
                                    client_secret: process.env.FACEBOOK_CLIENT_SECRET,
                                    fb_exchange_token: shortLivedToken,
                                },
                            });

                            return response.data.access_token; // Ceci est le token valable 60 jours
                        } catch (error) {
                            console.error("Erreur lors de l'échange du token :", error.response?.data || error.message);
                            throw error;
                        }
                };
                    let tokenaccess = await exchangeForLongLivedToken(req.body.urlParams.token);
                    const profilRep = async (token) => {
                        try {
                            const response = await axios.get(`https://graph.facebook.com/me`,{
                                params:{
                                    access_token : token,
                                    fields:"id,name,email,picture",
                            }
                            });

                            return response.data
                        } catch (error) {
                            console.error("Erreur lors de la récupération des pages:", error);
                            return []; // Retourner un tableau vide en cas d'erreur
                        }
                    };
                    const profile = await profilRep(tokenaccess);
                    const pages_info = async (token) => {
                        try {
                            const response = await axios.get(`https://graph.facebook.com/v18.0/me/accounts?access_token=${token}`);

                            return response.data.data.map(item => ({ name: item.name, id: item.id }));
                        } catch (error) {
                            console.error("Erreur lors de la récupération des pages:", error);
                            return []; // Retourner un tableau vide en cas d'erreur
                        }
                    };
                    let Pages = await pages_info(tokenaccess);
                    socialAuth = new SocialAuth({
                        user: user_id, // L'ID de l'utilisateur
                        provider: network, // Le réseau social (ex: 'facebook', 'twitter')
                        accessToken: tokenaccess, // Le token d'accès de l'utilisateur
                        pages : Pages,
                        profile: {
                            id: profile.id,
                            username: profile.name,
                            email: profile.email || null,
                            photo: profile.picture.data.url || null,
                        },
                    });
                    break;
                }
                case "twitter":{

                    const client = new TwitterApi({
                        appKey: process.env.TWITTER_KEY,
                        appSecret: process.env.TWITTER_SECRET,
                        accessToken: req.body.urlParams.token,
                        accessSecret: req.body.urlParams.tokenSecret,
                    });

                    const twitterClient = client.readWrite;

                    // Get the authenticated user's data
                    const { data: user } = await twitterClient.v2.me({
                        "user.fields": ["id", "name", "username", "profile_image_url"],
                    })
                    socialAuth = new SocialAuth({
                        user: user_id, // L'ID de l'utilisateur
                        provider: network, // Le réseau social (ex: 'facebook', 'twitter')
                        accessToken: req.body.urlParams.token, // Le token d'accès de l'utilisateur
                        secretToken: req.body.urlParams.tokenSecret,
                        profile: {
                            id: user.id,
                            username: user.username,
                            name: user.name,
                            email: user.email || null,
                            photo: user.profile_image_url || null,
                        },
                    });
                    break;
                }
            }
                // Sauvegarde de l'objet dans la base de données
                await socialAuth.save();

                // Réponse de succès
                console.log("socialAuth sauvegardé avec succès", socialAuth);
                return res.status(201).json({
                    message: "Connexion au réseau social réussie.",
                    socialAuth
                });


    }}
            catch (error) {
        // Gestion des erreurs et envoi d'une réponse appropriée
        console.error("Erreur lors de la sauvegarde de SocialAuth:", error);
        return res.status(500).json({
            message: "Une erreur est survenue lors de la sauvegarde de la connexion au réseau social.",
            error: error.message
        });
    }},

    getSocialMediaProviderByUserId : async (req, res) => {
        try {
            const socialAuth = await SocialAuth.find({user: req.params.user_id}).select('provider profile');
            if (!socialAuth) {
                return res.status(404).json({})
            }
            res.status(200).json(socialAuth);
        } catch (err){
            console.log(err)
        }
    },
    getSocialMediaByUserId : async (req, res) => {
        try {
            const socialAuth = await SocialAuth.find({user: req.params.user_id});
            if (!socialAuth) {
                return res.status(404).json({})
            }
            res.status(200).json(socialAuth);
        } catch (err){
            console.log(err)
        }
    }
};

module.exports = socialAuthController;
