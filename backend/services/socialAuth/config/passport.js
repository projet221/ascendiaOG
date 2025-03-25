const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const InstagramStrategy = require("passport-instagram").Strategy;
//const SocialAuth = require("../models/SocialAuth");


passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: process.env.PROXY_GATEWAY + "/api/socialauth/connect/facebook/callback",
            passReqToCallback: true,
            session: false,
            profileFields: ["id", "displayName", "email", "photos"]
        },
        (req, accessToken, refreshToken, profile, done) => {
            console.log("Access Token Facebook :", accessToken);
            return done(null, { profile, accessToken });
        }
    )
);

passport.use(
    new InstagramStrategy(
        {
            clientID: process.env.INSTAGRAM_CLIENT_ID, // Utilisez l'ID client Instagram
            clientSecret: process.env.INSTAGRAM_CLIENT_SECRET, // Utilisez le secret client Instagram
            callbackURL: process.env.PROXY_GATEWAY + "/api/socialauth/connect/instagram/callback",
            passReqToCallback: true,
            session: false,
            scope :
                [
                    'instagram_basic', // Accès de base aux informations publiques du profil Instagram.
                    'instagram_manage_insights', // Permet d'accéder aux insights d'Instagram (statistiques de l'utilisateur).
                    'instagram_content_publish', // Permet de publier des contenus sur le compte Instagram.
                    'instagram_manage_comments', // Permet de gérer les commentaires sur le contenu d'Instagram.
                    'instagram_manage_messages', // Permet de gérer les messages directs Instagram.
                    'instagram_business_basic', // Permet d'accéder aux informations basiques du compte Instagram professionnel.
                    'instagram_business_manage_comments', // Permet de gérer les commentaires sur les posts du compte professionnel Instagram.
                    'instagram_business_manage_messages', // Permet de gérer les messages privés du compte professionnel.
                    'instagram_business_content_publish', // Permet de publier du contenu pour un compte Instagram professionnel.
                    'instagram_business_manage_insights', // Permet d'accéder aux insights (analyses) du compte professionnel Instagram.
                    'ads_management', // Permet de gérer les campagnes publicitaires (pour Instagram Ads).
                    'ads_read', // Permet de lire les campagnes publicitaires (pour Instagram Ads).
                    'business_management', // Permet de gérer les paramètres commerciaux sur Facebook (lié aux comptes Instagram professionnels).
                    'pages_read_engagement', // Permet de lire l'engagement sur les pages Facebook associées à Instagram.
                    'pages_manage_posts', // Permet de gérer les publications des pages Facebook associées à Instagram.
                    'pages_show_list', // Permet d'afficher la liste des pages Facebook associées à Instagram.
                    'pages_manage_metadata', // Permet de gérer les métadonnées des pages Facebook associées à Instagram.
                    'pages_read_user_content', // Permet de lire le contenu des pages Facebook associées à Instagram.
                ]
        },
        (req, accessToken, refreshToken, profile, done) => {
            console.log("Access Token Instagram:", accessToken);
            return done(null, { profile, accessToken });
        }
    )
);
passport.use(
    new TwitterStrategy({
        consumerKey: process.env.TWITTER_KEY,
        consumerSecret: process.env.TWITTER_SECRET,
        callbackURL: process.env.PROXY_GATEWAY + "/api/socialauth/connect/twitter/callback"
    },
    (token, tokenSecret, profile, done) =>{
        return done(null, {token,tokenSecret,profile});
}
));


