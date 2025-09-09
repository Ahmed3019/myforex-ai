/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmed-salama1/
 */

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const BalancePanel = () => {
  const { token } = useAuth();
  const [balance, setBalance] = useState(0);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");

  const load = async () => {
    const res = await fetch("/api/user/balance", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok && data.balance != null) {
      setBalance(Number(data.balance));
      setValue(Number(data.balance).toFixed(2));
    }
  };

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line
  }, [token]);

  const save = async () => {
    const res = await fetch("/api/user/balance", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ balance: Number(value) }),
    });
    const data = await res.json();
    if (res.ok && data.balance != null) {
      setBalance(Number(data.balance));
      setEditing(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    }
  };

  return (
    <div className="p-4 bg-white border rounded flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">Balance</div>
        <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
      </div>
      <div>
        {editing ? (
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              className="border rounded p-2"
            />
            <button onClick={save} className="px-3 py-2 rounded bg-primary text-white">Save</button>
            <button onClick={() => setEditing(false)} className="px-3 py-2 rounded border">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="px-3 py-2 rounded border">Edit</button>
        )}
      </div>
    </div>
  );
};

export default BalancePanel;
