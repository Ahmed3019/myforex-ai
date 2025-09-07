/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const express = require('express');
const authenticateToken = require('../middleware/auth');
const { getAllTrades, addTrade, updateTrade, closeTrade, deleteTrade, getStats } = require('../controllers/trades.controller');

const router = express.Router();

// Protected routes
router.use(authenticateToken);

router.get('/', getAllTrades);
router.post('/', addTrade);
router.put('/:id', updateTrade);
router.put('/:id/close', closeTrade);
router.delete('/:id', deleteTrade);
router.get('/stats/all', getStats);

module.exports = router;
