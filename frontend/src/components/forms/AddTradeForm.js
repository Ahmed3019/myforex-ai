/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const field = "border rounded px-3 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500";
const label = "text-sm text-gray-600 mb-1";
const box   = "bg-white border rounded p-4";

export default function AddTradeForm({ onTradeAdded, prefill }) {
  const { token } = useAuth();

  const [pairs, setPairs] = useState(null);
  const [timeframes, setTimeframes] = useState([]);
  const [strategies, setStrategies] = useState([]);

  const [symbol, setSymbol] = useState(prefill?.symbol || "EURUSD");
  const [assetClass, setAssetClass] = useState(prefill?.asset_class || "FX");
  const [direction, setDirection] = useState("BUY");
  const [tradeDate, setTradeDate] = useState(new Date().toISOString().slice(0,16));
  const [entryPrice, setEntryPrice] = useState(prefill?.entryPrice ?? "");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [lotSize, setLotSize] = useState(prefill?.lotSize ?? "");
  const [timeframe, setTimeframe] = useState(prefill?.timeframe || "H1");
  const [strategy, setStrategy] = useState(prefill?.strategy || "Scalping");
  const [notes, setNotes] = useState("");

  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const [tfRes, stRes, prRes] = await Promise.all([
          fetch("/api/meta/timeframes"),
          fetch("/api/meta/strategies"),
          fetch("/api/meta/pairs")
        ]);
        const tf = await tfRes.json();
        const st = await stRes.json();
        const pr = await prRes.json();
        setTimeframes(tf.timeframes || []);
        setStrategies(st.strategies || []);
        setPairs(pr);
      } catch(e){ console.error(e); }
    };
    run();
  }, []);

  useEffect(() => {
    if (!prefill) return;
    if (prefill.symbol) setSymbol(prefill.symbol);
    if (prefill.asset_class) setAssetClass(prefill.asset_class);
    if (prefill.entryPrice !== undefined) setEntryPrice(prefill.entryPrice);
    if (prefill.lotSize !== undefined) setLotSize(prefill.lotSize);
    if (prefill.timeframe) setTimeframe(prefill.timeframe);
    if (prefill.strategy) setStrategy(prefill.strategy);
  }, [prefill]);

  const grouped = useMemo(() => pairs?.groups || {}, [pairs]);

  const onSubmit = async () => {
    setErr(""); setOk("");
    try {
      const body = {
        symbol, asset_class: assetClass, direction,
        tradeDate: new Date(tradeDate).toISOString(),
        entryPrice: Number(entryPrice),
        lotSize: Number(lotSize),
        stopLoss: stopLoss ? Number(stopLoss) : undefined,
        takeProfit: takeProfit ? Number(takeProfit) : undefined,
        timeframe, strategy, notes
      };

      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type":"application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create trade");

      setOk("Trade added.");
      if (onTradeAdded) onTradeAdded();
      setNotes("");
    } catch(e){
      setErr(e.message);
    }
  };

  const onEnter = (e) => {
    if (e.key === "Enter") onSubmit();
  };

  return (
    <div className={box} onKeyDown={onEnter}>
      <div className="font-semibold mb-3">Add Trade</div>

      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <div className={label}>Asset Class</div>
          <select className={field} value={assetClass} onChange={(e)=>setAssetClass(e.target.value)}>
            <option>FX</option>
            <option>Metals</option>
            <option>Energy</option>
            <option>Crypto</option>
          </select>
        </div>

        <div>
          <div className={label}>Symbol</div>
          <select className={field} value={symbol} onChange={(e)=>setSymbol(e.target.value)}>
            {renderGroupedOptions(grouped)}
          </select>
        </div>

        <div>
          <div className={label}>Direction</div>
          <select className={field} value={direction} onChange={(e)=>setDirection(e.target.value)}>
            <option>BUY</option>
            <option>SELL</option>
          </select>
        </div>

        <div>
          <div className={label}>Trade Date</div>
          <input type="datetime-local" className={field} value={tradeDate} onChange={(e)=>setTradeDate(e.target.value)} />
        </div>

        <div>
          <div className={label}>Entry Price</div>
          <input className={field} value={entryPrice} onChange={(e)=>setEntryPrice(e.target.value)} placeholder="1.10000" />
        </div>

        <div>
          <div className={label}>Lot Size</div>
          <input className={field} value={lotSize} onChange={(e)=>setLotSize(e.target.value)} placeholder="e.g. 1.00" />
        </div>

        <div>
          <div className={label}>Stop Loss</div>
          <input className={field} value={stopLoss} onChange={(e)=>setStopLoss(e.target.value)} placeholder="optional" />
        </div>

        <div>
          <div className={label}>Take Profit</div>
          <input className={field} value={takeProfit} onChange={(e)=>setTakeProfit(e.target.value)} placeholder="optional" />
        </div>

        <div>
          <div className={label}>Timeframe</div>
          <select className={field} value={timeframe} onChange={(e)=>setTimeframe(e.target.value)}>
            {timeframes.map((t)=> <option key={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <div className={label}>Strategy</div>
          <select className={field} value={strategy} onChange={(e)=>setStrategy(e.target.value)}>
            {strategies.map((s)=> <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="md:col-span-3">
          <div className={label}>Notes</div>
          <textarea className={field} rows={2} value={notes} onChange={(e)=>setNotes(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button onClick={onSubmit} className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700">Save Trade</button>
        {ok && <div className="text-emerald-600 self-center">{ok}</div>}
        {err && <div className="text-red-600 self-center">{err}</div>}
      </div>
    </div>
  );
}

function renderGroupedOptions(groups) {
  const blocks = [];
  if (groups?.FX) {
    blocks.push(group("FX — Majors", groups.FX.MAJORS));
    blocks.push(group("FX — Minors", groups.FX.MINORS));
    blocks.push(group("FX — Exotics", groups.FX.EXOTICS));
  }
  if (groups?.METALS) blocks.push(group("Metals", groups.METALS));
  if (groups?.ENERGY) blocks.push(group("Energy", groups.ENERGY));
  if (groups?.CRYPTO) blocks.push(group("Crypto", groups.CRYPTO));
  return blocks;
}
function group(title, arr){
  if (!arr || !arr.length) return null;
  return (
    <optgroup key={title} label={title}>
      {arr.map((x)=> <option key={x.symbol} value={x.symbol}>{x.symbol}</option>)}
    </optgroup>
  );
}
