/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React from "react";

const cell = "px-3 py-2 border-b border-border";
const head = "px-3 py-2 border-b border-border text-left text-sm opacity-70";

// نعرض الأرقام بدقة 5 خانات بعد العلامة العشرية
const fmtNum = (v) =>
  typeof v === "number" && !Number.isNaN(v) ? Number(v).toFixed(5) : v ?? "-";

const TradesTable = ({ trades = [], onEdit, onClose, onDelete }) => {
  if (!trades.length) {
    return (
      <div className="bg-card text-card-fore border border-border rounded-xl p-4">
        <div className="opacity-80">No trades yet.</div>
      </div>
    );
  }

  return (
    <div className="bg-card text-card-fore border border-border rounded-xl overflow-x-auto">
      <table className="w-full min-w-[1000px]">
        <thead className="bg-muted">
          <tr>
            <th className={head}>#</th>
            <th className={head}>Symbol</th>
            <th className={head}>Asset</th>
            <th className={head}>Direction</th>
            <th className={head}>Trade Date</th>
            <th className={head}>Entry</th>
            <th className={head}>SL</th>
            <th className={head}>TP</th>
            <th className={head}>Lot</th>
            <th className={head}>Timeframe</th>
            <th className={head}>Strategy</th>
            <th className={head}>Status</th>
            <th className={head}>P/L</th>
            <th className={head}>Notes</th>
            <th className={head}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t, idx) => {
            const status = t.isClosed ? "Closed" : "Open";
            const tradeDate = t.tradeDate
              ? new Date(t.tradeDate).toLocaleString()
              : "-";
            return (
              <tr key={t.id || idx} className="hover:bg-muted">
                <td className={cell}>{idx + 1}</td>
                <td className={cell}>{t.symbol}</td>
                <td className={cell}>{t.asset_class || "-"}</td>
                <td className={cell}>{t.direction}</td>
                <td className={cell}>{tradeDate}</td>
                <td className={cell}>{fmtNum(t.entryPrice)}</td>
                <td className={cell}>{fmtNum(t.stopLoss)}</td>
                <td className={cell}>{fmtNum(t.takeProfit)}</td>
                <td className={cell}>{fmtNum(t.lotSize)}</td>
                <td className={cell}>{t.timeframe || "-"}</td>
                <td className={cell}>{t.strategy || "-"}</td>
                <td className={cell}>{status}</td>
                <td className={cell}>{fmtNum(t.profitLoss)}</td>
                <td className={cell}>{t.notes || "-"}</td>
                <td className={`${cell} whitespace-nowrap`}>
                  <button
                    className="px-2 py-1 rounded bg-muted"
                    onClick={() => onEdit && onEdit(t)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="px-2 py-1 rounded bg-primary text-white"
                    onClick={() => onClose && onClose(t)}
                    disabled={t.isClosed}
                  >
                    Close
                  </button>{" "}
                  <button
                    className="px-2 py-1 rounded bg-red-500 text-white"
                    onClick={() => onDelete && onDelete(t)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TradesTable;
