/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const box = "bg-white border rounded p-4";

export default function BalancePanel() {
  const { token } = useAuth();
  const [balance, setBalance] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const load = async () => {
    try {
      const res = await fetch("/api/user/balance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch balance");
      setBalance(Number(data.balance));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if (token) load(); }, [token]);

  const save = async () => {
    try {
      const res = await fetch("/api/user/balance", {
        method: "PUT",
        headers: { "Content-Type":"application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ balance: Number(draft) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update balance");
      setBalance(Number(data.balance));
      setEditing(false);
    } catch (e) { alert(e.message); }
  };

  const onEnter = (e) => {
    if (e.key === "Enter") save();
  };

  return (
    <div className={box} onKeyDown={onEnter}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">Balance</div>
          <div className="text-2xl font-bold">${balance != null ? balance.toFixed(2) : "0.00"}</div>
        </div>
        {!editing ? (
          <button onClick={()=>{setDraft(balance?.toString()||"0"); setEditing(true);}} className="px-3 py-2 rounded bg-gray-800 text-white">Edit</button>
        ) : (
          <div className="flex gap-2 items-center">
            <input className="border rounded px-3 py-2" value={draft} onChange={(e)=>setDraft(e.target.value)} />
            <button onClick={save} className="px-3 py-2 rounded bg-emerald-600 text-white">Save</button>
            <button onClick={()=>setEditing(false)} className="px-3 py-2 rounded bg-gray-200">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
