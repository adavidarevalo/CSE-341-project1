const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/user");

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.getById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.getByGithubId(profile.id);

        if (user) {
          return done(null, user);
        }

        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.local`;
        user = await User.getByEmail(email);

        if (user) {
          user.githubId = profile.id;
          await user.save();
          return done(null, user);
        }

        const newUser = await User.create({
          firstName: profile.displayName ? profile.displayName.split(' ')[0] : profile.username,
          lastName: profile.displayName ? profile.displayName.split(' ').slice(1).join(' ') || "GitHub User" : "GitHub User",
          email: email,
          password: "github_oauth_user", // Will be hashed by pre-save middleware
          phoneNumber: "Not provided",
          address: "Not provided",
          dateOfBirth: new Date("1990-01-01"), // Default date
          githubId: profile.id,
        });

        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;
