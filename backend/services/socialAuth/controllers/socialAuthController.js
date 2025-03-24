const SocialAuth = require("../models/SocialAuth");
const axios = require("axios");
const socialAuthController = {
    save: async (req, res) => {
        try {
            console.log(req.body);
            // Récupération des données du corps de la requête
            let {user_id}  = req.body;
            let {network, ...Tokens} = req.body.urlParams;
            console.log(Tokens);
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
               /* socialAuth = new SocialAuth({
                    user: user_id, // L'ID de l'utilisateur
                    provider: network, // Le réseau social (ex: 'facebook', 'twitter')
                    accessToken: tokenaccess // Le token d'accès de l'utilisateur
                });*/
            // Si le réseau est Facebook, on échange le token court pour un token long
            switch (network) {
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
                    // ⬇️ Correction ici : attendre le token long avant de l'utiliser
                    let tokenaccess = await exchangeForLongLivedToken(Tokens[token]);

                    socialAuth = new SocialAuth({
                        user: user_id, // L'ID de l'utilisateur
                        provider: network, // Le réseau social (ex: 'facebook', 'twitter')
                        accessToken: tokenaccess // Le token d'accès de l'utilisateur
                    });
                    break;
                }
                case "twitter":{
                    socialAuth = new SocialAuth({
                        user: user_id, // L'ID de l'utilisateur
                        provider: network, // Le réseau social (ex: 'facebook', 'twitter')
                        accessToken: Tokens[token], // Le token d'accès de l'utilisateur
                        secretToken: Tokens[tokenSecret]
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

    getSocialMediaByUserId : async (req, res) => {
        try {
            const socialAuth = await SocialAuth.find({user: req.params.user_id}).select('provider');
            console.log(socialAuth);
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
