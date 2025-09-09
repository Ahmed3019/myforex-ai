/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTradeDraft } from "../../context/TradeDraftContext";
import {
  SYMBOL_SPECS,
  GROUPS,
  getSpec,
  pipValuePerLotUSD,
  calcPips,
  suggestLotSize,
  rrTargets,
} from "../../utils/calc";

const RiskCalculator = () => {
  const { token } = useAuth();
  const { setDraft } = useTradeDraft();
  const navigate = useNavigate();

  const [balance, setBalance] = useState(100.0);
  const [group, setGroup] = useState("FX_Majors");
  const [symbol, setSymbol] = useState(GROUPS.FX_Majors[0]);
  const [direction, setDirection] = useState("BUY");

  const [entry, setEntry] = useState("");
  const [sl, setSL] = useState("");
  const [riskPercent, setRiskPercent] = useState("1");
  const [rr, setRR] = useState("2");

  const [usePipsMode, setUsePipsMode] = useState(false);
  const [slPips, setSlPips] = useState("");

  const spec = useMemo(() => getSpec(symbol), [symbol]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/user/balance", { headers: { Authorization: `Bearer ${token}` }});
        const data = await res.json();
        if (res.ok && data.balance != null) setBalance(Number(data.balance));
      } catch {}
    })();
  }, [token]);

  useEffect(() => {
    if (!usePipsMode) return;
    const e = Number(entry);
    const p = Number(slPips);
    if (!e || !p) return;
    const pipSize = spec.pipSize;
    const priceDelta = p * pipSize;
    const slPrice = direction === "BUY" ? e - priceDelta : e + priceDelta;
    setSL(slPrice ? slPrice.toFixed(5) : "");
  }, [usePipsMode, slPips, entry, direction, spec.pipSize]);

  const pipVal = pipValuePerLotUSD(symbol, entry || 1);
  const pips = entry && sl ? calcPips(symbol, entry, sl) : 0;

  const suggest = suggestLotSize({
    symbol,
    entry,
    sl,
    balance,
    riskPercent,
  });

  const lot = suggest.lot || 0;
  const riskAmount = suggest.riskAmount || 0;
  const { tp } = rrTargets({ direction, entry, sl, rr: Number(rr) });

  const sendToAddTrade = () => {
    const draft = {
      symbol,
      asset_class: spec.asset,
      direction,
      tradeDate: new Date().toISOString(),
      entryPrice: entry ? Number(entry) : null,
      stopLoss: sl ? Number(sl) : null,
      takeProfit: tp ? Number(tp) : null,
      lotSize: lot ? Number(lot.toFixed(2)) : null,
      timeframe: "",
      strategy: "",
      notes: `Risk ${riskPercent}% • R:R ${rr} • ${pips.toFixed(2)} pips • pipVal $${pipVal.toFixed(6)}`,
    };
    setDraft(draft);
    navigate("/dashboard?tab=trades");
  };

  const allGroups = Object.keys(GROUPS);

  return (
    <div className="p-4 bg-white border rounded">
      <div className="mb-3 font-semibold">Risk Calculator</div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="text-sm">Group</label>
          <select
            value={group}
            onChange={(e) => {
              const g = e.target.value;
              setGroup(g);
              const first = GROUPS[g][0];
              setSymbol(first);
            }}
            className="w-full border rounded p-2"
          >
            {allGroups.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm">Symbol</label>
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full border rounded p-2"
          >
            {GROUPS[group].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm">Direction</label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option>BUY</option>
            <option>SELL</option>
          </select>
        </div>

        <div>
          <label className="text-sm">Account Balance</label>
          <input
            type="number"
            step="0.01"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="text-sm">Entry</label>
          <input
            type="number"
            step="0.00001"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="text-sm">{usePipsMode ? "SL Pips" : "Stop Loss Price"}</label>
            {usePipsMode ? (
              <input
                type="number"
                step="0.01"
                value={slPips}
                onChange={(e) => setSlPips(e.target.value)}
                className="w-full border rounded p-2"
              />
            ) : (
              <input
                type="number"
                step="0.00001"
                value={sl}
                onChange={(e) => setSL(e.target.value)}
                className="w-full border rounded p-2"
              />
            )}
          </div>
          <button
            type="button"
            onClick={() => setUsePipsMode(!usePipsMode)}
            className="h-10 px-3 rounded border"
          >
            {usePipsMode ? "Use Price" : "Use Pips"}
          </button>
        </div>

        <div>
          <label className="text-sm">Risk %</label>
          <input
            type="number"
            step="0.1"
            value={riskPercent}
            onChange={(e) => setRiskPercent(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="text-sm">R : R</label>
          <input
            type="number"
            step="0.5"
            value={rr}
            onChange={(e) => setRR(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4">
        <div className="p-3 border rounded">
          <div className="text-xs text-gray-500">Pip Size</div>
          <div className="font-semibold">{spec.pipSize}</div>
        </div>
        <div className="p-3 border rounded">
          <div className="text-xs text-gray-500">Pip Value (per 1 Lot)</div>
          <div className="font-semibold">${pipVal.toFixed(6)}</div>
        </div>
        <div className="p-3 border rounded">
          <div className="text-xs text-gray-500">SL Distance (pips)</div>
          <div className="font-semibold">{pips.toFixed(2)}</div>
        </div>
        <div className="p-3 border rounded">
          <div className="text-xs text-gray-500">Risk Amount</div>
          <div className="font-semibold">${riskAmount.toFixed(2)}</div>
        </div>
        <div className="p-3 border rounded">
          <div className="text-xs text-gray-500">Suggested Lot</div>
          <div className="font-semibold">{lot.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        <div className="p-3 border rounded">
          <div className="text-xs text-gray-500">Suggested TP (price)</div>
          <div className="font-semibold">{tp ? tp.toFixed(5) : "-"}</div>
        </div>
        <div className="p-3 border rounded">
          <div className="text-xs text-gray-500">Estimated Reward ($)</div>
          <div className="font-semibold">
            {pips && lot ? (pips * pipVal * lot * Number(rr)).toFixed(2) : "-"}
          </div>
        </div>
        <div className="p-3 border rounded">
          <div className="text-xs">Asset: {spec.asset} • Contract: {spec.contractSize} • Quote: {spec.quote}</div>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={sendToAddTrade}
          className="px-4 py-2 rounded bg-primary text-white"
        >
          Send to Add Trade
        </button>
      </div>
    </div>
  );
};

export default RiskCalculator;
