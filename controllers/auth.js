const User = require("../models/user");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  console.log('isAuthenticated middleware called');
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
};

// Show login page - redirect directly to GitHub OAuth
const showLoginPage = (req, res) => {
  // Verificar si hay un error en la query string
  const error = req.query.error;
  const message = req.query.message;
  
  if (error === 'github_auth_failed') {
    const errorHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Error de Autenticación</title>
</head>
<body>
    <h1>Error de Autenticación</h1>
    <p>Hubo un problema al autenticar con GitHub. Por favor, inténtalo de nuevo.</p>
    <a href="/auth/github">Intentar de Nuevo</a>
</body>
</html>`;
    res.send(errorHtml);
  } else if (message === 'logout_success') {
    const successHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Sesión Cerrada</title>
</head>
<body>
    <h1>Sesión Cerrada</h1>
    <p>Has cerrado sesión exitosamente.</p>
    <a href="/auth/github">Iniciar Sesión Nuevamente</a>
</body>
</html>`;
    res.send(successHtml);
  } else if (message === 'github_logout_success') {
    const githubSuccessHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Logout Completo Exitoso</title>
</head>
<body>
    <h1>Logout Completo Exitoso</h1>
    <p>Has cerrado sesión en GitHub y en la aplicación completamente.</p>
    <a href="/auth/github">Iniciar Sesión Nuevamente</a>
</body>
</html>`;
    res.send(githubSuccessHtml);
  } else {
    // Redirigir directamente al OAuth de GitHub
    res.redirect('/auth/github');
  }
};

// Show logout page with GitHub disconnect option
const showLogoutPage = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  const logoutHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Cerrar Sesión</title>
</head>
<body>
    <h1>Cerrar Sesión</h1>
    <p><strong>Usuario:</strong> ${req.user.firstName} ${req.user.lastName}</p>
    <p><strong>Email:</strong> ${req.user.email}</p>
    <p><strong>Conectado vía:</strong> GitHub OAuth</p>
    
    <h2>¿Cómo quieres cerrar sesión?</h2>
    <p><a href="/auth/logout/github">Cerrar sesión completa (GitHub + App)</a></p>
    <p>Cierra la sesión en GitHub y en la aplicación. Recomendado para seguridad.</p>
    
    <p><button onclick="logoutLocal()">Solo cerrar sesión local</button></p>
    <p>Solo cierra la sesión en la aplicación. Mantiene la autorización en GitHub.</p>
    
    <p><a href="/api-docs">← Cancelar</a></p>
    
    <script>
        async function logoutLocal() {
            try {
                const response = await fetch('/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
                if (response.ok) {
                    window.location.href = '/login?message=logout_success';
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
    res.status(200).json({ message: "Logout successful" });
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