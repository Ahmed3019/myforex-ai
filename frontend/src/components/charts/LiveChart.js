/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createChart } from "lightweight-charts";

const tfSeconds = (tf) => {
  switch (tf) {
    case "M1": return 60;
    case "M5": return 5 * 60;
    case "M15": return 15 * 60;
    case "M30": return 30 * 60;
    case "H1": return 60 * 60;
    case "H4": return 4 * 60 * 60;
    case "D1": return 24 * 60 * 60;
    case "W1": return 7 * 24 * 60 * 60;
    case "MN": return 30 * 24 * 60 * 60; // تقريب
    default: return 60;
  }
};

const precisionFor = (symbol) => (symbol.includes("JPY") ? 3 : 5);
const minMoveFor = (p) => +(1 / 10 ** p).toFixed(p);

const LiveChart = ({
  symbol = "EURUSD",
  timeframe = "M1",
  height = 520,
  theme = "dark",
}) => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  const [lastPrice, setLastPrice] = useState(null);

  // تجميع الشمعة الحالية حسب الباكت
  const aggRef = useRef({
    bucketTs: null,
    open: null,
    high: null,
    low: null,
    close: null,
  });

  const colors = useMemo(() => {
    const dark = theme === "dark";
    return {
      layout: {
        background: { type: "Solid", color: dark ? "#0b1020" : "#ffffff" },
        textColor: dark ? "#d1d5db" : "#111827",
      },
      grid: {
        vertLines: { color: dark ? "#1f2937" : "#e5e7eb" },
        horzLines: { color: dark ? "#1f2937" : "#e5e7eb" },
      },
      candle: {
        upColor: "#16a34a",
        wickUpColor: "#16a34a",
        borderUpColor: "#16a34a",
        downColor: "#dc2626",
        wickDownColor: "#dc2626",
        borderDownColor: "#dc2626",
      },
    };
  }, [theme]);

  // إنشاء الشارت + السلسلة
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      height,
      layout: colors.layout,
      grid: colors.grid,
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.15, bottom: 0.2 },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: { mode: 1 },
    });
    chartRef.current = chart;

    const p = precisionFor(symbol);
    const series = chart.addCandlestickSeries({
      upColor: colors.candle.upColor,
      borderUpColor: colors.candle.borderUpColor,
      wickUpColor: colors.candle.wickUpColor,
      downColor: colors.candle.downColor,
      borderDownColor: colors.candle.borderDownColor,
      wickDownColor: colors.candle.wickDownColor,
      priceFormat: { type: "price", precision: p, minMove: minMoveFor(p) },
    });
    seriesRef.current = series;

    const handleResize = () => {
      chart.applyOptions({ width: containerRef.current.clientWidth });
      chart.timeScale().fitContent();
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [height, colors, symbol]);

  // تحميل بيانات تاريخية
  useEffect(() => {
    let aborted = false;
    const load = async () => {
      try {
        const res = await fetch(
          `/api/charts/candles?symbol=${encodeURIComponent(symbol)}&timeframe=${encodeURIComponent(
            timeframe
          )}&limit=300`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (aborted) return;
        if (!data?.candles?.length) return;

        seriesRef.current.setData(
          data.candles.map((c) => ({
            time: c.time, // seconds (من الباك)
            open: +c.open,
            high: +c.high,
            low: +c.low,
            close: +c.close,
          }))
        );
        chartRef.current.timeScale().fitContent();

        const last = data.candles[data.candles.length - 1];
        setLastPrice(+last.close);

        // صَفِّر مجمّع الشمعة الحالية
        aggRef.current = { bucketTs: null, open: null, high: null, low: null, close: null };
      } catch (e) {
        console.error("load candles failed", e);
      }
    };
    load();
    return () => {
      aborted = true;
    };
  }, [symbol, timeframe]);

  // SSE + تجميع الشمعة حسب الفريم
  useEffect(() => {
    let es;
    let retryTimer;
    const p = precisionFor(symbol);
    const tfSec = tfSeconds(timeframe);

    const start = () => {
      es = new EventSource(`/api/charts/stream?symbol=${encodeURIComponent(symbol)}`);
      es.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          const price = +(+msg.price).toFixed(p);
          const tsSec = Math.floor(msg.ts / 1000);
          setLastPrice(price);

          const bucketTs = Math.floor(tsSec / tfSec) * tfSec;
          const agg = aggRef.current;

          if (agg.bucketTs === null || bucketTs > agg.bucketTs) {
            // بدأنا شمعة جديدة: استخدم close السابقة كـ open لو متاحة
            const open = agg.close ?? price;
            aggRef.current = {
              bucketTs,
              open,
              high: price,
              low: price,
              close: price,
            };
          } else {
            // نفس الشمعة: حدث high/low/close
            agg.close = price;
            if (price > agg.high) agg.high = price;
            if (price < agg.low) agg.low = price;
          }

          // حدّث السلسلة
          const { bucketTs: t, open, high, low, close } = aggRef.current;
          seriesRef.current.update({ time: t, open, high, low, close });
        } catch {}
      };
      es.onerror = () => {
        es.close();
        retryTimer = setTimeout(start, 1500);
      };
    };

    start();
    return () => {
      if (es) es.close();
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [symbol, timeframe]);

  return (
    <div className="w-full">
      {/* شريط السعر الحي */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm opacity-70">
          {symbol} — {timeframe}
        </div>
        <div className="text-xl font-semibold">
          {lastPrice != null ? lastPrice.toFixed(precisionFor(symbol)) : "--"}
        </div>
      </div>

      <div ref={containerRef} style={{ width: "100%", height }} />
    </div>
  );
};

export default LiveChart;
