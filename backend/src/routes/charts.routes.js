/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const express = require('express');
const { candles, streamPrice } = require('../controllers/charts.controller');

const router = express.Router();

// Public endpoints for now (can be protected later if needed)
router.get('/candles', candles);
router.get('/stream/price', streamPrice);

module.exports = router;
