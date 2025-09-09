/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AddTradeForm from "../forms/AddTradeForm";
import RiskCalculatorPanel from "../panels/RiskCalculatorPanel";

const box = "bg-white border rounded p-4";
const th  = "px-3 py-2 text-left text-xs font-semibold text-gray-500";
const td  = "px-3 py-2 text-sm";

export default function TradesTab() {
  const { token } = useAuth();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prefill, setPrefill] = useState(null);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/trades", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch trades");
      setTrades(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) load(); }, [token]);

  const closeTrade = async (id) => {
    const exit = prompt("Exit price?");
    if (!exit) return;
    try {
      const res = await fetch(`/api/trades/${id}/close`, {
        method: "PUT",
        headers: { "Content-Type":"application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ exitPrice: Number(exit) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to close trade");
      await load();
    } catch (e) { alert(e.message); }
  };

  const delTrade = async (id) => {
    if (!window.confirm("Delete trade?")) return;
    try {
      const res = await fetch(`/api/trades/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete trade");
      await load();
    } catch (e) { alert(e.message); }
  };

  return (
    <div className="grid gap-4">
      <RiskCalculatorPanel onSendToAddTrade={(payload) => setPrefill(payload)} />

      <AddTradeForm prefill={prefill} onTradeAdded={load} />

      <div className={box}>
        <div className="font-semibold mb-3">Trades</div>
        {err && <div className="text-red-600">{err}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="overflow-auto max-h-[55vh]">
            <table className="min-w-full">
              <thead className="sticky top-0 bg-gray-50">
                <tr>
                  <th className={th}>ID</th>
                  <th className={th}>Symbol</th>
                  <th className={th}>Asset</th>
                  <th className={th}>Direction</th>
                  <th className={th}>Entry</th>
                  <th className={th}>Exit</th>
                  <th className={th}>SL</th>
                  <th className={th}>TP</th>
                  <th className={th}>Lot</th>
                  <th className={th}>Timeframe</th>
                  <th className={th}>Strategy</th>
                  <th className={th}>P/L</th>
                  <th className={th}>Status</th>
                  <th className={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className={td}>{t.id}</td>
                    <td className={td}>{t.symbol}</td>
                    <td className={td}>{t.asset_class}</td>
                    <td className={td}>{t.direction}</td>
                    <td className={td}>{number5(t.entryPrice)}</td>
                    <td className={td}>{t.exitPrice != null ? number5(t.exitPrice) : "-"}</td>
                    <td className={td}>{t.stopLoss != null ? number5(t.stopLoss) : "-"}</td>
                    <td className={td}>{t.takeProfit != null ? number5(t.takeProfit) : "-"}</td>
                    <td className={td}>{t.lotSize}</td>
                    <td className={td}>{t.timeframe || "-"}</td>
                    <td className={td}>{t.strategy || "-"}</td>
                    <td className={td}>{t.profitLoss != null ? number5(t.profitLoss) : "-"}</td>
                    <td className={td}>{t.isClosed ? "Closed" : "Open"}</td>
                    <td className={td}>
                      {!t.isClosed && (
                        <button onClick={() => closeTrade(t.id)} className="px-2 py-1 text-sm rounded bg-blue-600 text-white mr-2">Close</button>
                      )}
                      <button onClick={() => delTrade(t.id)} className="px-2 py-1 text-sm rounded bg-red-600 text-white">Delete</button>
                    </td>
                  </tr>
                ))}
                {!trades.length && (
                  <tr><td className="px-3 py-8 text-center text-gray-400" colSpan={14}>No trades yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function number5(v) {
  if (v === null || v === undefined) return "-";
  const n = typeof v === "string" ? Number(v) : v;
  if (Number.isNaN(n)) return "-";
  return n.toFixed(5);
}
