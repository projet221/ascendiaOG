const express = require("express");
const passport = require("passport");
const SocialAuth = require("../models/SocialAuth");
const router = express.Router();

// Facebook OAuth
router.get("/connect/facebook", passport.authenticate("facebook", {
    scope: [
        "email", "public_profile", "pages_read_user_content", "read_insights", "pages_show_list",
        "business_management", "pages_read_engagement", "pages_manage_metadata", "pages_manage_posts",
        "instagram_basic", "instagram_content_publish", "ads_management", "instagram_manage_insights",
        "ads_read"
    ]
}));


router.get("/connect/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }),
    async (req, res) => {
        console.log("req.user", req.user); // Ajoutez ce log pour vérifier le contenu de req.user

        // Le code est récupéré directement depuis la query string
        const { code } = req.query;
        const userId = req.query.user_id; // Récupérer le user_id depuis les paramètres de la requête

        if (!userId) {
            return res.status(400).json({ error: "user_id manquant !" });
        }

        if (!code) {
            return res.status(400).json({ error: "Code d'autorisation manquant !" });
        }

        try {
            // Échanger le code contre un access_token
            const response = await axios.get(`https://graph.facebook.com/v12.0/oauth/access_token`, {
                params: {
                    client_id: 'VOTRE_CLIENT_ID', // Remplacez par votre ID client Facebook
                    client_secret: 'VOTRE_CLIENT_SECRET', // Remplacez par votre clé secrète
                    redirect_uri: 'VOTRE_URL_DE_REDIRECTION', // L'URL de redirection que vous avez définie dans votre application Facebook
                    code: code,
                }
            });

            const { access_token } = response.data;

            // Récupérer les informations de l'utilisateur avec l'access_token
            const userInfoResponse = await axios.get(`https://graph.facebook.com/me`, {
                params: {
                    access_token: access_token,
                    fields: 'id,name,email', // Par exemple, récupérez l'id, le nom et l'email
                }
            });

            console.log('Facebook User Info:', userInfoResponse.data);

            // Enregistrer ou mettre à jour le token en base
            await SocialAuth.findOneAndUpdate(
                { user: userId, provider: "facebook" },
                { accessToken: access_token },
                { upsert: true, new: true }
            );

            res.send("<script>window.close();</script>"); // Ferme la popup après le succès
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erreur lors de l'échange du code ou de l'enregistrement du token" });
        }
    }
);
module.exports = router;
