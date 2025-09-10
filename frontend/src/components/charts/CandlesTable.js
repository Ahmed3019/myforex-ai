/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React from "react";

const fmt = (n, d = 5) => (n == null ? "-" : Number(n).toFixed(d));

const CandlesTable = ({ candles }) => {
  if (!candles || candles.length === 0) return <div>No data</div>;
  return (
    <div className="bg-white rounded border overflow-auto" style={{ maxHeight: 360 }}>
      <table className="min-w-full text-sm">
        <thead className="sticky top-0 bg-gray-100">
          <tr>
            <th className="text-left px-3 py-2">Time</th>
            <th className="text-right px-3 py-2">Open</th>
            <th className="text-right px-3 py-2">High</th>
            <th className="text-right px-3 py-2">Low</th>
            <th className="text-right px-3 py-2">Close</th>
            <th className="text-right px-3 py-2">Volume</th>
          </tr>
        </thead>
        <tbody>
          {candles.map((c, i) => (
            <tr key={i} className="border-t">
              <td className="px-3 py-2">{new Date(c.time).toLocaleString()}</td>
              <td className="text-right px-3 py-2">{fmt(c.open)}</td>
              <td className="text-right px-3 py-2">{fmt(c.high)}</td>
              <td className="text-right px-3 py-2">{fmt(c.low)}</td>
              <td className="text-right px-3 py-2">{fmt(c.close)}</td>
              <td className="text-right px-3 py-2">{c.volume ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandlesTable;
