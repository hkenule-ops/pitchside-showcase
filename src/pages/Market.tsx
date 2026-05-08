import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveTicker from "@/components/LiveTicker";
import CandlestickChart from "@/components/CandlestickChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchCandles, fetchStockPrices } from "@/lib/api";
import { Candle, StockQuote } from "@/lib/types";
import { TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const ranges = [
  { label: "1D", days: 1 }, { label: "1W", days: 7 }, { label: "1M", days: 30 },
  { label: "3M", days: 90 }, { label: "1Y", days: 365 }, { label: "ALL", days: 9999 },
];

const Market = () => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [range, setRange] = useState(90);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("100");
  const [symbol, setSymbol] = useState("ANPZ");

  useEffect(() => {
    fetchCandles(symbol).then(setCandles);
    const id = setInterval(() => fetchCandles(symbol).then(setCandles), 8000);
    return () => clearInterval(id);
  }, [symbol]);

  useEffect(() => {
    fetchStockPrices().then(setQuotes);
    const id = setInterval(() => fetchStockPrices().then(setQuotes), 6000);
    return () => clearInterval(id);
  }, []);

  const filtered = candles.slice(-range);
  const last = filtered[filtered.length - 1];
  const first = filtered[0];
  const changePct = last && first ? ((last.close - first.close) / first.close) * 100 : 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <LiveTicker />

      <div className="container pt-24 pb-16">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Main chart */}
          <div className="glass rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-display text-2xl font-bold">{symbol}.KZ</h1>
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-mono">LIVE</span>
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <div className="font-mono text-3xl font-bold tabular">${last?.close.toFixed(2) ?? "—"}</div>
                  <div className={`font-mono text-sm flex items-center gap-1 ${changePct >= 0 ? "text-bull" : "text-bear"}`}>
                    {changePct >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {changePct >= 0 ? "+" : ""}{changePct.toFixed(2)}%
                  </div>
                </div>
              </div>
              <div className="flex gap-1 glass rounded-lg p-1">
                {ranges.map((r) => (
                  <button key={r.label} onClick={() => setRange(r.days === 9999 ? candles.length : r.days)}
                    className={`px-3 py-1.5 text-xs rounded-md font-mono transition ${
                      (range === r.days || (r.days === 9999 && range >= candles.length)) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}>{r.label}</button>
                ))}
              </div>
            </div>
            <CandlestickChart data={filtered} height={460} />
          </div>

          {/* Order panel */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-5">
              <div className="flex gap-2 mb-4">
                <button onClick={() => setSide("buy")}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${side === "buy" ? "bg-bull text-white" : "glass text-muted-foreground"}`}>BUY</button>
                <button onClick={() => setSide("sell")}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${side === "sell" ? "bg-bear text-white" : "glass text-muted-foreground"}`}>SELL</button>
              </div>
              <label className="text-xs text-muted-foreground">Symbol</label>
              <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="w-full mt-1 mb-3 bg-input border border-border rounded-lg px-3 py-2 text-sm font-mono">
                {quotes.map((q) => <option key={q.symbol} value={q.symbol}>{q.symbol} — {q.name}</option>)}
              </select>
              <label className="text-xs text-muted-foreground">Amount (USD)</label>
              <Input value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 mb-3 font-mono" />
              <div className="flex justify-between text-xs text-muted-foreground font-mono mb-1"><span>Price</span><span>${last?.close.toFixed(2) ?? "—"}</span></div>
              <div className="flex justify-between text-xs text-muted-foreground font-mono mb-3"><span>Est. Shares</span><span>{last ? (Number(amount) / last.close).toFixed(4) : "—"}</span></div>
              <Button className={`w-full ${side === "buy" ? "bg-bull hover:bg-bull/90" : "bg-bear hover:bg-bear/90"} text-white`}
                onClick={() => toast.success(`${side.toUpperCase()} order simulated for $${amount} ${symbol}`)}>
                {side === "buy" ? "Place Buy Order" : "Place Sell Order"}
              </Button>
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="font-display font-semibold mb-3 text-sm tracking-wider uppercase text-muted-foreground">Market Depth</h3>
              <div className="space-y-1.5">
                {[...Array(6)].map((_, i) => {
                  const buyPrice = (last?.close ?? 100) - (i + 1) * 0.15;
                  const sellPrice = (last?.close ?? 100) + (i + 1) * 0.15;
                  const w = 80 - i * 10;
                  return (
                    <div key={i} className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="relative bg-bear/10 rounded px-2 py-1">
                        <div className="absolute inset-y-0 right-0 bg-bear/20 rounded" style={{ width: `${w}%` }} />
                        <span className="relative text-bear">${buyPrice.toFixed(2)}</span>
                      </div>
                      <div className="relative bg-bull/10 rounded px-2 py-1 text-right">
                        <div className="absolute inset-y-0 left-0 bg-bull/20 rounded" style={{ width: `${w}%` }} />
                        <span className="relative text-bull">${sellPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Watchlist */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-5 mt-6">
          <h3 className="font-display font-semibold mb-4 text-sm tracking-wider uppercase">Energy Watchlist</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b border-border">
                <tr><th className="text-left py-2">Symbol</th><th className="text-left">Name</th><th className="text-right">Price</th><th className="text-right">Change</th><th className="text-right">% Change</th></tr>
              </thead>
              <tbody>
                {quotes.map((q) => (
                  <tr key={q.symbol} className="border-b border-border/30 hover:bg-secondary/40 cursor-pointer" onClick={() => setSymbol(q.symbol)}>
                    <td className="py-3 font-mono font-semibold">{q.symbol}</td>
                    <td className="text-muted-foreground">{q.name}</td>
                    <td className="text-right font-mono">${q.price.toFixed(2)}</td>
                    <td className={`text-right font-mono ${q.change >= 0 ? "text-bull" : "text-bear"}`}>{q.change >= 0 ? "+" : ""}{q.change.toFixed(2)}</td>
                    <td className={`text-right font-mono ${q.change >= 0 ? "text-bull" : "text-bear"}`}>{q.change >= 0 ? "+" : ""}{q.changePct.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Market;
