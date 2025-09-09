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

export default function RiskCalculatorPanel({ onSendToAddTrade }) {
  const { token } = useAuth();

  const [symbol, setSymbol] = useState("EURUSD");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [riskPercent, setRiskPercent] = useState(1);
  const [lotSize, setLotSize] = useState("");
  const [quoteToUSDRate, setQuoteToUSDRate] = useState("");

  const [timeframes, setTimeframes] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [pairs, setPairs] = useState(null);

  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

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
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, []);

  const allSymbols = useMemo(() => {
    if (!pairs) return [];
    const arr = [];
    const pushGroup = (g) => g.forEach((x) => arr.push(x.symbol));
    if (pairs.groups?.FX?.MAJORS)  pushGroup(pairs.groups.FX.MAJORS);
    if (pairs.groups?.FX?.MINORS)  pushGroup(pairs.groups.FX.MINORS);
    if (pairs.groups?.FX?.EXOTICS) pushGroup(pairs.groups.FX.EXOTICS);
    if (pairs.groups?.METALS)      pushGroup(pairs.groups.METALS);
    if (pairs.groups?.ENERGY)      pushGroup(pairs.groups.ENERGY);
    if (pairs.groups?.CRYPTO)      pushGroup(pairs.groups.CRYPTO);
    return arr;
  }, [pairs]);

  const needsConversionHint = useMemo(() => {
    if (!symbol) return false;
    const base = symbol.slice(0,3), quote = symbol.slice(3);
    return !(quote === "USD" || base === "USD");
  }, [symbol]);

  const onCalc = async () => {
    setErr("");
    setResult(null);
    try {
      const body = {
        symbol,
        entryPrice: entryPrice ? Number(entryPrice) : undefined,
        stopLoss:   stopLoss   ? Number(stopLoss)   : undefined,
        takeProfit: takeProfit ? Number(takeProfit) : undefined,
        riskPercent: riskPercent ? Number(riskPercent) : undefined,
        lotSize: lotSize ? Number(lotSize) : undefined,
      };
      if (quoteToUSDRate) body.quoteToUSDRate = Number(quoteToUSDRate);

      const res = await fetch("/api/risk/calc", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Risk calc failed");
      setResult(data);
    } catch (e) {
      setErr(e.message);
    }
  };

  const onEnter = (e) => {
    if (e.key === "Enter") onCalc();
  };

  const sendToAddTrade = () => {
    if (!onSendToAddTrade) return;
    const lots = result?.suggestedLots ? Number(result.suggestedLots) : (lotSize ? Number(lotSize) : 0.01);
    onSendToAddTrade({
      symbol,
      asset_class: guessAsset(symbol),
      direction: "BUY",
      entryPrice: entryPrice ? Number(entryPrice) : undefined,
      lotSize: Number(lots.toFixed(2)),
      timeframe: timeframes?.[0] || "H1",
      strategy: strategies?.[0] || "Scalping",
    });
  };

  return (
    <div className={box}>
      <div className="font-semibold mb-3">Risk Calculator</div>

      <div className="grid md:grid-cols-3 gap-3" onKeyDown={onEnter}>
        <div>
          <div className={label}>Symbol</div>
          <select className={field} value={symbol} onChange={(e) => setSymbol(e.target.value)}>
            {allSymbols.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <div className={label}>Entry Price</div>
          <input className={field} value={entryPrice} onChange={(e)=>setEntryPrice(e.target.value)} placeholder="e.g. 1.1000" />
        </div>

        <div>
          <div className={label}>Stop Loss</div>
          <input className={field} value={stopLoss} onChange={(e)=>setStopLoss(e.target.value)} placeholder="e.g. 1.0950" />
        </div>

        <div>
          <div className={label}>Take Profit (optional)</div>
          <input className={field} value={takeProfit} onChange={(e)=>setTakeProfit(e.target.value)} placeholder="e.g. 1.1050" />
        </div>

        <div>
          <div className={label}>Risk %</div>
          <input className={field} value={riskPercent} onChange={(e)=>setRiskPercent(e.target.value)} placeholder="e.g. 1" />
        </div>

        <div>
          <div className={label}>Lot Size (optional)</div>
          <input className={field} value={lotSize} onChange={(e)=>setLotSize(e.target.value)} placeholder="auto from Risk%" />
        </div>

        {needsConversionHint && (
          <div className="md:col-span-3">
            <div className={label}>Quote→USD rate (for crosses)</div>
            <input className={field} value={quoteToUSDRate} onChange={(e)=>setQuoteToUSDRate(e.target.value)} placeholder="e.g. 1.27" />
            <div className="text-xs text-amber-600 mt-1">Cross pair detected. Provide quote→USD rate temporarily.</div>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <button onClick={onCalc} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Calculate</button>
        {result && (
          <button onClick={sendToAddTrade} className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700">
            Send to Add Trade
          </button>
        )}
      </div>

      {err && <div className="mt-3 text-red-600">{err}</div>}

      {result && (
        <div className="mt-4 grid md:grid-cols-3 gap-3">
          <div className="p-3 border rounded">
            <div className="text-xs text-gray-500">SL Pips</div>
            <div className="text-lg font-semibold">{fmt(result.slPips)}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-xs text-gray-500">TP Pips</div>
            <div className="text-lg font-semibold">{fmt(result.tpPips)}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-xs text-gray-500">Pip Value (USD, 1 Lot)</div>
            <div className="text-lg font-semibold">{fmt(result.pipValuePerLotUSD)}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-xs text-gray-500">Risk (USD)</div>
            <div className="text-lg font-semibold">{fmt(result.riskUSD)}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-xs text-gray-500">Suggested Lots</div>
            <div className="text-lg font-semibold">{result.suggestedLots ? Number(result.suggestedLots).toFixed(2) : "-"}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-xs text-gray-500">Required Margin (USD)</div>
            <div className="text-lg font-semibold">{fmt(result.marginUSD)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function fmt(v) {
  if (v === null || v === undefined || Number.isNaN(v)) return "-";
  return typeof v === "number" ? v.toFixed(5).replace(/\.?0+$/,"") : v;
}

function guessAsset(symbol) {
  const q = symbol.slice(3);
  if (["USD","EUR","GBP","JPY","AUD","NZD","CAD","CHF"].includes(q)) return "FX";
  if (symbol.startsWith("XAU")||symbol.startsWith("XAG")) return "Metals";
  if (symbol === "WTI" || symbol === "BRENT") return "Energy";
  return "FX";
}
