/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const StatsPanel = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/trades/stats/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch stats");
      setStats(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (token) fetchStats();
  }, [token]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return <div>Loading stats...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-white rounded border">
      <div className="text-center">
        <div className="text-sm text-gray-500">Total Trades</div>
        <div className="text-xl font-bold">{stats.totalTrades}</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-500">Open Trades</div>
        <div className="text-xl font-bold">{stats.openTrades}</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-500">Closed Trades</div>
        <div className="text-xl font-bold">{stats.closedTrades}</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-500">Total Profit</div>
        <div className={`text-xl font-bold ${stats.totalProfit > 0 ? "text-green-600" : stats.totalProfit < 0 ? "text-red-600" : ""}`}>
          {Number(stats.totalProfit).toFixed(5)}
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-500">Win Rate</div>
        <div className="text-xl font-bold">{Number(stats.winRate).toFixed(2)}%</div>
      </div>
    </div>
  );
};

export default StatsPanel;
