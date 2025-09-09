/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";

const to5 = (v) => (v === null || v === undefined || v === "" ? "-" : Number(v).toFixed(5));

const TradesTable = () => {
  const { token } = useAuth();
  const [trades, setTrades] = useState([]);
  const [error, setError] = useState("");
  const [closingId, setClosingId] = useState(null);
  const [exitDraft, setExitDraft] = useState("");

  const fetchTrades = useCallback(async () => {
    if (!token) return;
    setError("");
    try {
      const res = await fetch("/api/trades", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch trades");
      // الأحدث يظهر فوق
      setTrades(data.sort((a, b) => b.id - a.id));
    } catch (e) {
      setError(e.message);
    }
  }, [token]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  // حدّث الجدول لما يحصل أي تغيير في الداتا
  useEffect(() => {
    const handler = () => fetchTrades();
    window.addEventListener("data-updated", handler);
    return () => window.removeEventListener("data-updated", handler);
  }, [fetchTrades]);

  const closeTrade = async (id) => {
    if (!exitDraft) return alert("Please enter Exit Price first.");
    try {
      const res = await fetch(`/api/trades/${id}/close`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ exitPrice: parseFloat(exitDraft) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to close trade");
      setClosingId(null);
      setExitDraft("");
      await fetchTrades();
      // بلّغ البالانس و الإحصائيات
      window.dispatchEvent(new Event("data-updated"));
    } catch (e) {
      alert(e.message);
    }
  };

  const deleteTrade = async (id) => {
    if (!window.confirm("Delete this trade?")) return;
    try {
      const res = await fetch(`/api/trades/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete trade");
      await fetchTrades();
      window.dispatchEvent(new Event("data-updated"));
    } catch (e) {
      alert(e.message);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded border">
      <div className="px-4 py-2 border-b font-semibold">Trades</div>
      <div className="max-h-96 overflow-y-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Symbol</th>
              <th className="p-2 text-left">Asset</th>
              <th className="p-2 text-left">Direction</th>
              <th className="p-2 text-left">Entry</th>
              <th className="p-2 text-left">Exit</th>
              <th className="p-2 text-left">SL</th>
              <th className="p-2 text-left">TP</th>
              <th className="p-2 text-left">Lot</th>
              <th className="p-2 text-left">Timeframe</th>
              <th className="p-2 text-left">Strategy</th>
              <th className="p-2 text-left">P/L</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{t.id}</td>
                <td className="p-2">{t.symbol}</td>
                <td className="p-2">{t.asset_class}</td>
                <td className="p-2">{t.direction}</td>
                <td className="p-2">{to5(t.entryPrice)}</td>
                <td className="p-2">{to5(t.exitPrice)}</td>
                <td className="p-2">{to5(t.stopLoss)}</td>
                <td className="p-2">{to5(t.takeProfit)}</td>
                <td className="p-2">{t.lotSize ? Number(t.lotSize).toFixed(2) : "-"}</td>
                <td className="p-2">{t.timeframe || "-"}</td>
                <td className="p-2">{t.strategy || "-"}</td>
                <td className={`p-2 font-semibold ${t.profitLoss > 0 ? "text-green-600" : t.profitLoss < 0 ? "text-red-600" : ""}`}>
                  {to5(t.profitLoss)}
                </td>
                <td className="p-2">{t.isClosed ? "Closed" : "Open"}</td>
                <td className="p-2">
                  {!t.isClosed ? (
                    <div className="flex items-center gap-2">
                      {closingId === t.id ? (
                        <>
                          <input
                            className="border rounded px-2 py-1 w-28"
                            placeholder="Exit Price"
                            value={exitDraft}
                            onChange={(e) => setExitDraft(e.target.value)}
                          />
                          <button
                            className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                            onClick={() => closeTrade(t.id)}
                          >
                            Confirm
                          </button>
                          <button
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                            onClick={() => {
                              setClosingId(null);
                              setExitDraft("");
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => setClosingId(t.id)}
                        >
                          Close
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                      onClick={() => deleteTrade(t.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {trades.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={14}>
                  No trades yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradesTable;
