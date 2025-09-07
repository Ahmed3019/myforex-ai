/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

// Minimal instrument metadata for calculations/mock generation
const INSTRUMENTS = {
  EURUSD: { display: 'EUR/USD', asset_class: 'FX', pipSize: 0.0001, startPrice: 1.1000 },
  GBPUSD: { display: 'GBP/USD', asset_class: 'FX', pipSize: 0.0001, startPrice: 1.2700 },
  USDJPY: { display: 'USD/JPY', asset_class: 'FX', pipSize: 0.01,   startPrice: 146.00 },
  XAUUSD: { display: 'XAU/USD', asset_class: 'METAL', pipSize: 0.1,  startPrice: 2400.0 },
  BTCUSD: { display: 'BTC/USD', asset_class: 'CRYPTO', pipSize: 1.0, startPrice: 60000.0 },
};

function isValidSymbol(symbol) {
  return !!INSTRUMENTS[symbol];
}

function getInstrument(symbol) {
  return INSTRUMENTS[symbol];
}

module.exports = { INSTRUMENTS, isValidSymbol, getInstrument };
