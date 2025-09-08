/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useEffect, useState, useCallback } from "react";
import TradesTable from "../trades/TradesTable";
import AddTradeForm from "../trades/AddTradeForm";
import EditTradeModal from "../trades/EditTradeModal";
import CloseTradeModal from "../trades/CloseTradeModal";
import { useAuth } from "../../context/AuthContext";

const TradesTab = () => {
  const { token } = useAuth();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [editTrade, setEditTrade] = useState(null);
  const [closeTrade, setCloseTrade] = useState(null);

  const fetchTrades = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/trades", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to load trades");
      }
      const data = await res.json();
      setTrades(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  const handleDelete = async (trade) => {
    if (!window.confirm("Delete this trade?")) return;
    try {
      await fetch(`/api/trades/${trade.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTrades();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-4">
      <AddTradeForm onSuccess={fetchTrades} />

      <div className="flex items-center justify-between">
        <div className="font-semibold">Trades</div>
        <button
          onClick={fetchTrades}
          className="px-3 py-2 rounded-lg bg-muted"
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {err && (
        <div className="bg-card border border-border rounded-lg p-3 text-red-500 text-sm">
          {err}
        </div>
      )}

      <TradesTable
        trades={trades}
        onEdit={setEditTrade}
        onClose={setCloseTrade}
        onDelete={handleDelete}
      />

      {editTrade && (
        <EditTradeModal
          trade={editTrade}
          onClose={() => setEditTrade(null)}
          onSaved={() => {
            setEditTrade(null);
            fetchTrades();
          }}
        />
      )}

      {closeTrade && (
        <CloseTradeModal
          trade={closeTrade}
          onClose={() => setCloseTrade(null)}
          onSaved={() => {
            setCloseTrade(null);
            fetchTrades();
          }}
        />
      )}
    </div>
  );
};

export default TradesTab;
