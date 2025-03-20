const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const SocialAuth = require("../models/SocialAuth");
passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.PROXY_GATEWAY + "/api/socialauth/connect/facebook/callback",
        profileFields: ["id", "displayName", "emails", "picture.type(large)"],
    },
    async (req, accessToken, refreshToken, profile, done) => {
        try {
            // Vérification si un utilisateur existe déjà avec cet ID Facebook
            /*
            console.log(req.headers,req);
            console.log("---------------------------------------");
            let socialAuth = await SocialAuth.findOne({ provider: "facebook", user: req.cookie.id }); // On suppose que `req.user` contient l'utilisateur connecté
            */
            // Si SocialAuth n'existe pas pour cet utilisateur, on le crée
            if (/*!socialAuth*/req !== "") {
                socialAuth = new SocialAuth({
                    // Associer cet objet SocialAuth à l'utilisateur existant
                    provider: "facebook",
                    accessToken: accessToken,
                    refreshToken: refreshToken.accessToken || "", // Le refreshToken est optionnel
                });

                await socialAuth.save(); // Sauvegarder l'instance SocialAuth dans la base de données
            }

            // Retourner les informations nécessaires
            return done(null, { id: socialAuth._id, accessToken });
        } catch (err) {
            console.error("Erreur lors de l'enregistrement de l'authentification sociale :", err);
            return done(err, null);
        }
    }));

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

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

