const express = require("express");
const passport = require("passport");
//const SocialAuth = require("../models/SocialAuth");
const socialAuthController = require("../controllers/socialAuthController");
const router = express.Router();
const axios = require("axios");
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
        console.log("erreur lors de la recuperation de l'acces token")
    }

    const facebookAccessToken = req.user.accessToken; // Le token récupéré depuis Facebook

    // Rediriger vers le frontend avec le token dans l'URL
    res.redirect(process.env.FRONTEND_URL + `/socialauth/callback?facebook_token=${facebookAccessToken}`);
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
router.get('/connect/twitter/callback', async (req, res) => {
    const { code, state } = req.query;
    console.log("dans la route connect twitter");
    if (!code || !state) {
      return res.status(400).send('Invalid request.');
    }
    
    try {
      // Decode the state parameter to get the user ID
      const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
      const { userId } = decodedState;
        console.log("demande du token twitter");
      // Exchange code for access token
      const tokenResponse = await axios.post(
        'https://api.twitter.com/2/oauth2/token',
        new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          client_id: process.env.TWITTER_KEY,
          client_secret: process.env.TWITTER_SECRET,
          redirect_uri: process.env.PROXY_GATEAWAY+'/api/socialauth/connect/twitter/callback',
          //code_verifier: 'challenge', // Replace with your PKCE code verifier
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${process.env.TWITTER_KEY}:${process.env.TWITTER_SECRET}`).toString('base64')}`,
          },
        }
      );
  
      const { access_token, refresh_token } = tokenResponse.data;
  
      // Save the access token and refresh token to your database with the user ID
      await SocialAuth.findOneAndUpdate(
        { provider: "twitter",user:userId },
        { accessToken: access_token, refreshToken: refresh_token  },
        { upsert: true, new: true }
    );
  
      res.send('Authentication successful! You can now post to X.');
    } catch (error) {
      console.error('Error exchanging code for token:', error.response?.data || error.message);
      res.status(500).send('Authentication failed.');
    }
  });

router.post('/save', socialAuthController.save );

module.exports = router;