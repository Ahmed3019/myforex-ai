/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import { useNavigate } from "react-router-dom";

const Topbar = ({ title }) => {
  const { settings } = useSettings();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-card text-card-fore border-b border-border px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="text-sm opacity-80">
          TZ: {settings.timezone} · Lev: 1:{settings.defaultLeverage}
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white rounded-lg"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
