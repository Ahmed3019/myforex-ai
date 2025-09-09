/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */
const { User } = require("../models");

exports.getSettings = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["baseCurrency", "defaultLeverage", "timezone", "theme", "balance"]
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      settings: {
        baseCurrency:    user.baseCurrency    || "USD",
        defaultLeverage: user.defaultLeverage || 100,
        timezone:        user.timezone        || "Africa/Cairo",
        theme:           user.theme           || "light",
        balance:         user.balance ?? 100.00,
      }
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { baseCurrency, defaultLeverage, timezone, theme } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (baseCurrency !== undefined)    user.baseCurrency    = String(baseCurrency).toUpperCase();
    if (defaultLeverage !== undefined) user.defaultLeverage = parseInt(defaultLeverage, 10) || 100;
    if (timezone !== undefined)        user.timezone        = String(timezone);
    if (theme !== undefined)           user.theme           = theme === "dark" ? "dark" : "light";

    await user.save();

    res.json({
      settings: {
        baseCurrency: user.baseCurrency,
        defaultLeverage: user.defaultLeverage,
        timezone: user.timezone,
        theme: user.theme,
        balance: user.balance,
      }
    });
  } catch {
    res.status(500).json({ message: "Failed to update settings" });
  }
};

exports.getBalance = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ balance: user.balance });
  } catch {
    res.status(500).json({ message: "Failed to fetch balance" });
  }
};

exports.updateBalance = async (req, res) => {
  try {
    const { balance } = req.body;
    const user = await User.findByPk(req.user.id);
    user.balance = parseFloat(balance).toFixed(2);
    await user.save();
    res.json({ balance: user.balance });
  } catch {
    res.status(500).json({ message: "Failed to update balance" });
  }
};
