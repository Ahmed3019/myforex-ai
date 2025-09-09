/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

import OverviewTab from "../components/tabs/OverviewTab";
import TradesTab from "../components/tabs/TradesTab";
import ChartsTab from "../components/tabs/ChartsTab";
import NewsTab from "../components/tabs/NewsTab";
import SettingsTab from "../components/tabs/SettingsTab";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initial = searchParams.get("tab") || "overview";

  const [activeTab, setActiveTab] = useState(initial);

  useEffect(() => {
    const q = searchParams.get("tab");
    if (q && q !== activeTab) setActiveTab(q);
    // eslint-disable-next-line
  }, [searchParams]);

  const onChangeTab = (tab) => {
    setActiveTab(tab);
    navigate(`/dashboard?tab=${tab}`, { replace: true });
  };

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "trades":
        return <TradesTab />;
      case "charts":
        return <ChartsTab />;
      case "news":
        return <NewsTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="flex h-screen bg-base">
      <Sidebar activeTab={activeTab} setActiveTab={onChangeTab} />
      <div className="flex flex-col flex-1">
        <Topbar title={activeTab.toUpperCase()} />
        <main className="flex-1 p-4 overflow-y-auto">{renderTab()}</main>
      </div>
    </div>
  );
};

export default Dashboard;
