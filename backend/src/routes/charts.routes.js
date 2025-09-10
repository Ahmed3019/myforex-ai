const router = require("express").Router();
const { getCandles, getQuote, streamPrice } = require("../controllers/charts.controller");

router.get("/candles", getCandles);
router.get("/quote", getQuote);
router.get("/stream", streamPrice);

module.exports = router;
