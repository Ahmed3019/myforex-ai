/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useEffect, useState, useCallback } from "react";
import TradesTable from "../trades/TradesTable";
import { useAuth } from "../../context/AuthContext";

const TradesTab = () => {
  const { token } = useAuth();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

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

  // زر اختبار مؤقت لإضافة صفقة ديمو (نحذفه في Step 2 لما نعمل Add Trade Form)
  const addDemoTrade = async () => {
    if (!token) return;
    setLoading(true);
    setErr("");
    try {
      const body = {
        symbol: "EURUSD",
        asset_class: "FX",
        direction: "BUY",
        tradeDate: new Date().toISOString(),
        entryPrice: 1.1000,
        lotSize: 1,
        // اختياري:
        stopLoss: 1.0950,
        takeProfit: 1.1200,
        notes: "Demo trade for UI testing",
      };

      const res = await fetch("/api/trades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to add demo trade");
      }

      await fetchTrades(); // اعمل تحديث فورًا
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Trades</div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchTrades}
            className="px-3 py-2 rounded-lg bg-muted"
            disabled={loading}
            title="Refresh list"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
          <button
            onClick={addDemoTrade}
            className="px-3 py-2 rounded-lg bg-primary text-white"
            disabled={loading}
            title="Add a demo trade (temporary)"
          >
            + Add Demo
          </button>
        </div>
      </div>

      {err && (
        <div className="bg-card border border-border rounded-lg p-3 text-red-500 text-sm">
          {err}
        </div>
      )}

      <TradesTable
        trades={trades}
        // هنربط دول في خطوات لاحقة:
        onEdit={null}
        onClose={null}
        onDelete={null}
      />
    </div>
  );
};

export default TradesTab;
