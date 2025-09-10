/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useEffect, useMemo, useState } from "react";
import TradingViewWidget from "../charts/TradingViewWidget";

const TZ_OPTIONS = [
  { v: "exchange", label: "Exchange Time" },
  { v: "Africa/Cairo", label: "Africa/Cairo (Local)" },
  { v: "Europe/London", label: "Europe/London" },
  { v: "America/New_York", label: "America/New_York" },
  { v: "Asia/Dubai", label: "Asia/Dubai" },
  { v: "Asia/Tokyo", label: "Asia/Tokyo" },
  { v: "Etc/UTC", label: "UTC" },
];

const ChartsTab = () => {
  const [symbols, setSymbols] = useState([]);
  const [symbol, setSymbol] = useState("EURUSD");
  const [timeframe, setTimeframe] = useState("M1");
  const [timezone, setTimezone] = useState("Africa/Cairo");
  const [quote, setQuote] = useState(null);
  const [priceColor, setPriceColor] = useState("text-white");

  // تحميل الأزواج
  useEffect(() => {
    const loadMeta = async () => {
      try {
        const res = await fetch("/api/meta/pairs");
        const data = await res.json();
        const flat = [
          ...data.groups.FX.MAJORS,
          ...data.groups.FX.MINORS,
          ...data.groups.FX.EXOTICS,
          ...data.groups.METALS,
          ...data.groups.ENERGY,
          ...data.groups.CRYPTO,
        ];
        setSymbols(flat);
      } catch (e) {
        console.error("Failed to load meta pairs", e);
      }
    };
    loadMeta();
  }, []);

  // السعر اللحظي
  useEffect(() => {
    let iv;
    let lastPrice = null;
    const tick = async () => {
      try {
        const res = await fetch(`/api/charts/quote?symbol=${symbol}`);
        const data = await res.json();
        if (data && data.price) {
          const newPrice = Number(data.price).toFixed(5);
          if (lastPrice !== null) {
            if (parseFloat(newPrice) > parseFloat(lastPrice)) {
              setPriceColor("text-green-400");
            } else if (parseFloat(newPrice) < parseFloat(lastPrice)) {
              setPriceColor("text-red-500");
            } else {
              setPriceColor("text-white");
            }
          }
          lastPrice = newPrice;
          setQuote(newPrice);
        }
      } catch (e) {
        console.error("Quote fetch error", e);
      }
    };
    tick();
    iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [symbol]);

  const selected = useMemo(() => {
    const item = symbols.find((s) => s.symbol === symbol);
    return item ? item.display : symbol;
  }, [symbols, symbol]);

  return (
    <div className="space-y-3">
      {/* شريط التحكم */}
      <div className="flex flex-wrap items-center gap-3 bg-[#0f172a] text-white p-3 rounded">
        <div className="flex items-center gap-2">
          <span className="opacity-70">Symbol</span>
          <select
            className="bg-[#111827] border border-gray-700 rounded px-2 py-1"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          >
            {symbols.map((s) => (
              <option key={s.symbol} value={s.symbol}>
                {s.display}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="opacity-70">Timeframe</span>
          <select
            className="bg-[#111827] border border-gray-700 rounded px-2 py-1"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            {["M1","M5","M15","M30","H1","H4","D1","W1","MN"].map((tf) => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="opacity-70">Timezone</span>
          <select
            className="bg-[#111827] border border-gray-700 rounded px-2 py-1"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            {TZ_OPTIONS.map((t) => (
              <option key={t.v} value={t.v}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* السعر */}
        <div className="ml-auto text-sm">
          <div className="opacity-70">{selected} — {timeframe}</div>
          <div className={`text-lg font-bold ${priceColor}`}>
            {quote || "--"}
          </div>
        </div>
      </div>

      {/* الشارت */}
      <div className="bg-[#0b1220] rounded border border-gray-800">
        <TradingViewWidget
          symbol={symbol}
          timeframe={timeframe}
          timezone={timezone}
          theme="dark"
          height={560}
        />
      </div>
    </div>
  );
};

export default ChartsTab;
