/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { useEffect, useRef } from "react";

const tvSymbolMap = (symbol) => {
  const fx = new Set([
    "EURUSD","GBPUSD","USDJPY","USDCHF","USDCAD","AUDUSD","NZDUSD",
    "EURGBP","EURJPY","GBPJPY","AUDJPY","CHFJPY","USDTRY","USDZAR","USDSEK"
  ]);
  const metals = { XAUUSD: "OANDA:XAUUSD", XAGUSD: "OANDA:XAGUSD" };
  const energy = { WTIUSD: "TVC:USOIL", BRENTUSD: "TVC:UKOIL", NATGASUSD: "NYMEX:NG1!" };
  const crypto = { BTCUSD: "BINANCE:BTCUSDT", ETHUSD: "BINANCE:ETHUSDT" };

  if (fx.has(symbol)) return `FX:${symbol}`;
  if (metals[symbol]) return metals[symbol];
  if (energy[symbol]) return energy[symbol];
  if (crypto[symbol]) return crypto[symbol];
  return symbol;
};

const tfToTv = (tf) => {
  switch (tf) {
    case "M1": return "1";
    case "M5": return "5";
    case "M15": return "15";
    case "M30": return "30";
    case "H1": return "60";
    case "H4": return "240";
    case "D1": return "D";
    case "W1": return "W";
    case "MN": return "M";
    default: return "1";
  }
};

const normalizeTz = (tz) => {
  const allowed = new Set([
    "exchange", "Etc/UTC", "Africa/Cairo", "Europe/London", "America/New_York",
    "Asia/Dubai", "Asia/Tokyo"
  ]);
  return allowed.has(tz) ? tz : "Etc/UTC";
};

const ensureTvReady = (cb, tries = 0) => {
  if (window.TradingView && typeof window.TradingView.widget === "function") return cb();
  if (tries > 50) return;
  setTimeout(() => ensureTvReady(cb, tries + 1), 100);
};

const TradingViewWidget = ({
  symbol = "EURUSD",
  timeframe = "M1",
  timezone = "Etc/UTC",
  theme = "dark",
  height = 520,
  onPriceUpdate,
}) => {
  const containerIdRef = useRef(`tv_${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    if (!document.getElementById("tradingview-widget-script")) {
      const s = document.createElement("script");
      s.id = "tradingview-widget-script";
      s.src = "https://s3.tradingview.com/tv.js";
      s.async = true;
      document.body.appendChild(s);
      s.onload = () => renderWidget();
    } else {
      renderWidget();
    }

    function renderWidget() {
      ensureTvReady(() => {
        const container = document.getElementById(containerIdRef.current);
        if (!container) return;
        container.innerHTML = "";

        const tvSymbol = tvSymbolMap(symbol);
        const interval = tfToTv(timeframe);
        const tz = normalizeTz(timezone);

        /* eslint-disable no-new */
        const widget = new window.TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval,
          container_id: containerIdRef.current,
          timezone: tz,
          theme: theme === "dark" ? "dark" : "light",
          style: "1",
          locale: "en",
          hide_side_toolbar: false,
          allow_symbol_change: false,
          withdateranges: true,
          studies: [],
        });

        // متابعة التغيرات في السعر (Mirror)
        if (onPriceUpdate) {
          widget.onChartReady(() => {
            const chart = widget.activeChart();
            chart.onSymbolChanged(() => {
              const lastBar = chart.getSeriesByIndex(0)?.bars?.last();
              if (lastBar && lastBar.close) onPriceUpdate(lastBar.close);
            });
            chart.onDataLoaded(() => {
              const lastBar = chart.getSeriesByIndex(0)?.bars?.last();
              if (lastBar && lastBar.close) onPriceUpdate(lastBar.close);
            });
          });
        }
      });
    }
  }, [symbol, timeframe, timezone, theme]);

  return (
    <div style={{ width: "100%", height }}>
      <div id={containerIdRef.current} style={{ width: "100%", height }} />
    </div>
  );
};

export default TradingViewWidget;
