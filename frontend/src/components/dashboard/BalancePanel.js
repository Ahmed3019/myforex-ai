/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const BalancePanel = () => {
  const { token } = useAuth();
  const [balance, setBalance] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/user/balance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load balance");
      setBalance(parseFloat(data.balance));
      setDraft(String(data.balance));
    } catch (e) {
      // silent
    }
  }, [token]);

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  const save = async () => {
    try {
      const res = await fetch("/api/user/balance", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ balance: parseFloat(draft) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");
      setBalance(parseFloat(data.balance));
      setEditing(false);
    } catch (e) {
      // silent
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") {
      setEditing(false);
      setDraft(String(balance ?? ""));
    }
  };

  return (
    <div className="p-4 bg-white rounded border">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">Balance</div>
        {!editing ? (
          <button className="text-blue-600 underline" onClick={() => setEditing(true)}>
            Edit
          </button>
        ) : (
          <div className="space-x-2">
            <button className="text-green-600 underline" onClick={save}>Save</button>
            <button className="text-gray-600 underline" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        )}
      </div>

      {!editing ? (
        <div className="text-2xl font-bold mt-2">${(balance ?? 0).toFixed(2)}</div>
      ) : (
        <input
          autoFocus
          className="mt-2 w-full border rounded px-3 py-2"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
        />
      )}
    </div>
  );
};

export default BalancePanel;
