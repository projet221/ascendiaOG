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

router.get('/connect/twitter', (req, res) => {
    const { userId } = req.query; // Capture the user ID from the query parameters
  
    if (!userId) {
      return res.status(400).send('User ID is required.');
    }
  
    // Include the user ID in the state parameter (for security)
    const state = Buffer.from(JSON.stringify({ userId })).toString('base64');
    const adCallback = process.env.PROXY_GATEWAY+'/api/socialauth/connect/twitter/callback';
    const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.TWITTER_KEY}&redirect_uri=${adCallback}&scope=tweet.read%20tweet.write%20users.read%20offline.access&state=${state}`;
    res.redirect(authUrl);
  });
  
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