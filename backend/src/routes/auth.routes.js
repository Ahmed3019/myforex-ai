/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const express = require('express');
const { signup, login, me } = require('../controllers/auth.controller');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticateToken, me);

module.exports = router;
