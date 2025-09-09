/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

// Basic specs per symbol for pip calculation & contract sizes
// pipSize = minimum price move considered 1 pip for that market
// contractSize used for metals/energy/crypto approximations where needed
export const SYMBOL_SPECS = {
  // FX Majors
  EURUSD: { asset: "FX", quote: "USD", pipSize: 0.0001, contractSize: 100000 },
  GBPUSD: { asset: "FX", quote: "USD", pipSize: 0.0001, contractSize: 100000 },
  USDJPY: { asset: "FX", quote: "JPY", pipSize: 0.01,   contractSize: 100000 },
  USDCHF: { asset: "FX", quote: "CHF", pipSize: 0.0001, contractSize: 100000 },
  USDCAD: { asset: "FX", quote: "CAD", pipSize: 0.0001, contractSize: 100000 },
  AUDUSD: { asset: "FX", quote: "USD", pipSize: 0.0001, contractSize: 100000 },
  NZDUSD: { asset: "FX", quote: "USD", pipSize: 0.0001, contractSize: 100000 },

  // FX Minors / Crosses
  EURJPY: { asset: "FX", quote: "JPY", pipSize: 0.01,   contractSize: 100000 },
  GBPJPY: { asset: "FX", quote: "JPY", pipSize: 0.01,   contractSize: 100000 },
  EURGBP: { asset: "FX", quote: "GBP", pipSize: 0.0001, contractSize: 100000 },
  EURCHF: { asset: "FX", quote: "CHF", pipSize: 0.0001, contractSize: 100000 },
  EURCAD: { asset: "FX", quote: "CAD", pipSize: 0.0001, contractSize: 100000 },
  EURNZD: { asset: "FX", quote: "NZD", pipSize: 0.0001, contractSize: 100000 },
  EURAUD: { asset: "FX", quote: "AUD", pipSize: 0.0001, contractSize: 100000 },
  GBPAUD: { asset: "FX", quote: "AUD", pipSize: 0.0001, contractSize: 100000 },
  GBPCAD: { asset: "FX", quote: "CAD", pipSize: 0.0001, contractSize: 100000 },
  GBPCHF: { asset: "FX", quote: "CHF", pipSize: 0.0001, contractSize: 100000 },
  AUDJPY: { asset: "FX", quote: "JPY", pipSize: 0.01,   contractSize: 100000 },
  CADJPY: { asset: "FX", quote: "JPY", pipSize: 0.01,   contractSize: 100000 },
  CHFJPY: { asset: "FX", quote: "JPY", pipSize: 0.01,   contractSize: 100000 },
  NZDJPY: { asset: "FX", quote: "JPY", pipSize: 0.01,   contractSize: 100000 },

  // Metals
  XAUUSD: { asset: "Metals", quote: "USD", pipSize: 0.01, contractSize: 100 },   // 1 lot = 100 oz
  XAGUSD: { asset: "Metals", quote: "USD", pipSize: 0.01, contractSize: 5000 },  // 1 lot = 5000 oz

  // Energy
  WTI:    { asset: "Energy", quote: "USD", pipSize: 0.01, contractSize: 1000 },  // 1 lot = 1000 barrels

  // Crypto (assumption contract sizes; vary by broker)
  BTCUSD: { asset: "Crypto", quote: "USD", pipSize: 0.01, contractSize: 1 },     // 1 lot = 1 BTC
  ETHUSD: { asset: "Crypto", quote: "USD", pipSize: 0.01, contractSize: 10 },    // 1 lot = 10 ETH (example)
};

// Grouping for UI dropdowns
export const GROUPS = {
  FX_Majors: ["EURUSD","GBPUSD","AUDUSD","NZDUSD","USDJPY","USDCHF","USDCAD"],
  FX_Crosses: ["EURJPY","GBPJPY","EURGBP","EURAUD","EURNZD","EURCHF","EURCAD","GBPAUD","GBPCAD","GBPCHF","AUDJPY","CADJPY","CHFJPY","NZDJPY"],
  Metals: ["XAUUSD","XAGUSD"],
  Energy: ["WTI"],
  Crypto: ["BTCUSD","ETHUSD"],
};

// Fallback spec getter
export const getSpec = (symbol) => SYMBOL_SPECS[symbol] || { asset: "FX", quote: "USD", pipSize: 0.0001, contractSize: 100000 };

// Pip calc (in pips)
export const calcPips = (symbol, entry, price) => {
  if (!entry || !price) return 0;
  const { pipSize } = getSpec(symbol);
  return Math.abs((Number(price) - Number(entry)) / pipSize);
};

// Pip value per 1 lot in USD (approx)
export const pipValuePerLotUSD = (symbol, price = 1) => {
  const spec = getSpec(symbol);
  // For most USD-quoted pairs (EURUSD, GBPUSD...) pip value per 1 lot ~ $10
  if (spec.asset === "FX") {
    if (spec.quote === "USD") return 10;
    if (spec.quote === "JPY") {
      // ~ (100000 * pipSize) / price -> e.g., USDJPY ~ 100000*0.01/price
      return (spec.contractSize * spec.pipSize) / Number(price || 1);
    }
    // Non-USD quotes (rough approximation in USD)
    return 10; // simplification
  }
  if (spec.asset === "Metals") {
    // XAU: 1 lot = 100 oz, tick=0.01, assume $1 per 0.01 per lot -> $1 per pip per lot
    if (symbol === "XAUUSD") return 1;
    // XAG: 5000 oz, tick=0.01 -> $50 per pip per lot
    if (symbol === "XAGUSD") return 50;
  }
  if (spec.asset === "Energy") {
    // WTI: 1000 barrels, tick=0.01 -> $10 per pip per lot
    return 10;
  }
  if (spec.asset === "Crypto") {
    // Highly broker-dependent; approximate: BTCUSD (1 lot=1 BTC) -> $1 per 0.01 ($0.01 pip) => $1 per pip
    if (symbol === "BTCUSD") return 1;
    if (symbol === "ETHUSD") return 0.1; // example for 10 ETH lot
  }
  return 10;
};

// Suggested lot size (risk %) given SL distance
export const suggestLotSize = ({ symbol, entry, sl, balance, riskPercent }) => {
  const e = Number(entry);
  const s = Number(sl);
  const bal = Number(balance);
  const r = Number(riskPercent);
  if (!e || !s || !bal || !r) return { lot: 0, riskAmount: 0 };

  const pips = calcPips(symbol, e, s);
  if (pips <= 0) return { lot: 0, riskAmount: 0 };

  const pipVal = pipValuePerLotUSD(symbol, e);
  const riskAmount = (bal * r) / 100;
  const lot = riskAmount / (pips * pipVal);
  return { lot, riskAmount };
};

// RR → TP price suggestion
export const rrTargets = ({ direction, entry, sl, rr }) => {
  const e = Number(entry);
  const s = Number(sl);
  const R = Number(rr || 2);
  if (!e || !s) return { tp: null };

  const diff = Math.abs(e - s);
  if (direction === "BUY") {
    return { tp: e + diff * R };
  } else {
    return { tp: e - diff * R };
  }
};
