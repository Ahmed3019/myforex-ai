/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const {
  FX_MAJORS, FX_MINORS, FX_EXOTICS, METALS, ENERGY, CRYPTO,
  flatPairs
} = require("../utils/symbols");

/** ابحث عن تعريف الزوج/الأصل */
function findSymbolMeta(symbol) {
  const all = flatPairs();
  return all.find((s) => s.symbol === symbol);
}

/** احسب عدد النقاط (pips) حسب pipSize */
function pipsBetween(a, b, pipSize) {
  const diff = Math.abs(parseFloat(a) - parseFloat(b));
  return diff / pipSize;
}

/**
 * احسب قيمة النقطة للوت واحد (USD per pip per 1 Lot)
 * قواعد مبسطة (حساب بالدولار):
 * - لو الزوج بينتهي بـ USD (EURUSD, GBPUSD, XAUUSD, WTIUSD ..): pipValue = contractSize * pipSize
 * - لو بيبدأ بـ USD (USDJPY): pipValue = (contractSize * pipSize) / price
 * - لو Cross (لا يبدأ ولا ينتهي بـ USD) زي EURGBP, EURJPY:
 *     نحتاج "quoteToUSDRate" = سعر تحويل عملة الـ quote إلى USD (مثلاً GBPUSD، أو USDJPY -> نستخدم 1/USDJPY)
 *     pipValueUSD = contractSize * pipSize * quoteToUSDRate
 */
function pipValuePerLotUSD({ symbol, price, quoteToUSDRate }) {
  const meta = findSymbolMeta(symbol);
  if (!meta) throw new Error(`Unknown symbol meta for ${symbol}`);

  const { pipSize, contractSize, asset_class } = meta;

  const base = symbol.slice(0, 3);
  const quote = symbol.slice(3);

  // أصول مسعّرة بالدولار مباشرة (الكثير منها سينطبق عليه rule endsWith USD)
  if (quote === "USD") {
    return contractSize * pipSize; // مثال EURUSD -> 100000 * 0.0001 = 10 USD
  }

  // أزواج تبدأ بـ USD (USDJPY مثلاً)
  if (base === "USD") {
    if (!price) throw new Error("price is required to compute pip value for USD-base pairs");
    return (contractSize * pipSize) / parseFloat(price); // ~ 1000/price
  }

  // Crosses: EURGBP, EURJPY, ...
  // نحتاج تحويل عملة الـ quote إلى USD
  if (quoteToUSDRate && !isNaN(parseFloat(quoteToUSDRate))) {
    return contractSize * pipSize * parseFloat(quoteToUSDRate);
  }

  // مفيش conversion → رجّع null (الـ FE ممكن يطلب conversion مؤقتًا لحد Phase 3 live prices)
  return null;
}

/** الهامش المطلوب (Margin) بالدولار التقريبي */
function requiredMarginUSD({ symbol, entryPrice, leverage, lots }) {
  const meta = findSymbolMeta(symbol);
  if (!meta) throw new Error(`Unknown symbol meta for ${symbol}`);

  const { contractSize } = meta;
  const base = symbol.slice(0, 3);
  const quote = symbol.slice(3);

  // تقدير بسيط:
  // - لو المسعّر بالدولار (quote USD) أو الذهب…: margin = entryPrice * contractSize * lots / leverage
  // - لو USD في البداية (USDJPY): نستخدم نفس المعادلة (النتيجة بالدولار تقريبًا)
  // - لو Cross: نحتاج تحويل، هنرجّع null مؤقتًا.
  if (quote === "USD" || base === "USD") {
    return (parseFloat(entryPrice) * contractSize * parseFloat(lots)) / parseFloat(leverage);
  }
  return null;
}

/** احسب P/L بالدولار بناءً على pips وقيمة النقطة */
function computePLUSD({ symbol, entryPrice, exitPrice, lotSize, quoteToUSDRate }) {
  const meta = findSymbolMeta(symbol);
  if (!meta) throw new Error(`Unknown symbol meta for ${symbol}`);

  const { pipSize } = meta;
  const pips = pipsBetween(entryPrice, exitPrice, pipSize);

  const pv = pipValuePerLotUSD({ symbol, price: entryPrice, quoteToUSDRate });
  if (pv === null) {
    return { plUSD: null, pips, pipValuePerLotUSD: null }; // محتاج conversion
  }

  // اتجاه الصفقة لازم يتحدد برّه (BUY/SELL)
  const raw = pips * pv * parseFloat(lotSize);
  return { plUSD: raw, pips, pipValuePerLotUSD: pv };
}

module.exports = {
  findSymbolMeta,
  pipsBetween,
  pipValuePerLotUSD,
  requiredMarginUSD,
  computePLUSD,
};
