const User = require("../models/user");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
};

// Show login page - redirect directly to GitHub OAuth
const showLoginPage = (req, res) => {
  // Verificar si hay un error en la query string
  const error = req.query.error;
  
  if (error === 'github_auth_failed') {
    // Mostrar una página de error antes de redirigir
    const errorHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error de Autenticación - CSE341</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #24292e 0%, #586069 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .error-container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        
        .error-icon {
            font-size: 4rem;
            color: #e74c3c;
            margin-bottom: 1rem;
        }
        
        .error-title {
            color: #333;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }
        
        .error-message {
            color: #666;
            margin-bottom: 2rem;
            line-height: 1.5;
        }
        
        .retry-btn {
            padding: 0.75rem 2rem;
            background: linear-gradient(135deg, #24292e 0%, #586069 100%);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: transform 0.2s;
        }
        
        .retry-btn:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h1 class="error-title">Error de Autenticación</h1>
        <p class="error-message">
            Hubo un problema al autenticar con GitHub. Por favor, inténtalo de nuevo.
        </p>
        <a href="/auth/github" class="retry-btn">Intentar de Nuevo</a>
    </div>
</body>
</html>`;
    res.send(errorHtml);
  } else {
    // Redirigir directamente al OAuth de GitHub
    res.redirect('/auth/github');
  }
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
    res
      .status(400)
      .json({ message: "Failed to create user", error: err.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.getByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.login(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Login failed", error: err.message });
      }
      res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// Logout user
const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Logout failed", error: err.message });
    }
    res.status(200).json({ message: "Logout successful" });
  });
};

// Get current user
const getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
      },
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

// GitHub OAuth callback
const githubCallback = (req, res) => {
  // Successful authentication, redirect to a success page or API docs
  res.redirect('/api-docs?login=success');
};

module.exports = {
  isAuthenticated,
  showLoginPage,
  register,
  // login, // DISABLED - OAuth only
  logout,
  getCurrentUser,
  githubCallback,
};
