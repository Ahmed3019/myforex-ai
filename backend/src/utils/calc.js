/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 *
 * P/L math:
 *   pips = (exit - entry) / pipSize * (BUY ? +1 : -1)
 *   PL(USD) = pips * pipValuePerLotUSD(symbol, price) * lotSize
 */

const FX_CONTRACT_SIZE = 100000;   // 1 standard lot
const GOLD_CONTRACT_SIZE = 100;    // XAUUSD 1 lot = 100 oz
const SILVER_CONTRACT_SIZE = 5000; // XAGUSD 1 lot = 5000 oz
const WTI_CONTRACT_SIZE = 1000;    // 1 lot = 1000 barrels

const SYMBOL_SPECS = {
  // FX (quote USD)
  EURUSD: { asset: "FX", pipSize: 0.0001, contractSize: FX_CONTRACT_SIZE, quote: "USD", pipFixedUSD: 10 },
  GBPUSD: { asset: "FX", pipSize: 0.0001, contractSize: FX_CONTRACT_SIZE, quote: "USD", pipFixedUSD: 10 },
  AUDUSD: { asset: "FX", pipSize: 0.0001, contractSize: FX_CONTRACT_SIZE, quote: "USD", pipFixedUSD: 10 },
  NZDUSD: { asset: "FX", pipSize: 0.0001, contractSize: FX_CONTRACT_SIZE, quote: "USD", pipFixedUSD: 10 },

  // JPY / others (dynamic)
  USDJPY: { asset: "FX", pipSize: 0.01, contractSize: FX_CONTRACT_SIZE, quote: "JPY" },
  EURJPY: { asset: "FX", pipSize: 0.01, contractSize: FX_CONTRACT_SIZE, quote: "JPY" },
  GBPJPY: { asset: "FX", pipSize: 0.01, contractSize: FX_CONTRACT_SIZE, quote: "JPY" },
  USDCHF: { asset: "FX", pipSize: 0.0001, contractSize: FX_CONTRACT_SIZE, quote: "CHF" },
  USDCAD: { asset: "FX", pipSize: 0.0001, contractSize: FX_CONTRACT_SIZE, quote: "CAD" },

  // Metals
  XAUUSD: { asset: "Metals", pipSize: 0.01, contractSize: GOLD_CONTRACT_SIZE, quote: "USD", pipFixedUSD: 1 },
  XAGUSD: { asset: "Metals", pipSize: 0.01, contractSize: SILVER_CONTRACT_SIZE, quote: "USD", pipFixedUSD: 50 },

  // Energy
  WTI:    { asset: "Energy", pipSize: 0.01, contractSize: WTI_CONTRACT_SIZE, quote: "USD", pipFixedUSD: 10 },

  // Crypto (assumptions)
  BTCUSD: { asset: "Crypto", pipSize: 0.01, contractSize: 1, quote: "USD", pipFixedUSD: 1 },
  ETHUSD: { asset: "Crypto", pipSize: 0.01, contractSize: 10, quote: "USD", pipFixedUSD: 0.1 },
};

function getSpec(symbol) {
  const key = (symbol || "").toUpperCase();
  return (
    SYMBOL_SPECS[key] || { asset: "FX", pipSize: 0.0001, contractSize: FX_CONTRACT_SIZE, quote: "USD", pipFixedUSD: 10 }
  );
}

function calcPips(symbol, entry, exit, direction) {
  const { pipSize } = getSpec(symbol);
  const sign = direction === "SELL" ? -1 : 1;
  const pips = ((exit - entry) / pipSize) * sign;
  return Number(pips.toFixed(2));
}

function pipValuePerLotUSD(symbol, price) {
  const spec = getSpec(symbol);
  if (spec.pipFixedUSD) return spec.pipFixedUSD;
  if (!price || price <= 0) return 9; // fallback
  const usdVal = (spec.contractSize * spec.pipSize) / price;
  return Number(usdVal.toFixed(6));
}

function calcPL_USD({ symbol, direction, entryPrice, exitPrice, lotSize }) {
  const entry = Number(entryPrice);
  const exit = Number(exitPrice);
  const lots = Number(lotSize);

  const pips = calcPips(symbol, entry, exit, direction);
  const pipVal = pipValuePerLotUSD(symbol, exit || entry || 1);
  const pl = pips * pipVal * lots;

  return {
    pips: Number(pips.toFixed(2)),
    pipValuePerLotUSD: Number(pipVal.toFixed(6)),
    plUSD: Number(pl.toFixed(5)),
  };
}

module.exports = {
  getSpec,
  calcPips,
  pipValuePerLotUSD,
  calcPL_USD,
};
