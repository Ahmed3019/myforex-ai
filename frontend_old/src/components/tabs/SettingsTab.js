/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React from "react";
import { useSettings } from "../../context/SettingsContext";

const timezones = [
  "Africa/Cairo",
  "UTC",
  "Europe/London",
  "America/New_York",
  "Asia/Dubai",
];

const leverages = [50, 100, 200, 500];

const SettingsTab = () => {
  const { settings, updateSettings, toggleTheme } = useSettings();

  return (
    <div className="bg-card text-card-fore border border-border rounded-xl p-4 max-w-2xl">
      <div className="font-semibold mb-4">Settings</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Theme */}
        <div className="flex items-center justify-between border border-border rounded-lg p-3">
          <div>
            <div className="text-sm opacity-70">Theme</div>
            <div className="font-medium">{settings.theme.toUpperCase()}</div>
          </div>
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-lg bg-primary text-white"
          >
            Toggle
          </button>
        </div>

        {/* Timezone */}
        <div className="border border-border rounded-lg p-3">
          <div className="text-sm opacity-70 mb-1">Timezone</div>
          <select
            value={settings.timezone}
            onChange={(e) => updateSettings({ timezone: e.target.value })}
            className="w-full bg-base border border-border rounded-lg p-2"
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        {/* Leverage */}
        <div className="border border-border rounded-lg p-3">
          <div className="text-sm opacity-70 mb-1">Default Leverage</div>
          <select
            value={settings.defaultLeverage}
            onChange={(e) =>
              updateSettings({ defaultLeverage: Number(e.target.value) })
            }
            className="w-full bg-base border border-border rounded-lg p-2"
          >
            {leverages.map((lev) => (
              <option key={lev} value={lev}>
                1:{lev}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 text-xs opacity-70">
        Settings are persisted locally (localStorage). Backend sync will be added later.
      </div>
    </div>
  );
};

export default SettingsTab;
