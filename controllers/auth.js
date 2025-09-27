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
  const message = req.query.message;
  
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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #24292e 0%, #586069 100%);
            min-height: 100vh; display: flex; align-items: center; justify-content: center;
        }
        .error-container {
            background: white; padding: 2rem; border-radius: 10px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1); width: 100%; max-width: 400px; text-align: center;
        }
        .error-icon { font-size: 4rem; color: #e74c3c; margin-bottom: 1rem; }
        .error-title { color: #333; margin-bottom: 1rem; font-size: 1.5rem; }
        .error-message { color: #666; margin-bottom: 2rem; line-height: 1.5; }
        .retry-btn {
            padding: 0.75rem 2rem; background: linear-gradient(135deg, #24292e 0%, #586069 100%);
            color: white; border: none; border-radius: 5px; font-size: 16px; font-weight: 600;
            cursor: pointer; text-decoration: none; display: inline-block; transition: transform 0.2s;
        }
        .retry-btn:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h1 class="error-title">Error de Autenticación</h1>
        <p class="error-message">Hubo un problema al autenticar con GitHub. Por favor, inténtalo de nuevo.</p>
        <a href="/auth/github" class="retry-btn">Intentar de Nuevo</a>
    </div>
</body>
</html>`;
    res.send(errorHtml);
  } else if (message === 'logout_success') {
    const successHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sesión Cerrada - CSE341</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #24292e 0%, #586069 100%);
            min-height: 100vh; display: flex; align-items: center; justify-content: center;
        }
        .success-container {
            background: white; padding: 2rem; border-radius: 10px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1); width: 100%; max-width: 400px; text-align: center;
        }
        .success-icon { font-size: 4rem; color: #28a745; margin-bottom: 1rem; }
        .success-title { color: #333; margin-bottom: 1rem; font-size: 1.5rem; }
        .success-message { color: #666; margin-bottom: 2rem; line-height: 1.5; }
        .login-btn {
            padding: 0.75rem 2rem; background: linear-gradient(135deg, #24292e 0%, #586069 100%);
            color: white; border: none; border-radius: 5px; font-size: 16px; font-weight: 600;
            cursor: pointer; text-decoration: none; display: inline-block; transition: transform 0.2s;
        }
        .login-btn:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="success-container">
        <div class="success-icon">✅</div>
        <h1 class="success-title">Sesión Cerrada</h1>
        <p class="success-message">Has cerrado sesión exitosamente.</p>
        <a href="/auth/github" class="login-btn">Iniciar Sesión Nuevamente</a>
    </div>
</body>
</html>`;
    res.send(successHtml);
  } else if (message === 'github_logout_success') {
    const githubSuccessHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sesión Cerrada Completamente - CSE341</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #24292e 0%, #586069 100%);
            min-height: 100vh; display: flex; align-items: center; justify-content: center;
        }
        .success-container {
            background: white; padding: 2rem; border-radius: 10px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1); width: 100%; max-width: 400px; text-align: center;
        }
        .success-icon { font-size: 4rem; color: #28a745; margin-bottom: 1rem; }
        .success-title { color: #333; margin-bottom: 1rem; font-size: 1.5rem; }
        .success-message { color: #666; margin-bottom: 2rem; line-height: 1.5; }
        .login-btn {
            padding: 0.75rem 2rem; background: linear-gradient(135deg, #24292e 0%, #586069 100%);
            color: white; border: none; border-radius: 5px; font-size: 16px; font-weight: 600;
            cursor: pointer; text-decoration: none; display: inline-block; transition: transform 0.2s;
        }
        .login-btn:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="success-container">
        <div class="success-icon">🔒</div>
        <h1 class="success-title">Logout Completo Exitoso</h1>
        <p class="success-message">Has cerrado sesión en GitHub y en la aplicación completamente. Deberás autorizar nuevamente.</p>
        <a href="/auth/github" class="login-btn">Iniciar Sesión Nuevamente</a>
    </div>
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
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cerrar Sesión - CSE341</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #24292e 0%, #586069 100%);
            min-height: 100vh; display: flex; align-items: center; justify-content: center;
        }
        .logout-container {
            background: white; padding: 2rem; border-radius: 10px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1); width: 100%; max-width: 450px; text-align: center;
        }
        .logout-header { margin-bottom: 2rem; }
        .logout-header h1 { color: #333; margin-bottom: 0.5rem; }
        .user-info {
            background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; border-left: 4px solid #24292e;
        }
        .user-info p { color: #666; margin-bottom: 0.5rem; }
        .user-info strong { color: #333; }
        .logout-btn {
            width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: none; border-radius: 5px;
            font-size: 16px; font-weight: 600; cursor: pointer; text-decoration: none;
            display: inline-block; transition: all 0.3s;
        }
        .logout-github {
            background: linear-gradient(135deg, #24292e 0%, #586069 100%); color: white;
        }
        .logout-github:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(36, 41, 46, 0.3); }
        .logout-local { background: #6c757d; color: white; }
        .logout-local:hover { background: #5a6268; transform: translateY(-2px); }
        .cancel-btn { background: #f8f9fa; color: #6c757d; border: 2px solid #e9ecef; }
        .cancel-btn:hover { background: #e9ecef; color: #495057; }
        .info-text { font-size: 14px; color: #666; line-height: 1.4; margin-bottom: 1rem; }
    </style>
</head>
<body>
    <div class="logout-container">
        <div class="logout-header">
            <h1>Cerrar Sesión</h1>
        </div>
        <div class="user-info">
            <p><strong>Usuario:</strong> ${req.user.firstName} ${req.user.lastName}</p>
            <p><strong>Email:</strong> ${req.user.email}</p>
            <p><strong>Conectado vía:</strong> GitHub OAuth</p>
        </div>
        <div class="logout-options">
            <p class="info-text"><strong>¿Cómo quieres cerrar sesión?</strong></p>
            <a href="/auth/logout/github" class="logout-btn logout-github">
                🔒 Cerrar sesión completa (GitHub + App)
            </a>
            <p class="info-text">Cierra la sesión en GitHub y en la aplicación. Recomendado para seguridad.</p>
            <button onclick="logoutLocal()" class="logout-btn logout-local">
                📱 Solo cerrar sesión local
            </button>
            <p class="info-text">Solo cierra la sesión en la aplicación. Mantiene la autorización en GitHub.</p>
            <a href="/api-docs" class="logout-btn cancel-btn">← Cancelar</a>
        </div>
    </div>
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

// Get current user
const getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        githubId: req.user.githubId,
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
  showLogoutPage,
  register,
  logout,
  githubLogout,
  getCurrentUser,
  githubCallback,
};