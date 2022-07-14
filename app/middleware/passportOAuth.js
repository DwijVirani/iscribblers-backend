const GoogleStrategy = require('passport-google-oauth2').Strategy;
const userService = require('./../services/userService');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://iscribblers-dev-backend.herokuapp.com/api/auth/google/callback',
        passReqToCallback: true,
      },
      async function (request, accessToken, refreshToken, profile, done) {
        const user = await userService.findOrCreate(profile);
        return done(null, user);
      },
    ),
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};
