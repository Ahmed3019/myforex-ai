/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const CloseTradeModal = ({ trade, onClose, onSaved }) => {
  const { token } = useAuth();
  const [exitPrice, setExitPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trade || !token) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`/api/trades/${trade.id}/close`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ exitPrice: parseFloat(exitPrice) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Close failed");
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
        <h2 className="text-lg font-bold">Close Trade</h2>
        {err && <div className="text-red-500 text-sm">{err}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="number"
            step="0.0001"
            value={exitPrice}
            onChange={(e) => setExitPrice(e.target.value)}
            placeholder="Exit Price"
            required
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
              className="px-3 py-1 rounded bg-red-500 text-white"
              disabled={loading}
            >
              {loading ? "Closing..." : "Close"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CloseTradeModal;
