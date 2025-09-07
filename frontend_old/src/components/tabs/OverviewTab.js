/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React from "react";

const Card = ({ title, value }) => (
  <div className="bg-card text-card-fore border border-border rounded-xl p-4">
    <div className="text-sm opacity-70">{title}</div>
    <div className="text-2xl font-semibold mt-1">{value}</div>
  </div>
);

const OverviewTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card title="Balance" value="$0.00" />
      <Card title="Equity" value="$0.00" />
      <Card title="Open Trades" value="0" />
      <Card title="Win Rate" value="0%" />
    </div>
  );
};

export default OverviewTab;
