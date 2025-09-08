/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const EditTradeModal = ({ trade, onClose, onSaved }) => {
  const { token } = useAuth();
  const [form, setForm] = useState({ ...trade });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    setForm({ ...trade });
  }, [trade]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trade || !token) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`/api/trades/${trade.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stopLoss: form.stopLoss ? parseFloat(form.stopLoss) : null,
          takeProfit: form.takeProfit ? parseFloat(form.takeProfit) : null,
          notes: form.notes,
          timeframe: form.timeframe,
          strategy: form.strategy,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      onSaved();
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!trade) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-card text-card-fore p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-lg font-bold">Edit Trade</h2>
        {err && <div className="text-red-500 text-sm">{err}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="number"
            step="0.0001"
            name="stopLoss"
            value={form.stopLoss || ""}
            onChange={handleChange}
            placeholder="Stop Loss"
            className="w-full p-2 border border-border rounded"
          />

          <input
            type="number"
            step="0.0001"
            name="takeProfit"
            value={form.takeProfit || ""}
            onChange={handleChange}
            placeholder="Take Profit"
            className="w-full p-2 border border-border rounded"
          />

          <select
            name="timeframe"
            value={form.timeframe || "H1"}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded"
          >
            <option value="M1">M1</option>
            <option value="M5">M5</option>
            <option value="M15">M15</option>
            <option value="H1">H1</option>
            <option value="H4">H4</option>
            <option value="D1">D1</option>
          </select>

          <select
            name="strategy"
            value={form.strategy || "Scalping"}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded"
          >
            <option value="Scalping">Scalping</option>
            <option value="Swing">Swing</option>
            <option value="Trend Following">Trend Following</option>
            <option value="News Trading">News Trading</option>
          </select>

          <textarea
            name="notes"
            value={form.notes || ""}
            onChange={handleChange}
            placeholder="Notes"
            className="w-full p-2 border border-border rounded"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-primary text-white"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTradeModal;
