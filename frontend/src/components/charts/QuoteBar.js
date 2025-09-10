/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useEffect, useMemo, useRef, useState } from "react";

function decimalsFromPip(pipSize) {
  if (!pipSize) return 5;
  if (pipSize === 0.0001) return 5; // معظم أزواج الفوركس
  if (pipSize === 0.01) return 3;   // أزواج الين
  return 2;                         // معادن/طاقة/كريبتو افتراضي
}

export default function QuoteBar({ symbol }) {
  const [meta, setMeta] = useState(null);
  const [price, setPrice] = useState(null);
  const [flash, setFlash] = useState(false);
  const esRef = useRef(null);

  const flatMap = useMemo(() => {
    if (!meta) return {};
    const m = {};
    const push = (arr) => (arr || []).forEach((x) => (m[x.symbol] = x));
    if (meta.groups?.FX) {
      push(meta.groups.FX.MAJORS);
      push(meta.groups.FX.MINORS);
      push(meta.groups.FX.EXOTICS);
    }
    push(meta.groups?.METALS);
    push(meta.groups?.ENERGY);
    push(meta.groups?.CRYPTO);
    return m;
  }, [meta]);

  const symInfo = flatMap[symbol];
  const decs = decimalsFromPip(symInfo?.pipSize);

  // load meta once
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/meta/pairs");
        const data = await res.json();
        setMeta(data);
      } catch (e) {
        // fallback بسيط
        setMeta({
          groups: {
            FX: { MAJORS: [{ symbol: "EURUSD", pipSize: 0.0001 }] },
          },
        });
      }
    })();
  }, []);

  // stream price
  useEffect(() => {
    if (!symbol) return;
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    const es = new EventSource(`/api/charts/stream?symbol=${encodeURIComponent(symbol)}`);
    es.onmessage = (ev) => {
      try {
        const { price: p } = JSON.parse(ev.data);
        setPrice(p);
        setFlash(true);
        setTimeout(() => setFlash(false), 150);
      } catch {}
    };
    es.onerror = () => {
      es.close();
    };
    esRef.current = es;
    return () => {
      if (esRef.current) esRef.current.close();
      esRef.current = null;
    };
  }, [symbol]);

  return (
    <div className="flex items-center justify-between px-4 py-2 rounded border border-[#1f2a37] bg-[#0f1b2a]">
      <div className="flex items-center gap-3">
        <div className="text-slate-300 text-sm">Symbol</div>
        <div className="px-2 py-1 rounded bg-slate-800 text-slate-100 text-sm">{symbol}</div>
      </div>
      <div
        className={`px-3 py-1 rounded text-white font-semibold ${
          flash ? "ring-2 ring-cyan-400" : ""
        }`}
        style={{
          background:
            price == null ? "#374151" : "#111827",
          border: "1px solid #1f2a37",
        }}
      >
        {price == null ? "—" : Number(price).toFixed(decs)}
      </div>
    </div>
  );
}
