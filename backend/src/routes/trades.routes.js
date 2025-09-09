/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */
const express = require("express");
const { Trade, User } = require("../models");
const auth = require("../middleware/auth");
const { findSymbolMeta, pipsBetween, pipValuePerLotUSD } = require("../utils/calc");

const router = express.Router();

// Get all trades
router.get("/", auth, async (req, res) => {
  try {
    const trades = await Trade.findAll({ where: { userId: req.user.id } });
    res.json(trades);
  } catch (err) {
    console.error("Fetch trades error:", err);
    res.status(500).json({ message: "Failed to fetch trades" });
  }
});

// Create trade
router.post("/", auth, async (req, res) => {
  try {
    const trade = await Trade.create({ ...req.body, userId: req.user.id });
    res.json(trade);
  } catch (err) {
    console.error("Create trade error:", err);
    res.status(500).json({ message: "Failed to create trade", error: err.message });
  }
});

// Update trade
router.put("/:id", auth, async (req, res) => {
  try {
    const trade = await Trade.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!trade) return res.status(404).json({ message: "Trade not found" });

    await trade.update(req.body);
    res.json(trade);
  } catch (err) {
    console.error("Update trade error:", err);
    res.status(500).json({ message: "Failed to update trade" });
  }
});

// Close trade (P/L بالنقاط + تحديث الرصيد + إرجاع stats)
router.put("/:id/close", auth, async (req, res) => {
  try {
    const { exitPrice, quoteToUSDRate } = req.body;
    if (exitPrice === undefined || exitPrice === null || exitPrice === "")
      return res.status(400).json({ message: "exitPrice is required" });

    const trade = await Trade.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!trade) return res.status(404).json({ message: "Trade not found" });

    const meta = findSymbolMeta(trade.symbol);
    if (!meta) return res.status(400).json({ message: "Unknown symbol meta" });

    const entry = parseFloat(trade.entryPrice);
    const exit  = parseFloat(exitPrice);
    const lot   = parseFloat(trade.lotSize);
    const sign  = trade.direction === "BUY" ? 1 : -1;

    const pips = pipsBetween(entry, exit, meta.pipSize);
    const pv   = pipValuePerLotUSD({ symbol: trade.symbol, price: entry, quoteToUSDRate });

    if (pv === null) {
      // محتاج conversion لغاية Phase 3
      return res.status(400).json({
        message: "quoteToUSDRate required for non-USD crosses until live prices are added",
      });
    }

    // P/L بالدولار (مع الاتجاه)
    const profitLoss = parseFloat((sign * pips * pv * lot).toFixed(5));

    trade.exitPrice = exit;
    trade.isClosed  = true;
    trade.profitLoss = profitLoss;
    await trade.save();

    // تحديث الرصيد (خانتا عشرية)
    const user = await User.findByPk(req.user.id);
    const currentBalance = parseFloat(user.balance);
    user.balance = parseFloat((currentBalance + profitLoss).toFixed(2));
    await user.save();

    // stats
    const all = await Trade.findAll({ where: { userId: req.user.id } });
    const totalTrades = all.length;
    const closedTrades = all.filter((t) => t.isClosed).length;
    const openTrades = totalTrades - closedTrades;
    const totalProfit = parseFloat(
      all.reduce((s, t) => s + (parseFloat(t.profitLoss) || 0), 0).toFixed(5)
    );
    const winRate = closedTrades
      ? parseFloat(
          ((all.filter((t) => parseFloat(t.profitLoss) > 0).length / closedTrades) * 100).toFixed(2)
        )
      : 0;

    res.json({
      trade,
      balance: user.balance,
      stats: { totalTrades, openTrades, closedTrades, totalProfit, winRate },
    });
  } catch (err) {
    console.error("Close trade error:", err);
    res.status(500).json({ message: "Failed to close trade" });
  }
});

// Delete trade
router.delete("/:id", auth, async (req, res) => {
  try {
    const trade = await Trade.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!trade) return res.status(404).json({ message: "Trade not found" });

    await trade.destroy();
    res.json({ message: "Trade deleted" });
  } catch (err) {
    console.error("Delete trade error:", err);
    res.status(500).json({ message: "Failed to delete trade" });
  }
});

// Stats
router.get("/stats/all", auth, async (req, res) => {
  try {
    const trades = await Trade.findAll({ where: { userId: req.user.id } });
    const totalTrades = trades.length;
    const closedTrades = trades.filter((t) => t.isClosed).length;
    const openTrades = totalTrades - closedTrades;
    const totalProfit = parseFloat(
      trades.reduce((sum, t) => sum + (parseFloat(t.profitLoss) || 0), 0).toFixed(5)
    );
    const winRate =
      closedTrades > 0
        ? parseFloat(
            ((trades.filter((t) => parseFloat(t.profitLoss) > 0).length / closedTrades) * 100).toFixed(2)
          )
        : 0;

    res.json({ totalTrades, openTrades, closedTrades, totalProfit, winRate });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

module.exports = router;
