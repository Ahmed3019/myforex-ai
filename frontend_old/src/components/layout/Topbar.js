/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React from "react";
import { useSettings } from "../../context/SettingsContext";

const Topbar = ({ title }) => {
  const { settings } = useSettings();

  return (
    <header className="bg-card text-card-fore border-b border-border px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="text-sm opacity-80">
        TZ: {settings.timezone} · Lev: 1:{settings.defaultLeverage}
      </div>
    </header>
  );
};

export default Topbar;
