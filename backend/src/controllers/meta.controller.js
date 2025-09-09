/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */
const {
  FX_MAJORS, FX_MINORS, FX_EXOTICS, METALS, ENERGY, CRYPTO,
  TIMEFRAMES, STRATEGIES, LEVERAGES, flatPairs
} = require("../utils/symbols");

exports.getPairs = (req, res) => {
  res.json({
    pairs: flatPairs(),
    groups: {
      FX: { MAJORS: FX_MAJORS, MINORS: FX_MINORS, EXOTICS: FX_EXOTICS },
      METALS,
      ENERGY,
      CRYPTO,
    },
  });
};

exports.getTimeframes = (req, res) => res.json({ timeframes: TIMEFRAMES });
exports.getStrategies = (req, res) => res.json({ strategies: STRATEGIES });
exports.getLeverage  = (req, res) => res.json({ leverages: LEVERAGES });
