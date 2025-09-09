/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const BalancePanel = () => {
  const { token } = useAuth();
  const [balance, setBalance] = useState(0);
  const [editing, setEditing] = useState(false);
  const [newBalance, setNewBalance] = useState("");
  const [err, setErr] = useState("");

  const fetchBalance = async () => {
    try {
      const res = await fetch("/api/user/balance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch balance");
      setBalance(data.balance);
    } catch (e) {
      setErr(e.message);
    }
  };

  useEffect(() => {
    if (token) fetchBalance();
  }, [token]);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/user/balance", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ balance: parseFloat(newBalance) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update balance");
      setBalance(data.balance);
      setEditing(false);
      setNewBalance("");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="bg-card text-card-fore border border-border rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm opacity-70">Balance</div>
          <div className="text-2xl font-bold">${balance}</div>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              placeholder="New balance"
              className="p-2 border border-border rounded"
            />
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-primary text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1 bg-muted rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="px-3 py-1 bg-muted rounded"
          >
            Edit
          </button>
        )}
      </div>
      {err && <div className="text-sm text-red-500 mt-2">{err}</div>}
    </div>
  );
};

export default BalancePanel;
