/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const express = require("express");
const { User } = require("../models"); // بيتسحب من models/index.js
const auth = require("../middleware/auth");

const router = express.Router();

// Get balance
router.get("/balance", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ balance: user.balance });
  } catch (err) {
    console.error("Balance fetch error:", err);
    res.status(500).json({ message: "Failed to fetch balance" });
  }
});

// Update balance manually
router.put("/balance", auth, async (req, res) => {
  try {
    const { balance } = req.body;
    if (balance === undefined) {
      return res.status(400).json({ message: "Balance is required" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.balance = balance;
    await user.save();

    res.json({ balance: user.balance });
  } catch (err) {
    console.error("Balance update error:", err);
    res.status(500).json({ message: "Failed to update balance" });
  }
});

module.exports = router;
