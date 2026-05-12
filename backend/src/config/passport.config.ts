import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const result = await authService.googleLogin(profile);
        return done(null, {
          userId: result.user.userId,
          role: result.user.role,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });
      } catch (error: any) {
        return done(error, undefined);
      }
    }
  )
);

// We don't use sessions since we use JWT, but passport might need these
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
