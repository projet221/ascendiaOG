const SocialAuth = require("../models/SocialAuth");

const socialAuthController = {
    save: async (req, res) => {
        try {
            // Récupération des données du corps de la requête
            const { user_id, network, tokenaccess } = req.body;

            // Vérification si un enregistrement de connexion sociale existe déjà pour l'utilisateur et le réseau
            let socialAuth = await SocialAuth.findOne({ $and: [{ user: user_id }, { provider: network }] });

            if (socialAuth) {
                // Si l'enregistrement existe déjà, retourne un message
                console.log("socialAuth déjà existant", socialAuth);
                return res.status(400).json({
                    message: "Cet utilisateur est déjà connecté à ce réseau social."
                });
            } else {
                // Si l'enregistrement n'existe pas, crée un nouveau document SocialAuth
                socialAuth = new SocialAuth({
                    user: user_id, // L'ID de l'utilisateur
                    provider: network, // Le réseau social (ex: 'facebook', 'twitter')
                    accessToken: tokenaccess // Le token d'accès de l'utilisateur
                });

                // Sauvegarde de l'objet dans la base de données
                await socialAuth.save();

                // Réponse de succès
                console.log("socialAuth sauvegardé avec succès", socialAuth);
                return res.status(201).json({
                    message: "Connexion au réseau social réussie.",
                    socialAuth
                });
            }
        } catch (error) {
            // Gestion des erreurs et envoi d'une réponse appropriée
            console.error("Erreur lors de la sauvegarde de SocialAuth:", error);
            return res.status(500).json({
                message: "Une erreur est survenue lors de la sauvegarde de la connexion au réseau social.",
                error: error.message
            });
        }
    }
};

module.exports = socialAuthController;
