/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */
const express = require("express");
const router = express.Router();
const Meta = require("../controllers/meta.controller");

router.get("/pairs", Meta.getPairs);
router.get("/timeframes", Meta.getTimeframes);
router.get("/strategies", Meta.getStrategies);
router.get("/leverage", Meta.getLeverage);

module.exports = router;
