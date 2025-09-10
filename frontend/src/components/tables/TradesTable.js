/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const toNum = (v, d = null) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

const fmt5 = (v) => (v == null ? "-" : Number(v).toFixed(5));
const fmt2 = (v) => (v == null ? "-" : Number(v).toFixed(2));

const TradesTable = ({ trades = [], onChange }) => {
  const { token } = useAuth();
  const [closingId, setClosingId] = useState(null);
  const [exitDraft, setExitDraft] = useState("");

  const rows = useMemo(() => {
    // الأحدث أولاً
    return [...trades].sort((a, b) => (a.id > b.id ? -1 : 1));
  }, [trades]);

  const closeTrade = async (id) => {
    if (!exitDraft) return;
    try {
      setClosingId(id);
      const res = await fetch(`/api/trades/${id}/close`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exitPrice: Number(exitDraft) }),
      });
      const data = await res.json();
      setClosingId(null);
      setExitDraft("");
      if (res.ok) {
        onChange && onChange();
      } else {
        console.error(data?.message || "Failed to close trade");
      }
    } catch (e) {
      setClosingId(null);
    }
  };

  const deleteTrade = async (id) => {
    try {
      const res = await fetch(`/api/trades/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        onChange && onChange();
      } else {
        console.error(data?.message || "Failed to delete");
      }
    } catch (e) {
      // ignore
    }
  };

  const onExitKey = (e, id) => {
    if (e.key === "Enter") closeTrade(id);
    if (e.key === "Escape") {
      setClosingId(null);
      setExitDraft("");
    }
  };

  return (
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 sticky top-0 z-10">
        <tr className="text-left">
          <th className="px-3 py-2">ID</th>
          <th className="px-3 py-2">Symbol</th>
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
        {rows.map((t) => {
          const entry = toNum(t.entryPrice);
          const exit = toNum(t.exitPrice);
          const sl = toNum(t.stopLoss);
          const tp = toNum(t.takeProfit);
          const lot = toNum(t.lotSize);
          const pl = toNum(t.profitLoss);

          return (
            <tr key={t.id} className="border-b last:border-none hover:bg-gray-50">
              <td className="px-3 py-2">{t.id}</td>
              <td className="px-3 py-2">{t.symbol}</td>
              <td className="px-3 py-2">{t.asset_class}</td>
              <td className="px-3 py-2">{t.direction}</td>
              <td className="px-3 py-2 font-mono">{fmt5(entry)}</td>
              <td className="px-3 py-2 font-mono">
                {t.isClosed ? (
                  fmt5(exit)
                ) : closingId === t.id ? (
                  <input
                    autoFocus
                    className="w-28 border rounded px-2 py-1 font-mono"
                    value={exitDraft}
                    onChange={(e) => setExitDraft(e.target.value)}
                    onKeyDown={(e) => onExitKey(e, t.id)}
                    placeholder="Exit price"
                  />
                ) : (
                  "-"
                )}
              </td>
              <td className="px-3 py-2 font-mono">{fmt5(sl)}</td>
              <td className="px-3 py-2 font-mono">{fmt5(tp)}</td>
              <td className="px-3 py-2 font-mono">{fmt2(lot)}</td>
              <td className="px-3 py-2">{t.timeframe || "-"}</td>
              <td className="px-3 py-2">{t.strategy || "-"}</td>
              <td
                className={`px-3 py-2 font-mono ${
                  pl > 0 ? "text-green-600" : pl < 0 ? "text-red-600" : ""
                }`}
              >
                {t.isClosed ? fmt5(pl) : "-"}
              </td>
              <td className="px-3 py-2">{t.isClosed ? "Closed" : "Open"}</td>
              <td className="px-3 py-2 space-x-2">
                {!t.isClosed && closingId !== t.id && (
                  <button
                    className="px-2 py-1 text-white bg-blue-600 rounded"
                    onClick={() => {
                      setClosingId(t.id);
                      setExitDraft("");
                    }}
                  >
                    Close
                  </button>
                )}
                {closingId === t.id && (
                  <button
                    className="px-2 py-1 text-white bg-green-600 rounded"
                    onClick={() => closeTrade(t.id)}
                    disabled={!exitDraft}
                  >
                    Save
                  </button>
                )}
                <button
                  className="px-2 py-1 text-white bg-red-600 rounded"
                  onClick={() => deleteTrade(t.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
        {rows.length === 0 && (
          <tr>
            <td className="px-3 py-6 text-gray-500" colSpan={14}>
              No trades yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TradesTable;
