/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */
const express = require("express");
const auth = require("../middleware/auth");
const Risk = require("../controllers/risk.controller");

const router = express.Router();

router.post("/calc", auth, Risk.calc);

module.exports = router;
