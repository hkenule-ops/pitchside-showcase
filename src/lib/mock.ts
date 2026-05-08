import { Candle, StockQuote, Announcement } from "./types";

// Deterministic candle generator
export function generateCandles(count = 200, start = 142.5, seed = 7): Candle[] {
  const candles: Candle[] = [];
  let price = start;
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const now = Math.floor(Date.now() / 1000);
  const day = 86400;
  for (let i = count - 1; i >= 0; i--) {
    const open = price;
    const drift = (rand() - 0.48) * 4;
    const close = Math.max(20, open + drift);
    const high = Math.max(open, close) + rand() * 1.8;
    const low = Math.min(open, close) - rand() * 1.8;
    const volume = Math.floor(500000 + rand() * 1500000);
    candles.push({ time: now - i * day, open, high, low, close, volume });
    price = close;
  }
  return candles;
}

export const mockTicker: StockQuote[] = [
  { symbol: "ANPZ", name: "Atyrau Refinery", price: 142.85, change: 3.42, changePct: 2.45 },
  { symbol: "KMG", name: "KazMunayGas", price: 89.20, change: -1.10, changePct: -1.22 },
  { symbol: "BRENT", name: "Brent Crude", price: 86.74, change: 0.92, changePct: 1.07 },
  { symbol: "WTI", name: "WTI Crude", price: 82.31, change: 0.65, changePct: 0.80 },
  { symbol: "NGAS", name: "Natural Gas", price: 3.18, change: -0.04, changePct: -1.24 },
  { symbol: "URALS", name: "Urals Blend", price: 71.42, change: 1.20, changePct: 1.71 },
  { symbol: "SHELL", name: "Shell Plc", price: 71.05, change: 0.55, changePct: 0.78 },
  { symbol: "BP", name: "BP", price: 35.92, change: -0.21, changePct: -0.58 },
  { symbol: "XOM", name: "Exxon Mobil", price: 118.40, change: 1.85, changePct: 1.59 },
  { symbol: "CVX", name: "Chevron", price: 154.22, change: -0.68, changePct: -0.44 },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "a1",
    title: "Q3 2026 Dividend Declaration",
    body: "ATYRAU OIL REFINERY ANPZ LLP declares a 4.2% quarterly dividend for all shareholders of record as of June 15, 2026.",
    date: "2026-05-02",
    pinned: true,
  },
  {
    id: "a2",
    title: "Strategic Partnership Expansion with KazMunayGas",
    body: "ANPZ deepens cooperation with KMG to expand refining capacity to 6.5M tons/year by Q2 2027.",
    date: "2026-04-18",
    pinned: false,
  },
  {
    id: "a3",
    title: "New Investor Subscription Round Opens",
    body: "Series E share subscription is now open with projected 18.4% annualised ROI for early participants.",
    date: "2026-04-05",
    pinned: false,
  },
];
