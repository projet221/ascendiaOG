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


