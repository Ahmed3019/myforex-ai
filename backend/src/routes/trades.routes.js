/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const express = require("express");
const { Trade, User } = require("../models");
const auth = require("../middleware/auth");
const { calcPL_USD } = require("../utils/calc");

const router = express.Router();

async function buildStats(userId) {
  const all = await Trade.findAll({ where: { userId } });
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

  return { totalTrades, openTrades, closedTrades, totalProfit, winRate };
}

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

// Close trade (compute P/L + update balance + stats)
router.put("/:id/close", auth, async (req, res) => {
  try {
    const { exitPrice } = req.body;
    if (exitPrice === undefined || exitPrice === null || exitPrice === "")
      return res.status(400).json({ message: "exitPrice is required" });

    const exit = parseFloat(exitPrice);
    if (Number.isNaN(exit))
      return res.status(400).json({ message: "exitPrice must be a number" });

    const trade = await Trade.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!trade) return res.status(404).json({ message: "Trade not found" });

    const entry = parseFloat(trade.entryPrice);
    const lots = parseFloat(trade.lotSize);

    const { plUSD } = calcPL_USD({
      symbol: trade.symbol,
      direction: trade.direction,
      entryPrice: entry,
      exitPrice: exit,
      lotSize: lots,
    });

    trade.exitPrice = exit;
    trade.isClosed = true;
    trade.profitLoss = plUSD; // 5 decimals
    await trade.save();

    const user = await User.findByPk(req.user.id);
    user.balance = parseFloat((parseFloat(user.balance) + plUSD).toFixed(2));
    await user.save();

    const stats = await buildStats(req.user.id);
    res.json({ trade, balance: user.balance, stats });
  } catch (err) {
    console.error("Close trade error:", err);
    res.status(500).json({ message: "Failed to close trade", error: err.message });
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
    const stats = await buildStats(req.user.id);
    res.json(stats);
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

module.exports = router;
