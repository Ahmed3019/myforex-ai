import React from "react";
import StatsPanel from "../dashboard/StatsPanel";
import BalancePanel from "../dashboard/BalancePanel";
import RiskCalculator from "../panels/RiskCalculator";

const OverviewTab = () => {
  return (
    <div className="grid gap-4">
      <StatsPanel />
      <BalancePanel />
      <RiskCalculator />
    </div>
  );
};

export default OverviewTab;
