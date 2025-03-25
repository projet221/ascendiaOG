const express = require("express");
const passport = require("passport");
//const SocialAuth = require("../models/SocialAuth");
const socialAuthController = require("../controllers/socialAuthController");
const router = express.Router();
// Facebook OAuth


router.post('/save', socialAuthController.save );

router.get("/:user_id", socialAuthController.getSocialMediaByUserId )




//Routes de connexions aux réseaux sociaux

router.get("/connect/facebook", passport.authenticate("facebook", {
        scope: ["email", "public_profile", "pages_read_user_content", "read_insights", "pages_show_list",
            "business_management", "pages_read_engagement", "pages_manage_metadata", "pages_manage_posts",
            "instagram_basic", "instagram_content_publish", "ads_management", "instagram_manage_insights",
            "ads_read"
        ]
    }));

router.get("/connect/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login",session: false }), (req, res) => {
    if (!req.user || !req.user.accessToken) {
        console.log("erreur lors de la recuperation de l'access token")
    }
    const profile = req.user.profile;
    const facebookAccessToken = req.user.accessToken; // Le token récupéré depuis Facebook
    console.log("ID:", profile.id);
    console.log("Nom:", profile.displayName);
    console.log("Email:", profile.emails ? profile.emails[0].value : "Non disponible");
    console.log("Photo:", profile.photos ? profile.photos[0].value : "Non disponible");
    // Rediriger vers le frontend avec le token dans l'URL
    res.redirect(process.env.FRONTEND_URL + `/socialauth/callback?network=facebook&token=${facebookAccessToken}`);
});

// Route pour commencer l'authentification via Instagram
router.get("/connect/instagram", passport.authenticate("instagram"));

/*router.get("/connect/instagram", (req, res) => {
    // Redirige l'utilisateur vers l'URL d'autorisation Instagram Graph API
    const instagramAuthUrl = 'https://www.instagram.com/oauth/authorize?' +
        'enable_fb_login=0&' +
        'force_authentication=1&' +
        'client_id=1164864348693375&' +
        'redirect_uri=https://gateway-wy38.onrender.com/api/socialauth/connect/instagram/callback&' +
        'response_type=code&' +
        'scope=instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,' +
        'instagram_business_content_publish,instagram_business_manage_insights';

    res.redirect(instagramAuthUrl); // Effectuer la redirection vers l'URL Instagram
});*/

router.get("/connect/instagram/callback", (req, res) => {
    console.log(req.query);
    const { code } = req.query;

    if (!code) {
        return res.status(400).send("Code d'autorisation manquant");
    }

    const tokenRequestUrl = `https://api.instagram.com/oauth/access_token`;

    const requestBody = {
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.PROXY_GATEWAY + "/api/socialauth/connect/instagram/callback",
        code: code,
    };

    // Faire la requête POST pour échanger le code contre un access token
    axios.post(tokenRequestUrl, new URLSearchParams(requestBody))
    .then((response) => {
        const { access_token, user_id } = response.data;

        console.log('Access Token:', access_token);
        console.log('User ID:', user_id);

        // Tu peux maintenant utiliser l'access token pour récupérer des informations supplémentaires, par exemple
        // Rediriger vers le frontend avec le token
        res.redirect(process.env.FRONTEND_URL + `/socialauth/callback?network=instagram&token=${access_token}`);
    })
    .catch((error) => {
        console.error("Erreur lors de l'échange du code :", error.response ? error.response.data : error.message);
        res.status(500).send("Erreur lors de l'échange du code d'autorisation.");
    });
    /*
    if (!req.user || !req.user.accessToken) {
        console.log("Erreur lors de la récupération de l'access token");
    }

    const instagramAccessToken = req.user.accessToken; // Le token récupéré depuis Instagram

    // Rediriger vers le frontend avec le token dans l'URL
    res.redirect(process.env.FRONTEND_URL + `/socialauth/callback?network=instagram&token=${instagramAccessToken}`);
    */
});

router.get("/connect/twitter", passport.authenticate("twitter", {
        scope: [
            "tweet.read", "tweet.write", "users.read", "follows.read", "follows.write",
            "offline.access", "like.read", "like.write", "list.read", "list.write",
            "bookmark.read", "bookmark.write"
        ]
    }));

router.get('/connect/twitter/callback', passport.authenticate("twitter", { failureRedirect: "/login",session: false }), (req, res) => {
    if (!req.user ) {
        console.log("----------------------------------------\n" +
            "erreur lors de la recuperation de l'access token \n" +
            `req.user : ${req.user} \n` +
            "----------------------------------------\n ");
    }

    const {token,tokenSecret,profile} = req.user;
    console.log(profile);
    res.redirect(process.env.FRONTEND_URL + `/socialauth/callback?network=twitter&token=${token}&tokenSecret=${tokenSecret}`);
});

module.exports = router;