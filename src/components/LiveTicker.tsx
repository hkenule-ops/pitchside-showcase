import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { fetchStockPrices } from "@/lib/api";
import { StockQuote } from "@/lib/types";

const LiveTicker = () => {
  const [quotes, setQuotes] = useState<StockQuote[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const q = await fetchStockPrices();
      if (mounted) setQuotes(q);
    };
    load();
    const id = setInterval(load, 6000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  if (!quotes.length) return null;
  const doubled = [...quotes, ...quotes];

  return (
    <div className="border-y border-border bg-card/40 overflow-hidden">
      <div className="flex animate-ticker whitespace-nowrap py-2.5">
        {doubled.map((q, i) => {
          const up = q.change >= 0;
          return (
            <div key={i} className="flex items-center gap-2 px-6 text-sm font-mono">
              <span className="text-foreground font-semibold tracking-wider">{q.symbol}</span>
              <span className="text-muted-foreground tabular">${q.price.toFixed(2)}</span>
              <span className={`flex items-center gap-0.5 tabular ${up ? "text-bull" : "text-bear"}`}>
                {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {up ? "+" : ""}{q.changePct.toFixed(2)}%
              </span>
              <span className="text-border">|</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveTicker;
