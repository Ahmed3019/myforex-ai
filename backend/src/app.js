const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const errorHandler = require("./middleware/error");

const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Health route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to MyForexAI Backend API" });
});

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/trades", require("./routes/trades.routes"));
app.use("/api/user", require("./routes/user.routes"));

app.use(errorHandler);

module.exports = app;
