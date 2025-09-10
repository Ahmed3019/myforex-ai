/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const { randomUUID } = require("crypto");

// مولّد كاندلات تجريبية ثابتة
function genCandles({ symbol, timeframe = "M1", limit = 200 }) {
  const now = Date.now();
  const tfToMs = {
    M1: 60_000,
    M5: 5 * 60_000,
    M15: 15 * 60_000,
    M30: 30 * 60_000,
    H1: 60 * 60_000,
    H4: 4 * 60 * 60_000,
    D1: 24 * 60 * 60_000,
    W1: 7 * 24 * 60 * 60_000,
    MN: 30 * 24 * 60 * 60_000,
  };
  const step = tfToMs[timeframe] || 60_000;

  // seed price على حسب الزوج
  let base = symbol?.includes("JPY") ? 156 : symbol?.includes("XAU") ? 1900 : 1.1;

  const out = [];
  for (let i = limit - 1; i >= 0; i--) {
    const t = now - i * step;
    const drift = (Math.sin((i / 8) * Math.PI) * (symbol?.includes("JPY") ? 0.3 : 0.0015));
    base = base + drift + (Math.random() - 0.5) * (symbol?.includes("JPY") ? 0.12 : 0.0005);

    const o = base + (Math.random() - 0.5) * (symbol?.includes("JPY") ? 0.05 : 0.0002);
    const h = o + Math.abs((Math.random()) * (symbol?.includes("JPY") ? 0.15 : 0.0007));
    const l = o - Math.abs((Math.random()) * (symbol?.includes("JPY") ? 0.15 : 0.0007));
    const c = l + Math.random() * (h - l);
    const v = Math.floor(500 + Math.random() * 5000);

    out.push({
      // ✅ أهم حاجة: time بالثواني (عدد صحيح)
      time: Math.floor(t / 1000),
      open: +o.toFixed(symbol?.includes("JPY") ? 3 : 5),
      high: +h.toFixed(symbol?.includes("JPY") ? 3 : 5),
      low:  +l.toFixed(symbol?.includes("JPY") ? 3 : 5),
      close:+c.toFixed(symbol?.includes("JPY") ? 3 : 5),
      volume: v,
    });
  }
  return out;
}

// GET /api/charts/candles?symbol=EURUSD&timeframe=M1&limit=200
exports.getCandles = async (req, res) => {
  try {
    const { symbol = "EURUSD", timeframe = "M1" } = req.query;
    const limit = Math.min(parseInt(req.query.limit || "200", 10), 2000);
    const candles = genCandles({ symbol, timeframe, limit });
    res.json({ symbol, timeframe, candles });
  } catch (err) {
    console.error("candles error:", err);
    res.status(500).json({ message: "failed to generate candles" });
  }
};

// GET /api/charts/quote?symbol=EURUSD
exports.getQuote = async (req, res) => {
  try {
    const { symbol = "EURUSD" } = req.query;
    const price = symbol.includes("JPY")
      ? +(155 + Math.random()).toFixed(3)
      : +(1.1 + (Math.random() - 0.5) * 0.001).toFixed(5);
    res.json({ symbol, price, ts: Date.now() });
  } catch (err) {
    console.error("quote error:", err);
    res.status(500).json({ message: "failed to quote" });
  }
};

// GET /api/charts/stream?symbol=EURUSD  (SSE)
exports.streamPrice = async (req, res) => {
  try {
    const { symbol = "EURUSD" } = req.query;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    let price = symbol.includes("JPY") ? 155.5 : 1.10000;
    const timer = setInterval(() => {
      const bump = (Math.random() - 0.5) * (symbol.includes("JPY") ? 0.05 : 0.0003);
      price = +(price + bump).toFixed(symbol.includes("JPY") ? 3 : 5);
      res.write(`data: ${JSON.stringify({ symbol, price, ts: Date.now() })}\n\n`);
    }, 1000);

    req.on("close", () => clearInterval(timer));
  } catch (err) {
    console.error("stream error:", err);
    res.end();
  }
};
