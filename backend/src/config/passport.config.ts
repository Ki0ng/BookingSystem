import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env.config';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL || '',
      },
      async (accessToken, refreshToken, googleProfile, done) => {
        try {
          const authTokens = await authService.googleLogin(googleProfile);
          return done(null, {
            userId: authTokens.user.userId,
            role: authTokens.user.role,
            accessToken: authTokens.accessToken,
            refreshToken: authTokens.refreshToken,
          });
        } catch (error: any) {
          return done(error, undefined);
        }
      }
    )
  );
  console.log('🚀 Google Strategy initialized successfully');
} else {
  console.log('⚠️ Google OAuth credentials missing, Google login disabled.');
}

// We don't use sessions since we use JWT, but passport might need these
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
