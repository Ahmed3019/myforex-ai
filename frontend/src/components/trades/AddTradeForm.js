/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const SYMBOLS = {
  FX: ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD"],
  Metals: ["XAUUSD", "XAGUSD"],
  Energy: ["WTI", "Brent"],
  Crypto: ["BTCUSD", "ETHUSD"],
};

const TIMEFRAMES = ["M1", "M5", "M15", "H1", "H4", "D1"];
const STRATEGIES = ["Scalping", "Swing", "Trend Following", "News Trading"];

const AddTradeForm = ({ onSuccess }) => {
  const { token } = useAuth();

  const [form, setForm] = useState({
    asset_class: "FX",
    symbol: "",
    direction: "BUY",
    tradeDate: new Date().toISOString().slice(0, 16),
    entryPrice: "",
    stopLoss: "",
    takeProfit: "",
    lotSize: "",
    timeframe: "H1",
    strategy: "Scalping",
    notes: "",
    riskPercent: "",
  });

  const [suggestedLot, setSuggestedLot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRiskCalc = async () => {
    try {
      setSuggestedLot(null);
      const res = await fetch("/api/trades/risk-calc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          balance: 10000, // مؤقتًا ثابت لحد ما نعمل Balance editable
          riskPercent: parseFloat(form.riskPercent),
          entryPrice: parseFloat(form.entryPrice),
          stopLoss: parseFloat(form.stopLoss),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Risk calc failed");
      setSuggestedLot(data.suggestedLot);
    } catch (e) {
      setErr(e.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setErr("");

    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          entryPrice: parseFloat(form.entryPrice),
          stopLoss: form.stopLoss ? parseFloat(form.stopLoss) : null,
          takeProfit: form.takeProfit ? parseFloat(form.takeProfit) : null,
          lotSize: form.lotSize ? parseFloat(form.lotSize) : suggestedLot,
          tradeDate: new Date(form.tradeDate).toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add trade");

      setForm({
        asset_class: "FX",
        symbol: "",
        direction: "BUY",
        tradeDate: new Date().toISOString().slice(0, 16),
        entryPrice: "",
        stopLoss: "",
        takeProfit: "",
        lotSize: "",
        timeframe: "H1",
        strategy: "Scalping",
        notes: "",
        riskPercent: "",
      });
      setSuggestedLot(null);

      if (onSuccess) onSuccess();
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card text-card-fore border border-border rounded-xl p-4 space-y-3"
    >
      <div className="font-semibold">Add New Trade</div>
      {err && <div className="text-sm text-red-500">{err}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          name="asset_class"
          value={form.asset_class}
          onChange={handleChange}
          className="p-2 border border-border rounded"
        >
          {Object.keys(SYMBOLS).map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <select
          name="symbol"
          value={form.symbol}
          onChange={handleChange}
          required
          className="p-2 border border-border rounded"
        >
          <option value="">Select Symbol</option>
          {SYMBOLS[form.asset_class].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          name="direction"
          value={form.direction}
          onChange={handleChange}
          className="p-2 border border-border rounded"
        >
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>

        <input
          type="datetime-local"
          name="tradeDate"
          value={form.tradeDate}
          onChange={handleChange}
          className="p-2 border border-border rounded"
        />

        <input
          type="number"
          step="0.0001"
          name="entryPrice"
          value={form.entryPrice}
          onChange={handleChange}
          placeholder="Entry Price"
          required
          className="p-2 border border-border rounded"
        />

        <input
          type="number"
          step="0.0001"
          name="stopLoss"
          value={form.stopLoss}
          onChange={handleChange}
          placeholder="Stop Loss"
          className="p-2 border border-border rounded"
        />

        <input
          type="number"
          step="0.0001"
          name="takeProfit"
          value={form.takeProfit}
          onChange={handleChange}
          placeholder="Take Profit"
          className="p-2 border border-border rounded"
        />

        <input
          type="number"
          step="0.01"
          name="lotSize"
          value={form.lotSize}
          onChange={handleChange}
          placeholder="Lot Size (leave empty to use suggested)"
          className="p-2 border border-border rounded"
        />

        <select
          name="timeframe"
          value={form.timeframe}
          onChange={handleChange}
          className="p-2 border border-border rounded"
        >
          {TIMEFRAMES.map((tf) => (
            <option key={tf} value={tf}>
              {tf}
            </option>
          ))}
        </select>

        <select
          name="strategy"
          value={form.strategy}
          onChange={handleChange}
          className="p-2 border border-border rounded"
        >
          {STRATEGIES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        <input
          type="number"
          step="0.1"
          name="riskPercent"
          value={form.riskPercent}
          onChange={handleChange}
          placeholder="Risk %"
          className="p-2 border border-border rounded"
        />

        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="p-2 border border-border rounded md:col-span-2"
        />
      </div>

      {form.riskPercent && form.entryPrice && form.stopLoss && (
        <button
          type="button"
          onClick={handleRiskCalc}
          className="px-3 py-1 bg-muted rounded"
        >
          Calculate Suggested Lot
        </button>
      )}

      {suggestedLot && (
        <div className="text-sm opacity-80">
          Suggested Lot: <b>{suggestedLot}</b>
        </div>
      )}

      <button
        type="submit"
        className="px-4 py-2 bg-primary text-white rounded-lg"
        disabled={loading}
      >
        {loading ? "Saving..." : "Add Trade"}
      </button>
    </form>
  );
};

export default AddTradeForm;
