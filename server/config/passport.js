import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";

const googleConfigured =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

const facebookConfigured =
  process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET;

if (googleConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      (accessToken, refreshToken, profile, done) => {
        // Do not store provider access/refresh tokens for this login-only feature.
        done(null, {
          provider: "google",
          providerId: profile.id,
          email: profile.emails?.[0]?.value?.toLowerCase(),
          emailVerified: profile._json?.email_verified === true,
          username: profile.displayName || profile.emails?.[0]?.value?.split("@")[0],
          avatar: profile.photos?.[0]?.value || ""
        });
      }
    )
  );
}

if (facebookConfigured) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ["id", "displayName", "emails", "photos"]
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, {
          provider: "facebook",
          providerId: profile.id,
          email: profile.emails?.[0]?.value?.toLowerCase(),
          emailVerified: false,
          username: profile.displayName || "Quiz Player",
          avatar: profile.photos?.[0]?.value || ""
        });
      }
    )
  );
}

export default passport;
