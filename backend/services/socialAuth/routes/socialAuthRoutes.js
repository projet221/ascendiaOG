const express = require("express");
const passport = require("passport");
//const SocialAuth = require("../models/SocialAuth");
const socialAuthController = require("../controllers/socialAuthController");
const router = express.Router();
// Facebook OAuth

router.get("/connect/facebook",
    passport.authenticate("facebook", {
        scope: [
            "email", "public_profile", "pages_read_user_content", "read_insights", "pages_show_list",
            "business_management", "pages_read_engagement", "pages_manage_metadata", "pages_manage_posts",
            "instagram_basic", "instagram_content_publish", "ads_management", "instagram_manage_insights",
            "ads_read"
        ]
    })
);

router.get("/connect/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login",session: false }),
    (req, res) => {
    if (!req.user || !req.user.accessToken) {
        console.log("erreur lors de la recuperation de l'access token")
    }

    const facebookAccessToken = req.user.accessToken; // Le token récupéré depuis Facebook

    // Rediriger vers le frontend avec le token dans l'URL
    res.redirect(process.env.FRONTEND_URL + `/socialauth/callback?network=facebook&token=${facebookAccessToken}`);
}
);

router.get("/connect/twitter",
    passport.authenticate("twitter", {
        scope: [
            "tweet.read", "tweet.write", "users.read", "follows.read", "follows.write",
            "offline.access", "like.read", "like.write", "list.read", "list.write",
            "bookmark.read", "bookmark.write"
        ]
    })
);

  
  // Handle callback from X
router.get('/connect/twitter/callback', passport.authenticate("twitter", { failureRedirect: "/login",session: false }),
(req, res) => {
    if (!req.user || !req.user.accessToken) {
        console.log("erreur lors de la recuperation de l'access token");
    }

    const twitterAccessToken = req.user.accessToken;

    res.redirect(process.env.FRONTEND_URL + `/socialauth/callback?network=twitter&token=${twitterAccessToken}`);
}
);

router.post('/save', socialAuthController.save );

module.exports = router;