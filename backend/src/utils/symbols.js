/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const FX_MAJORS = [
  { symbol: "EURUSD", display: "EUR/USD", asset_class: "FX", pipSize: 0.0001, contractSize: 100000 },
  { symbol: "GBPUSD", display: "GBP/USD", asset_class: "FX", pipSize: 0.0001, contractSize: 100000 },
  { symbol: "USDJPY", display: "USD/JPY", asset_class: "FX", pipSize: 0.01,   contractSize: 100000 },
  { symbol: "USDCHF", display: "USD/CHF", asset_class: "FX", pipSize: 0.0001, contractSize: 100000 },
  { symbol: "USDCAD", display: "USD/CAD", asset_class: "FX", pipSize: 0.0001, contractSize: 100000 },
  { symbol: "AUDUSD", display: "AUD/USD", asset_class: "FX", pipSize: 0.0001, contractSize: 100000 },
  { symbol: "NZDUSD", display: "NZD/USD", asset_class: "FX", pipSize: 0.0001, contractSize: 100000 },
];

const FX_MINORS = [
  { symbol: "EURGBP", display: "EUR/GBP", asset_class: "FX", pipSize: 0.0001, contractSize: 100000 },
  { symbol: "EURJPY", display: "EUR/JPY", asset_class: "FX", pipSize: 0.01,   contractSize: 100000 },
  { symbol: "GBPJPY", display: "GBP/JPY", asset_class: "FX", pipSize: 0.01,   contractSize: 100000 },
  { symbol: "AUDJPY", display: "AUD/JPY", asset_class: "FX", pipSize: 0.01,   contractSize: 100000 },
  { symbol: "CHFJPY", display: "CHF/JPY", asset_class: "FX", pipSize: 0.01,   contractSize: 100000 },
];

const FX_EXOTICS = [
  { symbol: "USDTRY", display: "USD/TRY", asset_class: "FX", pipSize: 0.0001, contractSize: 100000 },
  { symbol: "USDZAR", display: "USD/ZAR", asset_class: "FX", pipSize: 0.0001, contractSize: 100000 },
  { symbol: "USDSEK", display: "USD/SEK", asset_class: "FX", pipSize: 0.0001, contractSize: 100000 },
];

const METALS = [
  { symbol: "XAUUSD", display: "XAU/USD (Gold)",  asset_class: "METAL",  pipSize: 0.01,  contractSize: 100 },
  { symbol: "XAGUSD", display: "XAG/USD (Silver)", asset_class: "METAL",  pipSize: 0.01,  contractSize: 5000 },
];

const ENERGY = [
  { symbol: "WTIUSD",    display: "WTI/USD",     asset_class: "ENERGY", pipSize: 0.01,  contractSize: 1000 },
  { symbol: "BRENTUSD",  display: "BRENT/USD",   asset_class: "ENERGY", pipSize: 0.01,  contractSize: 1000 },
  { symbol: "NATGASUSD", display: "NATGAS/USD",  asset_class: "ENERGY", pipSize: 0.001, contractSize: 10000 },
];

const CRYPTO = [
  { symbol: "BTCUSD", display: "BTC/USD", asset_class: "CRYPTO", pipSize: 0.01,  contractSize: 1 },
  { symbol: "ETHUSD", display: "ETH/USD", asset_class: "CRYPTO", pipSize: 0.01,  contractSize: 10 },
];

const TIMEFRAMES = ["M1","M5","M15","M30","H1","H4","D1","W1","MN"];
const STRATEGIES = ["Scalping","Day Trading","Swing","Breakout","Mean Reversion"];
const LEVERAGES  = [50,100,200,500];

function flatPairs() {
  return [
    ...FX_MAJORS, ...FX_MINORS, ...FX_EXOTICS,
    ...METALS, ...ENERGY, ...CRYPTO
  ];
}

/** 
 * دالة مساعدة تجيب الـ metadata بتاع أي Symbol
 */
function getSymbolMeta(symbol) {
  return flatPairs().find(s => s.symbol === symbol);
}

module.exports = {
  FX_MAJORS, FX_MINORS, FX_EXOTICS, METALS, ENERGY, CRYPTO,
  TIMEFRAMES, STRATEGIES, LEVERAGES,
  flatPairs, getSymbolMeta,
};
