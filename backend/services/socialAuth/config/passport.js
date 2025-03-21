const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
//const SocialAuth = require("../models/SocialAuth");


passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: process.env.PROXY_GATEWAY + "/api/socialauth/connect/facebook/callback",
            passReqToCallback: true,
            session: false
        },
        (req, accessToken, refreshToken, profile, done) => {
            console.log("Access Token Facebook :", accessToken);
            return done(null, { profile, accessToken });
        }
    )
);


passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_KEY,
        consumerSecret: process.env.TWITTER_SECRET,
        callbackURL: process.env.PROXY_GATEWAY + "/auth/twitter/callback"
    },
    function (token, tokenSecret, profile, cb) {
        User.findOrCreate({twitterId: profile.id}, function (err, user) {
            return cb(err, user);
        });
    }
));


