/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useCallback, useEffect, useState } from "react";
import AddTradeForm from "../forms/AddTradeForm";
import TradesTable from "../tables/TradesTable";
import RiskCalculatorPanel from "../panels/RiskCalculatorPanel";
import { useAuth } from "../../context/AuthContext";

const TradesTab = () => {
  const { token } = useAuth();
  const [trades, setTrades] = useState([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/trades", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (res.ok) setTrades(data);
  }, [token]);

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  return (
    <div className="grid gap-4">
      <AddTradeForm onTradeAdded={load} />
      <RiskCalculatorPanel onSendToAddTrade={() => {}} />
      <div className="overflow-auto max-h-[60vh] border rounded">
        <TradesTable trades={trades} onChange={load} />
      </div>
    </div>
  );
};

export default TradesTab;
