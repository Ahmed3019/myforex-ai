/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const FX_CONTRACT_SIZE = 100000;   // 1 standard lot
const GOLD_CONTRACT_SIZE = 100;    // XAUUSD 1 lot = 100 oz
const SILVER_CONTRACT_SIZE = 5000; // XAGUSD 1 lot = 5000 oz
const WTI_CONTRACT_SIZE = 1000;    // 1 lot = 1000 barrels

export const SYMBOL_SPECS = {
  // FX (quote USD) -> pip value ثابت 10$ لكل 1 Lot و 1 pip
  EURUSD: { asset: "FX", pipSize: 0.0001, contractSize: FX_CONTRACT_SIZE, quote: "USD", pipFixedUSD: 10 },
  GBPUSD: { asset: "FX", pipSize: 0.0001, contractSize: FX_CONTRACT_SIZE, quote: "USD", pipFixedUSD: 10 },
  AUDUSD: { asset: "FX", pipSize: 0.0001, contractSize: FX_CONTRACT_SIZE, quote: "USD", pipFixedUSD: 10 },
  NZDUSD: { asset: "FX", pipSize: 0.0001, contractSize: FX_CONTRACT_SIZE, quote: "USD", pipFixedUSD: 10 },

  // JPY وأزواج تانية (pip value ديناميكي = contract*pipSize/price)
  USDJPY: { asset: "FX", pipSize: 0.01,   contractSize: FX_CONTRACT_SIZE, quote: "JPY" },
  EURJPY: { asset: "FX", pipSize: 0.01,   contractSize: FX_CONTRACT_SIZE, quote: "JPY" },
  GBPJPY: { asset: "FX", pipSize: 0.01,   contractSize: FX_CONTRACT_SIZE, quote: "JPY" },
  USDCHF: { asset: "FX", pipSize: 0.0001, contractSize: FX_CONTRACT_SIZE, quote: "CHF" },
  USDCAD: { asset: "FX", pipSize: 0.0001, contractSize: FX_CONTRACT_SIZE, quote: "CAD" },

  // Metals
  XAUUSD: { asset: "Metals", pipSize: 0.01, contractSize: GOLD_CONTRACT_SIZE,  quote: "USD", pipFixedUSD: 1 },
  XAGUSD: { asset: "Metals", pipSize: 0.01, contractSize: SILVER_CONTRACT_SIZE, quote: "USD", pipFixedUSD: 50 },

  // Energy
  WTI:    { asset: "Energy", pipSize: 0.01, contractSize: WTI_CONTRACT_SIZE, quote: "USD", pipFixedUSD: 10 },

  // Crypto (افتراضات شائعة)
  BTCUSD: { asset: "Crypto", pipSize: 0.01, contractSize: 1,  quote: "USD", pipFixedUSD: 1 },
  ETHUSD: { asset: "Crypto", pipSize: 0.01, contractSize: 10, quote: "USD", pipFixedUSD: 0.1 },
};

export function getSpec(symbol) {
  const key = (symbol || "").toUpperCase();
  return (
    SYMBOL_SPECS[key] || { asset: "FX", pipSize: 0.0001, contractSize: FX_CONTRACT_SIZE, quote: "USD", pipFixedUSD: 10 }
  );
}

export function calcPips(symbol, entry, otherPrice) {
  const { pipSize } = getSpec(symbol);
  if (!entry || !otherPrice) return 0;
  const pips = Math.abs((Number(otherPrice) - Number(entry)) / pipSize);
  return Number(pips.toFixed(2));
}

export function pipValuePerLotUSD(symbol, priceOrEntry) {
  const spec = getSpec(symbol);
  if (spec.pipFixedUSD) return spec.pipFixedUSD;
  const price = Number(priceOrEntry) || 1;
  const usdVal = (spec.contractSize * spec.pipSize) / price;
  return Number(usdVal.toFixed(6));
}

/**
 * lotSize = (riskAmount) / (pips * pipValuePerLotUSD)
 * riskAmount = balance * (risk%/100)
 */
export function suggestLotSize({ symbol, entry, sl, balance, riskPercent }) {
  const pips = calcPips(symbol, entry, sl);
  if (!pips || !balance || !riskPercent) return { pips: 0, pipVal: 0, lot: 0, riskAmount: 0 };
  const pipVal = pipValuePerLotUSD(symbol, entry);
  const riskAmount = Number(balance) * (Number(riskPercent) / 100);
  const lot = riskAmount / (pips * pipVal);
  return {
    pips,
    pipVal: Number(pipVal.toFixed(6)),
    riskAmount: Number(riskAmount.toFixed(2)),
    lot: Number(lot.toFixed(2)),
  };
}

export function rrTargets({ direction, entry, sl, rr = 2 }) {
  const e = Number(entry), s = Number(sl);
  if (!e || !s) return { rr, tp: null };
  const riskPerUnit = Math.abs(e - s);
  const tp = direction === "BUY" ? e + rr * riskPerUnit : e - rr * riskPerUnit;
  return { rr, tp: Number(tp.toFixed(5)) };
}
