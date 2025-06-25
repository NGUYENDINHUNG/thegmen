import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";

const getCallbackURL = (provider) => {
  const baseURL =
    process.env.NODE_ENV === "production"
      ? process.env.SERVER_URL || "https://api.htn.io.vn"
      : "http://localhost:8000";

  return `${baseURL}/v1/api/auth/${provider}/callback`;
};
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || getCallbackURL("google"),
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:8000/v1/api/auth/facebook/callback",
      profileFields: ["displayName", "photos", "name"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        return cb(null, profile);
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);

export default passport;
