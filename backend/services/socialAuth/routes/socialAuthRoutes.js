const express = require("express");
const passport = require("passport");
//const SocialAuth = require("../models/SocialAuth");
const socialAuthController = require("../controllers/socialAuthController");
const router = express.Router();
const axios = require("axios");

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
    //const profile = req.user.profile;
    const facebookAccessToken = req.user.accessToken; // Le token récupéré depuis Facebook
    //console.log("ID:", profile.id);
    //console.log("Nom:", profile.displayName);
    //console.log("Email:", profile.emails ? profile.emails[0].value : "Non disponible");
    //console.log("Photo:", profile.photos ? profile.photos[0].value : "Non disponible");
    // Rediriger vers le frontend avec le token dans l'URL
    res.redirect(process.env.FRONTEND_URL + `/socialauth/callback?network=facebook&token=${facebookAccessToken}`);
});

// Route pour commencer l'authentification via Instagram
router.get("/connect/instagram", passport.authenticate("instagram"));

router.get("/connect/instagram/callback", (req, res) => {
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

    axios.post(tokenRequestUrl, new URLSearchParams(requestBody))
    .then(() => {

        const longTermTokenRequestUrl = `https://graph.instagram.com/access_token?grant_type=authorization_code&client_id=${process.env.INSTAGRAM_CLIENT_ID}&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&redirect_uri=${process.env.PROXY_GATEWAY}/api/socialauth/connect/instagram/callback&code=${code}`;

        // Faire la requête pour obtenir un token long terme
        axios.get(longTermTokenRequestUrl)
        .then((longTermResponse) => {
            const longTermToken = longTermResponse.data.access_token;

            // Rediriger vers le frontend avec le token long terme
            res.redirect(process.env.FRONTEND_URL + `/socialauth/callback?network=instagram&token=${longTermToken}`);
        })
        .catch((longTermError) => {
            console.error("Erreur lors de l'échange pour le token long terme :", longTermError.response ? longTermError.response.data : longTermError.message);
            res.status(500).send("Erreur lors de l'obtention du token long terme.");
        });
    })
    .catch((error) => {
        console.error("Erreur lors de l'échange du code d'autorisation :", error.response ? error.response.data : error.message);
        res.status(500).send("Erreur lors de l'échange du code d'autorisation.");
    });
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

    const {token,tokenSecret} = req.user;
    res.redirect(process.env.FRONTEND_URL + `/socialauth/callback?network=twitter&token=${token}&tokenSecret=${tokenSecret}`);
});

module.exports = router;