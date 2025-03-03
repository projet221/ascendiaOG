const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../../users/models/User"); 

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.PROXY_GATEWAY + "/api/socialauth/connect/facebook/callback",
        profileFields: ["id", "emails", "name"]
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({facebookId: profile.id});

            if (!user) {
                user = new User({
                    facebookId: profile.id,
                    email: profile.emails ? profile.emails[0].value : "",
                    name: profile.name.givenName + " " + profile.name.familyName
                });
                await user.save();
            }

            return done(null, {id: user.id, accessToken});
        } catch (err) {
            return done(err, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
