const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the CSE341 API',
    login: '/auth/login',
    documentation: '/api-docs'
  });
});

// Ruta de login rápida
router.get('/login', (req, res) => {
  res.redirect('/auth/login');
});

module.exports = router;
