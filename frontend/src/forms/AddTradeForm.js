/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const SYMBOL_GROUPS = {
  FX: ["EURUSD","GBPUSD","AUDUSD","NZDUSD","USDJPY","EURJPY","GBPJPY","USDCHF","USDCAD"],
  Metals: ["XAUUSD","XAGUSD"],
  Energy: ["WTI"],
  Crypto: ["BTCUSD","ETHUSD"],
};

const TIMEFRAMES = ["M1","M5","M15","M30","H1","H4","D1","W1"];
const STRATEGIES = ["Scalping","Breakout","Pullback","Trend Following","Mean Reversion"];

const AddTradeForm = ({ onAdded }) => {
  const { token } = useAuth();
  const [assetClass, setAssetClass] = useState("FX");
  const [symbol, setSymbol] = useState("EURUSD");
  const [direction, setDirection] = useState("BUY");
  const [tradeDate, setTradeDate] = useState(new Date().toISOString().slice(0,16));
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [lotSize, setLotSize] = useState("1");
  const [timeframe, setTimeframe] = useState("H1");
  const [strategy, setStrategy] = useState("Scalping");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          symbol,
          asset_class: assetClass,
          direction,
          tradeDate: new Date(tradeDate).toISOString(),
          entryPrice: Number(entryPrice),
          stopLoss: stopLoss ? Number(stopLoss) : null,
          takeProfit: takeProfit ? Number(takeProfit) : null,
          lotSize: Number(lotSize),
          timeframe,
          strategy,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create trade");
      onAdded && onAdded(data);
      // reset quick
      setEntryPrice(""); setStopLoss(""); setTakeProfit(""); setNotes("");
    } catch (e2) {
      setErr(e2.message);
    }
  };

  return (
    <form onSubmit={submit} className="p-4 bg-white border rounded grid grid-cols-1 md:grid-cols-4 gap-3">
      {err && <div className="md:col-span-4 text-red-600">{err}</div>}

      <div>
        <label className="text-sm">Asset</label>
        <select value={assetClass} onChange={(e)=>{setAssetClass(e.target.value); setSymbol(SYMBOL_GROUPS[e.target.value][0]);}} className="w-full border rounded p-2">
          {Object.keys(SYMBOL_GROUPS).map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm">Symbol</label>
        <select value={symbol} onChange={(e)=>setSymbol(e.target.value)} className="w-full border rounded p-2">
          {SYMBOL_GROUPS[assetClass].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm">Direction</label>
        <select value={direction} onChange={(e)=>setDirection(e.target.value)} className="w-full border rounded p-2">
          <option>BUY</option>
          <option>SELL</option>
        </select>
      </div>

      <div>
        <label className="text-sm">Trade Date</label>
        <input type="datetime-local" value={tradeDate} onChange={(e)=>setTradeDate(e.target.value)} className="w-full border rounded p-2"/>
      </div>

      <div>
        <label className="text-sm">Entry</label>
        <input type="number" step="0.00001" value={entryPrice} onChange={(e)=>setEntryPrice(e.target.value)} className="w-full border rounded p-2"/>
      </div>

      <div>
        <label className="text-sm">SL</label>
        <input type="number" step="0.00001" value={stopLoss} onChange={(e)=>setStopLoss(e.target.value)} className="w-full border rounded p-2"/>
      </div>

      <div>
        <label className="text-sm">TP</label>
        <input type="number" step="0.00001" value={takeProfit} onChange={(e)=>setTakeProfit(e.target.value)} className="w-full border rounded p-2"/>
      </div>

      <div>
        <label className="text-sm">Lot</label>
        <input type="number" step="0.01" value={lotSize} onChange={(e)=>setLotSize(e.target.value)} className="w-full border rounded p-2"/>
      </div>

      <div>
        <label className="text-sm">Timeframe</label>
        <select value={timeframe} onChange={(e)=>setTimeframe(e.target.value)} className="w-full border rounded p-2">
          {TIMEFRAMES.map(tf => <option key={tf}>{tf}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm">Strategy</label>
        <select value={strategy} onChange={(e)=>setStrategy(e.target.value)} className="w-full border rounded p-2">
          {STRATEGIES.map(st => <option key={st}>{st}</option>)}
        </select>
      </div>

      <div className="md:col-span-3">
        <label className="text-sm">Notes</label>
        <input value={notes} onChange={(e)=>setNotes(e.target.value)} className="w-full border rounded p-2"/>
      </div>

      <div className="md:col-span-4">
        <button className="px-4 py-2 rounded bg-blue-600 text-white">Add Trade</button>
      </div>
    </form>
  );
};

export default AddTradeForm;
