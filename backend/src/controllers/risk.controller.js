/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */
const { findSymbolMeta, pipsBetween, pipValuePerLotUSD, requiredMarginUSD } = require("../utils/calc");
const { User } = require("../models");

/**
 * POST /api/risk/calc
 * body: { symbol, entryPrice, stopLoss, takeProfit?, lotSize?, riskPercent?, quoteToUSDRate? }
 * مخرجات: pips SL/TP, pipValuePerLotUSD, risk$, positionSizeLots (لو risk% متوفر), margin$، وملاحظات conversion لو لازمة
 */
exports.calc = async (req, res) => {
  try {
    const { symbol, entryPrice, stopLoss, takeProfit, lotSize, riskPercent, quoteToUSDRate } = req.body;

    if (!symbol || !entryPrice) {
      return res.status(400).json({ message: "symbol and entryPrice are required" });
    }

    const meta = findSymbolMeta(symbol);
    if (!meta) return res.status(400).json({ message: "Unknown symbol" });

    const user = await User.findByPk(req.user.id);
    const balance = parseFloat(user.balance);
    const leverage = user.defaultLeverage || 100;

    const pipValue = pipValuePerLotUSD({ symbol, price: entryPrice, quoteToUSDRate });

    // مسافات النقاط
    const slPips = stopLoss ? pipsBetween(entryPrice, stopLoss, meta.pipSize) : null;
    const tpPips = takeProfit ? pipsBetween(entryPrice, takeProfit, meta.pipSize) : null;

    // لو عايز نطلع اللوت من risk%
    let suggestedLots = null;
    let riskUSD = null;
    if (riskPercent && slPips && pipValue) {
      riskUSD = balance * (parseFloat(riskPercent) / 100.0);
      // riskUSD ≈ lots * slPips * pipValue
      suggestedLots = riskUSD / (slPips * pipValue);
    }

    // لو فيه lotSize ممرّر احسب الهامش التقريبي
    let marginUSD = null;
    if (lotSize) {
      marginUSD = requiredMarginUSD({ symbol, entryPrice, leverage, lots: lotSize });
    }

    return res.json({
      meta: {
        symbol: meta.symbol,
        asset_class: meta.asset_class,
        pipSize: meta.pipSize,
        contractSize: meta.contractSize,
      },
      pipValuePerLotUSD: pipValue,           // ممكن يكون null لو محتاج conversion
      slPips,
      tpPips,
      riskUSD,
      suggestedLots,
      marginUSD,
      notes: pipValue === null
        ? "For non-USD crosses, provide quoteToUSDRate (USD per 1 quote currency) until live prices are added in Phase 3."
        : undefined,
    });
  } catch (err) {
    console.error("Risk calc error:", err);
    res.status(500).json({ message: "Risk calc failed" });
  }
};
