const User = require("../models/user");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  console.log('isAuthenticated middleware called');
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
};

// Show login page - GitHub OAuth option
const showLoginPage = (req, res) => {
  // Check if user is already authenticated
  if (req.isAuthenticated()) {
    return res.redirect('/api-docs');
  } else {
    res.redirect('/auth/github');
  }
};

const showLogoutPage = (req, res) => {

  const logoutHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Cerrar Sesión</title>
</head>
<body>

    <p><button onclick="logoutUser()">Logout</button></p>

    <script>
        async function logoutUser() {
            try {
                const response = await fetch('/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
                if (response.ok) {
                    window.location.href = '/login';
                } else {
                    alert('Error al cerrar sesión');
                }
            } catch (error) {
                alert('Error de conexión');
            }
        }
    </script>
</body>
</html>`;
  
  res.send(logoutHtml);
};

// Register a new user
const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      address,
      dateOfBirth,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.getByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      address,
      dateOfBirth,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// GitHub OAuth complete logout
const githubLogout = (req, res) => {
  // First, logout from local session
  req.logout((err) => {
    if (err) {
      console.error('Error during local logout:', err);
    }
    
    // Clear session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      
      // Clear cookies
      res.clearCookie('connect.sid');
      
      // Redirect to GitHub logout with return URL
      const githubLogoutUrl = `https://github.com/logout?return_to=${encodeURIComponent(
        process.env.NODE_ENV === 'production' 
          ? process.env.RENDER_URL + '/login?message=github_logout_success'
          : 'http://localhost:3000/login?message=github_logout_success'
      )}`;
      
      res.redirect(githubLogoutUrl);
    });
  });
};

// Logout user (local only)
const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Logout failed", error: err.message });
    }
    
    // Destroy the session to completely remove user from Passport
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: "Session destruction failed", error: err.message });
      }
      
      // Clear the session cookie
      res.clearCookie('connect.sid');
      res.status(200).json({ message: "Logout successful" });
    });
  });
};


// GitHub OAuth callback
const githubCallback = (req, res) => {
  // Successful authentication, redirect to a success page or API docs
  res.redirect('/api-docs?login=success');
};

module.exports = {
  isAuthenticated,
  showLoginPage,
  showLogoutPage,
  register,
  logout,
  githubLogout,
  githubCallback,
};