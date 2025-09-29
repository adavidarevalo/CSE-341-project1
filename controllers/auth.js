

const githubLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during local logout:", err);
      return res.status(500).json({ 
        message: "Error during logout", 
        error: err.message 
      });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ 
          message: "Error destroying session", 
          error: err.message 
        });
      }

      res.clearCookie("connect.sid");
      
res.status(200).json({ 
        message: "Logout successful" 
      });
    });
  });
};

const githubCallback = (req, res) => {
  res.redirect("/api-docs?login=success");
};

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ 
    message: "Authentication required. Please login first.",
    loginUrl: "/auth/login"
  });
};

module.exports = {
  githubLogout,
  githubCallback,
  isAuthenticated,
};
