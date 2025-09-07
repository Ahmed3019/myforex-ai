/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React from "react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "trades", label: "Trades" },
    { id: "charts", label: "Charts" },
    { id: "news", label: "News" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-card text-card-fore shadow-lg flex flex-col border-r border-border">
      <div className="p-4 text-xl font-bold border-b border-border">MyForexAI</div>
      <nav className="flex-1 p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-4 py-2 rounded-lg mb-2 transition ${
              activeTab === tab.id
                ? "bg-primary text-white"
                : "hover:bg-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
