/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const Trade = require('../models/Trade');

// GET all trades
async function getAllTrades(req, res, next) {
  try {
    const trades = await Trade.findAll({ where: { userId: req.user.id } });
    res.json(trades);
  } catch (err) {
    next(err);
  }
}

// POST add trade
async function addTrade(req, res, next) {
  try {
    const trade = await Trade.create({ ...req.body, userId: req.user.id });
    res.status(201).json(trade);
  } catch (err) {
    next(err);
  }
}

// PUT update trade
async function updateTrade(req, res, next) {
  try {
    const trade = await Trade.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!trade) return res.status(404).json({ message: 'Trade not found' });

    await trade.update(req.body);
    res.json(trade);
  } catch (err) {
    next(err);
  }
}

// PUT close trade
async function closeTrade(req, res, next) {
  try {
    const trade = await Trade.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!trade) return res.status(404).json({ message: 'Trade not found' });

    const { exitPrice } = req.body;
    trade.exitPrice = exitPrice;
    trade.profitLoss = (exitPrice - trade.entryPrice) * (trade.direction === 'BUY' ? 1 : -1) * trade.lotSize;
    trade.isClosed = true;

    await trade.save();
    res.json(trade);
  } catch (err) {
    next(err);
  }
}

// DELETE trade
async function deleteTrade(req, res, next) {
  try {
    const rows = await Trade.destroy({ where: { id: req.params.id, userId: req.user.id } });
    if (!rows) return res.status(404).json({ message: 'Trade not found' });

    res.json({ message: 'Trade deleted' });
  } catch (err) {
    next(err);
  }
}

// GET stats
async function getStats(req, res, next) {
  try {
    const trades = await Trade.findAll({ where: { userId: req.user.id } });
    const closedTrades = trades.filter(t => t.isClosed);

    const totalProfit = closedTrades.reduce((acc, t) => acc + (t.profitLoss || 0), 0);
    const winRate = closedTrades.length
      ? (closedTrades.filter(t => (t.profitLoss || 0) > 0).length / closedTrades.length) * 100
      : 0;

    res.json({
      totalTrades: trades.length,
      openTrades: trades.filter(t => !t.isClosed).length,
      closedTrades: closedTrades.length,
      totalProfit,
      winRate,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllTrades, addTrade, updateTrade, closeTrade, deleteTrade, getStats };
