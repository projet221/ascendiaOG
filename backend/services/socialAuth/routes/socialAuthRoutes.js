const express = require("express");
const passport = require("passport");
//const SocialAuth = require("../models/SocialAuth");
const router = express.Router();
//const axios = require("axios");
// Facebook OAuth

router.get("/connect/facebook", (req, res, next) => {
    const user_id = req.query.user_id; // Récupération du user_id depuis l'URL

    if (!user_id) {
        return res.status(400).json({ error: "user_id est requis" });
    }

    // Stocker user_id dans la session
    req.session.user_id = user_id;

    // Rediriger vers l'authentification Facebook
    passport.authenticate("facebook", {
        scope: [
            "email", "public_profile", "pages_read_user_content", "read_insights", "pages_show_list",
            "business_management", "pages_read_engagement", "pages_manage_metadata", "pages_manage_posts",
            "instagram_basic", "instagram_content_publish", "ads_management", "instagram_manage_insights",
            "ads_read"
        ]
    })(req, res, next); // Exécuter Passport immédiatement
});
router.get("/connect/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/" }),
    async (req, res) => {
        /*
        const { code } = req.query;
       // const userId = req.cookies.user_id; // Récupérer le user_id depuis le cookie

                if (!userId) {
                    return res.status(400).json({ error: "user_id manquant !" });
                }

                if (!code) {
                    return res.status(400).json({ error: "Code d'autorisation manquant !" });
                }
                console.log(code);

                try {
                    const response = await axios.get(`https://graph.facebook.com/v12.0/oauth/access_token`, {
                        params: {
                            client_id: process.env.FACEBOOK_CLIENT_ID,
                            client_secret: process.env.FACEBOOK_CLIENT_SECRET,
                            redirect_uri: process.env.PROXY_GATEWAY + "/api/socialauth/connect/facebook/callback",
                            code: code,
                        }
                    });

                   const { access_token } = response.data;
                    console.log(access_token);

                    const userInfoResponse = await axios.get(`https://graph.facebook.com/me`, {
                        params: {
                            access_token: access_token,
                            fields: 'id,name,email',
                        }
                    });


            await SocialAuth.findOneAndUpdate(
                { provider: "facebook" },
                { accessToken: access_token, refreshToken: userInfoResponse.toString()  },
                { upsert: true, new: true }
            );

            res.send("<script>window.close();</script>");
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erreur lors de l'échange du code ou de l'enregistrement du token :" });
        }*/
        res.send("<script>window.close();</script>");
    }
);

router.get('/connect/twitter', (req, res) => {
    const { userId } = req.query; // Capture the user ID from the query parameters
  
    if (!userId) {
      return res.status(400).send('User ID is required.');
    }
  
    // Include the user ID in the state parameter (for security)
    const state = Buffer.from(JSON.stringify({ userId })).toString('base64');
  
    const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=tweet.read%20tweet.write%20users.read%20offline.access&state=${state}`;
    res.redirect(authUrl);
  });
  
  // Handle callback from X
  router.get('/connect/twitter/callback', async (req, res) => {
    const { code, state } = req.query;
  
    if (!code || !state) {
      return res.status(400).send('Invalid request.');
    }
  
    try {
      // Decode the state parameter to get the user ID
      const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
      const { userId } = decodedState;
  
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
module.exports = router;
