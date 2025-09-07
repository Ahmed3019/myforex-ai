/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json());

// Base routes (placeholders for now)
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MyForexAI Backend API' });
});

// Import route files later here:
// app.use('/api/auth', require('./routes/auth.routes'));

module.exports = app;
