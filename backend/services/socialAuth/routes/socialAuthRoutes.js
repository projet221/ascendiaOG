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

    // Stocker user_id dans la session pour l'utiliser après l'authentification
    req.session.user_id = user_id;

    next(); // Passer à Passport
}, passport.authenticate("facebook", {
    scope: [
        "email", "public_profile", "pages_read_user_content", "read_insights", "pages_show_list",
        "business_management", "pages_read_engagement", "pages_manage_metadata", "pages_manage_posts",
        "instagram_basic", "instagram_content_publish", "ads_management", "instagram_manage_insights",
        "ads_read"
    ]
}));


router.get("/connect/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }),
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
module.exports = router;
