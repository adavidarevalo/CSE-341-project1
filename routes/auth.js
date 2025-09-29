const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/auth");

router.get("/login", 
    passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/logout", authController.githubLogout);


router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/login?error=github_auth_failed" }),
  authController.githubCallback
);

module.exports = router;
