    /**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

// Simple API layer to talk to backend on :4000 directly (no CRA proxy needed)
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000";

export function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// --- Meta ---
export async function getPairsGroups() {
  const res = await fetch(`${API_BASE}/api/meta/pairs`);
  if (!res.ok) throw new Error("Failed to load pairs");
  return res.json();
}

export async function getTimeframes() {
  const res = await fetch(`${API_BASE}/api/meta/timeframes`);
  if (!res.ok) throw new Error("Failed to load timeframes");
  return res.json(); // { timeframes: [...] }
}

// --- Charts ---
export async function getCandles(symbol, timeframe, limit = 200) {
  const url = new URL(`${API_BASE}/api/charts/candles`);
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("timeframe", timeframe);
  url.searchParams.set("limit", String(limit));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to load candles");
  return res.json(); // { symbol, timeframe, candles: [...] }
}

export async function getQuote(symbol) {
  const url = new URL(`${API_BASE}/api/charts/quote`);
  url.searchParams.set("symbol", symbol);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to load quote");
  return res.json(); // { symbol, price, ts }
}

// Server-Sent Events stream
export function openQuoteStream(symbol, onTick) {
  const url = new URL(`${API_BASE}/api/charts/stream`);
  url.searchParams.set("symbol", symbol);
  const es = new EventSource(url.toString());
  es.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      onTick?.(data); // { symbol, price, ts }
    } catch {}
  };
  es.onerror = () => {
    // auto-close on error; caller may restart
    es.close();
  };
  return es; // call es.close() to stop
}
