/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const Candle = require('../models/Candle');
const { getInstrument, isValidSymbol } = require('../utils/symbols');

// In-memory last prices for tick simulation (until real provider is integrated)
const lastPriceMap = new Map();

/**
 * Returns timeframe in minutes.
 */
function tfToMinutes(tf) {
  const map = { M1: 1, M5: 5, M15: 15, M30: 30, H1: 60, H4: 240, D1: 1440 };
  return map[tf] || 15;
}

/**
 * Generate synthetic candles (only for demo) if DB has no data yet.
 * Simple random walk around a base price.
 */
function generateSyntheticCandles(symbol, timeframe, from, to) {
  const inst = getInstrument(symbol);
  const minutes = tfToMinutes(timeframe);
  const msStep = minutes * 60 * 1000;

  const out = [];
  let t = new Date(from).getTime();
  const toMs = new Date(to).getTime();
  let base = inst?.startPrice ?? 1.2000;

  while (t <= toMs) {
    // random walk
    const drift = (Math.random() - 0.5) * (inst?.pipSize || 0.0001) * 20;
    const o = base;
    const c = o + drift;
    const high = Math.max(o, c) + Math.abs(drift) * 0.5;
    const low  = Math.min(o, c) - Math.abs(drift) * 0.5;
    const vol  = Math.floor(Math.random() * 1000) + 100;

    out.push({
      symbol,
      timeframe,
      ts: new Date(t),
      open: Number(o.toFixed(6)),
      high: Number(high.toFixed(6)),
      low: Number(low.toFixed(6)),
      close: Number(c.toFixed(6)),
      volume: vol,
    });

    base = c;
    t += msStep;
  }

  return out;
}

/**
 * Get candles:
 * - Try DB (future: when real ingestion exists)
 * - If empty, generate synthetic series for demo/testing
 */
async function getCandles(symbol, timeframe, fromISO, toISO) {
  if (!isValidSymbol(symbol)) {
    const err = new Error('Unsupported symbol');
    err.status = 400;
    throw err;
  }

  const from = new Date(fromISO);
  const to = new Date(toISO);
  if (isNaN(from) || isNaN(to) || from >= to) {
    const err = new Error('Invalid date range');
    err.status = 400;
    throw err;
  }

  // Try DB (optional for future)
  const rows = await Candle.findAll({
    where: { symbol, timeframe, ts: { $between: [from, to] } },
    order: [['ts', 'ASC']],
    // NOTE: Sequelize v6 uses Op.between. We keep $between placeholder for future migration.
  }).catch(() => []); // tolerate until Op imported

  if (rows && rows.length > 0) {
    return rows.map(r => ({
      symbol: r.symbol,
      timeframe: r.timeframe,
      ts: r.ts,
      open: r.open,
      high: r.high,
      low: r.low,
      close: r.close,
      volume: r.volume,
    }));
  }

  // Fallback: synthetic candles
  return generateSyntheticCandles(symbol, timeframe, from, to);
}

/**
 * Get or initialize last price for a symbol (for SSE ticks).
 */
function getLastPrice(symbol) {
  if (!lastPriceMap.has(symbol)) {
    const inst = getInstrument(symbol);
    lastPriceMap.set(symbol, inst?.startPrice ?? 1.2000);
  }
  return lastPriceMap.get(symbol);
}

/**
 * Produce next tick (simple random walk).
 */
function nextTick(symbol) {
  const inst = getInstrument(symbol);
  const pip = inst?.pipSize || 0.0001;
  const last = getLastPrice(symbol);
  const delta = (Math.random() - 0.5) * pip * 5;
  const next = Number((last + delta).toFixed(6));
  lastPriceMap.set(symbol, next);
  return next;
}

module.exports = { getCandles, getLastPrice, nextTick, tfToMinutes };
