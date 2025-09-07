/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const { getCandles, nextTick } = require('../services/marketData');
const { isValidSymbol } = require('../utils/symbols');

/**
 * GET /api/charts/candles?symbol=EURUSD&tf=M15&from=ISO&to=ISO
 */
async function candles(req, res, next) {
  try {
    const symbol = (req.query.symbol || '').toUpperCase();
    const timeframe = (req.query.tf || 'M15').toUpperCase();
    const from = req.query.from;
    const to = req.query.to;

    if (!symbol || !isValidSymbol(symbol)) {
      return res.status(400).json({ message: 'Invalid or missing symbol' });
    }
    if (!from || !to) {
      return res.status(400).json({ message: 'from and to are required (ISO dates)' });
    }

    const data = await getCandles(symbol, timeframe, from, to);
    return res.json({ symbol, timeframe, candles: data });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/charts/stream/price?symbol=EURUSD
 * Server-Sent Events stream of prices.
 */
async function streamPrice(req, res) {
  const symbol = (req.query.symbol || '').toUpperCase();
  if (!symbol || !isValidSymbol(symbol)) {
    res.status(400).json({ message: 'Invalid or missing symbol' });
    return;
  }

  // SSE headers
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });
  res.flushHeaders?.();

  // First tick immediately
  const tickNow = nextTick(symbol);
  res.write(`event: price\n`);
  res.write(`data: ${JSON.stringify({ symbol, price: tickNow, ts: new Date().toISOString() })}\n\n`);

  // Interval ticks
  const interval = setInterval(() => {
    const p = nextTick(symbol);
    res.write(`event: price\n`);
    res.write(`data: ${JSON.stringify({ symbol, price: p, ts: new Date().toISOString() })}\n\n`);
  }, 1000);

  // Client disconnect
  req.on('close', () => {
    clearInterval(interval);
  });
}

module.exports = { candles, streamPrice };
