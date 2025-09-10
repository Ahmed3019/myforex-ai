// backend/src/services/marketData.js
/**
 * Lightweight in-memory market data mock
 * - 1s tick updates
 * - Realistic seeds per symbol
 * - Live M1 bar aggregation; other TFs aggregated from M1
 */

const DEFAULT_SEEDS = {
  EURUSD: 1.10000,
  GBPUSD: 1.27000,
  USDJPY: 146.00000,
  USDCHF: 0.89000,
  USDCAD: 1.35000,
  AUDUSD: 0.66000,
  NZDUSD: 0.61000,

  EURGBP: 0.86000,
  EURJPY: 156.00000,
  GBPJPY: 186.00000,
  AUDJPY: 97.00000,
  CHFJPY: 164.00000,

  USDTRY: 33.00000,
  USDZAR: 18.00000,
  USDSEK: 10.70000,

  XAUUSD: 1940.00, // Gold
  XAGUSD: 24.00,   // Silver

  WTIUSD: 70.00,
  BRENTUSD: 74.00,
  NATGASUSD: 2.50,

  BTCUSD: 50000.00,
  ETHUSD: 2500.00,
};

const TF_SECONDS = {
  M1: 60, M5: 300, M15: 900, M30: 1800,
  H1: 3600, H4: 14400, D1: 86400,
  W1: 604800, MN: 2592000,
};

function tfSeconds(tf) {
  return TF_SECONDS[tf] || 60;
}

function bucketStart(tsSec, tf) {
  const s = tfSeconds(tf);
  return Math.floor(tsSec / s) * s;
}

class MarketData {
  constructor() {
    this.state = new Map(); // symbol -> { price, lastTs, m1Bars: [{time, o,h,l,c}] }
    this._ensureLoop();
  }

  _ensureLoop() {
    if (this.loop) return;
    this.loop = setInterval(() => this._tick(), 1000);
  }

  _ensureSymbol(symbol) {
    if (!this.state.has(symbol)) {
      const seed = DEFAULT_SEEDS[symbol] ?? 1.00000;
      this.state.set(symbol, {
        price: seed,
        lastTs: Date.now(),
        m1Bars: [], // keep last ~1000
      });
    }
    return this.state.get(symbol);
  }

  _randomDrift(symbol, price) {
    // small, symbol-aware step:
    // FX: ~ 0.00005; Metals: ~0.05; Energy: ~0.03; Crypto: ~5
    if (symbol.endsWith("USD") && symbol.length === 6) {
      return (Math.random() - 0.5) * 0.00010;
    }
    if (symbol === "USDJPY" || symbol.endsWith("JPY")) {
      return (Math.random() - 0.5) * 0.05;
    }
    if (symbol === "XAUUSD") return (Math.random() - 0.5) * 0.50;
    if (symbol === "XAGUSD") return (Math.random() - 0.5) * 0.05;
    if (symbol.endsWith("USD") && (symbol.includes("WTI") || symbol.includes("BRENT"))) {
      return (Math.random() - 0.5) * 0.08;
    }
    if (symbol === "NATGASUSD") return (Math.random() - 0.5) * 0.01;
    if (symbol === "BTCUSD") return (Math.random() - 0.5) * 25;
    if (symbol === "ETHUSD") return (Math.random() - 0.5) * 3;
    // fallback
    return (Math.random() - 0.5) * 0.0001;
  }

  _tick() {
    const now = Date.now();
    for (const [symbol, s] of this.state.entries()) {
      // price update
      const drift = this._randomDrift(symbol, s.price);
      let newPrice = s.price + drift;

      // clamp non-negative for things like natgas
      if (newPrice <= 0) newPrice = s.price;

      s.price = newPrice;
      s.lastTs = now;

      // update M1 bar
      const sec = Math.floor(now / 1000);
      const barTime = bucketStart(sec, "M1");
      const bars = s.m1Bars;
      const last = bars[bars.length - 1];

      if (!last || last.time !== barTime) {
        // open new bar
        const p = Number(newPrice);
        bars.push({ time: barTime, open: p, high: p, low: p, close: p });
        if (bars.length > 2000) bars.shift();
      } else {
        // update ongoing bar
        last.close = Number(newPrice);
        if (newPrice > last.high) last.high = Number(newPrice);
        if (newPrice < last.low) last.low = Number(newPrice);
      }
    }
  }

  // public APIs

  ensureWatch(symbol) {
    // touching state ensures symbol starts ticking
    this._ensureSymbol(symbol);
  }

  getQuote(symbol) {
    const s = this._ensureSymbol(symbol);
    return { symbol, price: Number(s.price), ts: s.lastTs };
  }

  getCandles(symbol, timeframe = "M1", limit = 300) {
    const s = this._ensureSymbol(symbol);
    const m1 = s.m1Bars;
    if (timeframe === "M1") {
      return (m1.slice(-limit)).map(b => ({ ...b }));
    }

    // aggregate from M1
    const targetSec = tfSeconds(timeframe);
    const out = [];
    const byBucket = new Map();
    for (const b of m1) {
      const bucket = bucketStart(b.time, timeframe);
      const prev = byBucket.get(bucket);
      if (!prev) {
        byBucket.set(bucket, {
          time: bucket,
          open: b.open, high: b.high, low: b.low, close: b.close,
        });
      } else {
        prev.high = Math.max(prev.high, b.high);
        prev.low = Math.min(prev.low, b.low);
        prev.close = b.close;
      }
    }
    const merged = Array.from(byBucket.values()).sort((a, b) => a.time - b.time);
    return merged.slice(-limit);
  }
}

const marketData = new MarketData();
module.exports = { marketData, tfSeconds, bucketStart };
