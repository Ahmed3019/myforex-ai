/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTradeDraft } from "../../context/TradeDraftContext";
import { GROUPS, getSpec } from "../../utils/calc";

const defaultState = {
  symbol: "EURUSD",
  asset_class: "FX",
  direction: "BUY",
  tradeDate: "",
  entryPrice: "",
  stopLoss: "",
  takeProfit: "",
  lotSize: "",
  timeframe: "",
  strategy: "",
  notes: "",
};

const AddTradeForm = ({ onTradeAdded = () => {} }) => {
  const { token } = useAuth();
  const { draft, setDraft } = useTradeDraft();

  const [group, setGroup] = useState("FX_Majors");
  const [form, setForm] = useState(defaultState);
  const [error, setError] = useState("");

  const symbols = GROUPS[group] || [];
  const spec = useMemo(() => getSpec(form.symbol), [form.symbol]);

  useEffect(() => {
    if (draft) {
      const grp = Object.keys(GROUPS).find((g) => GROUPS[g].includes(draft.symbol)) || "FX_Majors";
      setGroup(grp);
      setForm((prev) => ({
        ...prev,
        ...draft,
        asset_class: draft.asset_class || spec.asset,
        tradeDate: draft.tradeDate || new Date().toISOString(),
      }));
      setDraft(null);
    }
    // eslint-disable-next-line
  }, [draft]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onChangeGroup = (e) => {
    const g = e.target.value;
    setGroup(g);
    const first = GROUPS[g][0];
    setForm((f) => ({
      ...f,
      symbol: first,
      asset_class: getSpec(first).asset,
    }));
  };

  const onChangeSymbol = (e) => {
    const sym = e.target.value;
    const s = getSpec(sym);
    setForm((f) => ({ ...f, symbol: sym, asset_class: s.asset }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create trade");
      onTradeAdded(data);
      setForm(defaultState);
    } catch (err) {
      setError(err.message);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      // السماح للإنتر يعمل حفظ سريع
      e.preventDefault();
      // simulate form submit
      const fake = { preventDefault: () => {} };
      submit(fake);
    }
  };

  return (
    <div className="p-4 bg-white border rounded">
      <div className="mb-3 font-semibold">Add Trade</div>
      {error && <div className="mb-2 text-red-600">{error}</div>}

      <form onSubmit={submit} onKeyDown={onKeyDown} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-sm">Group</label>
          <select value={group} onChange={onChangeGroup} className="w-full border rounded p-2">
            {Object.keys(GROUPS).map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm">Symbol</label>
          <select name="symbol" value={form.symbol} onChange={onChangeSymbol} className="w-full border rounded p-2">
            {symbols.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm">Asset</label>
          <input name="asset_class" value={form.asset_class} readOnly className="w-full border rounded p-2 bg-gray-50"/>
        </div>

        <div>
          <label className="text-sm">Direction</label>
          <select name="direction" value={form.direction} onChange={onChange} className="w-full border rounded p-2">
            <option>BUY</option>
            <option>SELL</option>
          </select>
        </div>

        <div>
          <label className="text-sm">Trade Date</label>
          <input
            type="datetime-local"
            name="tradeDate"
            value={form.tradeDate ? new Date(form.tradeDate).toISOString().slice(0, 16) : ""}
            onChange={(e) => setForm((f) => ({ ...f, tradeDate: new Date(e.target.value).toISOString() }))}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="text-sm">Entry</label>
          <input type="number" step="0.00001" name="entryPrice" value={form.entryPrice} onChange={onChange} className="w-full border rounded p-2"/>
        </div>

        <div>
          <label className="text-sm">Stop Loss</label>
          <input type="number" step="0.00001" name="stopLoss" value={form.stopLoss || ""} onChange={onChange} className="w-full border rounded p-2"/>
        </div>

        <div>
          <label className="text-sm">Take Profit</label>
          <input type="number" step="0.00001" name="takeProfit" value={form.takeProfit || ""} onChange={onChange} className="w-full border rounded p-2"/>
        </div>

        <div>
          <label className="text-sm">Lot Size</label>
          <input type="number" step="0.01" name="lotSize" value={form.lotSize} onChange={onChange} className="w-full border rounded p-2"/>
        </div>

        <div>
          <label className="text-sm">Timeframe</label>
          <input name="timeframe" value={form.timeframe} onChange={onChange} className="w-full border rounded p-2"/>
        </div>

        <div>
          <label className="text-sm">Strategy</label>
          <input name="strategy" value={form.strategy} onChange={onChange} className="w-full border rounded p-2"/>
        </div>

        <div className="md:col-span-3">
          <label className="text-sm">Notes</label>
          <textarea name="notes" value={form.notes} onChange={onChange} className="w-full border rounded p-2"/>
        </div>

        <div className="md:col-span-3 mt-2">
          <button type="submit" className="px-4 py-2 rounded bg-primary text-white">
            Save Trade
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTradeForm;
