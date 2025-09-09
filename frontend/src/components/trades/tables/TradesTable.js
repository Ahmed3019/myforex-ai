/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const TradesTable = ({ onChanged }) => {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/trades", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch trades");
      setRows(data);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => { if (token) load(); }, [token]);

  async function closeTrade(id) {
    const exit = prompt("Exit price?");
    if (!exit) return;
    try {
      const res = await fetch(`/api/trades/${id}/close`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ exitPrice: Number(exit) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to close");
      await load();
      onChanged && onChanged(data); // لتحديث البالانس والستاتس بالخارج لو محتاج
    } catch (e) {
      alert(e.message);
    }
  }

  async function delTrade(id) {
    if (!confirm("Delete trade?")) return;
    try {
      const res = await fetch(`/api/trades/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      await load();
      onChanged && onChanged();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="bg-white border rounded">
      <div className="p-3 font-semibold">Trades</div>
      {err && <div className="text-red-600 px-3 pb-2">{err}</div>}
      <div className="max-h-96 overflow-y-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Symbol</th>
              <th className="px-3 py-2">Asset</th>
              <th className="px-3 py-2">Direction</th>
              <th className="px-3 py-2">Entry</th>
              <th className="px-3 py-2">Exit</th>
              <th className="px-3 py-2">SL</th>
              <th className="px-3 py-2">TP</th>
              <th className="px-3 py-2">Lot</th>
              <th className="px-3 py-2">Timeframe</th>
              <th className="px-3 py-2">Strategy</th>
              <th className="px-3 py-2">P/L</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">{r.id}</td>
                <td className="px-3 py-2">{r.symbol}</td>
                <td className="px-3 py-2">{r.asset_class}</td>
                <td className="px-3 py-2">{r.direction}</td>
                <td className="px-3 py-2">{Number(r.entryPrice).toFixed(5)}</td>
                <td className="px-3 py-2">{r.exitPrice != null ? Number(r.exitPrice).toFixed(5) : "-"}</td>
                <td className="px-3 py-2">{r.stopLoss != null ? Number(r.stopLoss).toFixed(5) : "-"}</td>
                <td className="px-3 py-2">{r.takeProfit != null ? Number(r.takeProfit).toFixed(5) : "-"}</td>
                <td className="px-3 py-2">{Number(r.lotSize).toFixed(2)}</td>
                <td className="px-3 py-2">{r.timeframe || "-"}</td>
                <td className="px-3 py-2">{r.strategy || "-"}</td>
                <td className={`px-3 py-2 ${r.profitLoss > 0 ? "text-green-600" : r.profitLoss < 0 ? "text-red-600" : ""}`}>
                  {r.profitLoss != null ? Number(r.profitLoss).toFixed(5) : "-"}
                </td>
                <td className="px-3 py-2">{r.isClosed ? "Closed" : "Open"}</td>
                <td className="px-3 py-2 space-x-2">
                  {!r.isClosed && (
                    <button onClick={() => closeTrade(r.id)} className="px-2 py-1 bg-blue-600 text-white rounded">Close</button>
                  )}
                  <button onClick={() => delTrade(r.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={14} className="px-3 py-6 text-center text-gray-500">No trades yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradesTable;
