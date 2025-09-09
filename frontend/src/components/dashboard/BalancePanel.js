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
  const [edit, setEdit] = useState(false);
  const [input, setInput] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/user/balance", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch balance");
      setBalance(Number(data.balance));
    } catch (e) { setErr(e.message); }
  }

  useEffect(() => { if (token) load(); }, [token]);

  async function save() {
    try {
      const res = await fetch("/api/user/balance", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ balance: Number(input) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update balance");
      setBalance(Number(data.balance));
      setEdit(false);
    } catch (e) { setErr(e.message); }
  }

  return (
    <div className="p-4 bg-white border rounded flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">Balance</div>
        <div className="text-2xl font-bold">${Number(balance).toFixed(2)}</div>
      </div>
      <div>
        {edit ? (
          <div className="flex items-center gap-2">
            <input type="number" step="0.01" className="border rounded p-2" value={input} onChange={(e)=>setInput(e.target.value)} placeholder={balance}/>
            <button onClick={save} className="px-3 py-2 bg-green-600 text-white rounded">Save</button>
            <button onClick={()=>setEdit(false)} className="px-3 py-2 bg-gray-300 rounded">Cancel</button>
          </div>
        ) : (
          <button onClick={()=>{setInput(String(balance)); setEdit(true);}} className="px-3 py-2 bg-blue-600 text-white rounded">Edit</button>
        )}
      </div>
      {err && <div className="text-red-600 text-sm mt-2">{err}</div>}
    </div>
  );
};

export default BalancePanel;
