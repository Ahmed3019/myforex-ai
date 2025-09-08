/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const express = require('express');
const authenticateToken = require('../middleware/auth');
const {
  getAllTrades,
  addTrade,
  updateTrade,
  closeTrade,
  deleteTrade,
  getStats,
} = require('../controllers/trades.controller');

const router = express.Router();

// Protected routes
router.use(authenticateToken);

// CRUD
router.get('/', getAllTrades);
router.post('/', addTrade);
router.put('/:id', updateTrade);
router.put('/:id/close', closeTrade);
router.delete('/:id', deleteTrade);

// Stats
router.get('/stats/all', getStats);

router.post("/risk-calc", async (req, res) => {
  try {
    const { balance, riskPercent, entryPrice, stopLoss } = req.body;

    if (!balance || !riskPercent || !entryPrice || !stopLoss) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const riskAmount = (balance * riskPercent) / 100;
    const stopLossPips = Math.abs(entryPrice - stopLoss);
    if (stopLossPips <= 0) {
      return res.status(400).json({ message: "Invalid Stop Loss" });
    }

    const lotSize = riskAmount / stopLossPips;

    res.json({ suggestedLot: parseFloat(lotSize.toFixed(2)) });
  } catch (err) {
    res.status(500).json({ message: "Risk calculation failed" });
  }
});


module.exports = router;
