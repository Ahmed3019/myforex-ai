/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React from "react";
import BalancePanel from "../dashboard/BalancePanel";
import StatsPanel from "../dashboard/StatsPanel";
import RiskCalculator from "../panels/RiskCalculator";

const OverviewTab = () => {
  return (
    <div className="grid gap-4">
      <BalancePanel />
      <StatsPanel />
      <RiskCalculator />
    </div>
  );
};

export default OverviewTab;
