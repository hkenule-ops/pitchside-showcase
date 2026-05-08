import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveTicker from "@/components/LiveTicker";
import StatCard from "@/components/StatCard";
import CandlestickChart from "@/components/CandlestickChart";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { fetchCandles, fetchTransactions, requestWithdrawal, isApiConfigured } from "@/lib/api";
import { Candle, Transaction } from "@/lib/types";
import { Wallet, TrendingUp, Coins, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const Dashboard = () => {
  const { user, refresh } = useAuth();
  const [candles, setCandles] = useState<Candle[]>([]);
  const [tx, setTx] = useState<Transaction[]>([]);
  const [withdraw, setWithdraw] = useState("");

  useEffect(() => {
    fetchCandles("ANPZ").then(setCandles);
    if (isApiConfigured()) {
      fetchTransactions().then(setTx).catch(() => setTx([]));
      const id = setInterval(() => { refresh(); fetchTransactions().then(setTx).catch(() => {}); }, 8000);
      return () => clearInterval(id);
    }
    // demo data when no backend
    setTx([
      { id: "t1", userId: user?.id ?? "", type: "deposit", amount: 5000, status: "completed", timestamp: new Date(Date.now() - 86400000 * 7).toISOString(), note: "Initial deposit" },
      { id: "t2", userId: user?.id ?? "", type: "buy", amount: 2500, status: "completed", timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), note: "ANPZ buy" },
      { id: "t3", userId: user?.id ?? "", type: "dividend", amount: 187.4, status: "completed", timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
    ]);
  }, [refresh, user?.id]);

  const balance = user?.balance ?? 12450;
  const portfolio = user?.portfolioValue ?? 28940;
  const shares = user?.shares ?? 142;
  const pnl = user?.profitLoss ?? 1840;
  const pnlPct = portfolio ? (pnl / portfolio) * 100 : 0;

  const handleWithdraw = async () => {
    const amt = Number(withdraw);
    if (!amt || amt <= 0) return toast.error("Enter valid amount");
    try {
      await requestWithdrawal(amt, "bank");
      toast.success("Withdrawal requested. Awaiting admin approval.");
      setWithdraw("");
    } catch (e) {
      toast.error((e as Error).message || "Failed");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <LiveTicker />

      <div className="container pt-24 pb-16">
        <div className="mb-8">
          <div className="text-xs tracking-[0.2em] text-primary mb-2">INVESTOR DASHBOARD</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Welcome back{user ? `, ${user.name}` : ""}</h1>
          {user?.status === "frozen" && <div className="mt-3 px-4 py-2 rounded-lg bg-bear/15 text-bear text-sm">⚠ Account frozen by administrator</div>}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Wallet Balance" value={`$${balance.toLocaleString()}`} icon={<Wallet size={18} />} />
          <StatCard label="Portfolio Value" value={`$${portfolio.toLocaleString()}`} change={pnlPct} icon={<BarChart3 size={18} />} />
          <StatCard label="Shares Owned" value={shares.toLocaleString()} icon={<Coins size={18} />} />
          <StatCard label="Total P/L" value={`${pnl >= 0 ? "+" : ""}$${pnl.toLocaleString()}`} change={pnlPct} icon={<TrendingUp size={18} />} />
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">Portfolio Performance — ANPZ</h3>
              <span className="text-xs text-muted-foreground font-mono">Live</span>
            </div>
            <CandlestickChart data={candles.slice(-90)} height={380} />
          </div>

          <div className="space-y-4">
            <div className="glass rounded-2xl p-5">
              <h3 className="font-display font-semibold mb-3">Request Withdrawal</h3>
              <Input placeholder="Amount (USD)" value={withdraw} onChange={(e) => setWithdraw(e.target.value)} className="font-mono mb-3" />
              <Button className="w-full bg-gradient-gold text-primary-foreground" onClick={handleWithdraw}>Submit Request</Button>
              <p className="text-xs text-muted-foreground mt-2">Requests are processed within 24h after admin approval.</p>
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="font-display font-semibold mb-3">Allocation</h3>
              <div className="space-y-2 text-sm">
                {[["ANPZ Common", 72], ["KMG Bonds", 18], ["Cash USD", 10]].map(([n, v]) => (
                  <div key={n as string}>
                    <div className="flex justify-between text-xs mb-1"><span>{n}</span><span className="font-mono">{v}%</span></div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-gold" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="glass rounded-2xl p-5 mt-6">
          <h3 className="font-display font-semibold mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b border-border">
                <tr><th className="text-left py-2">Date</th><th className="text-left">Type</th><th className="text-left">Note</th><th className="text-right">Amount</th><th className="text-right">Status</th></tr>
              </thead>
              <tbody>
                {tx.map((t) => (
                  <tr key={t.id} className="border-b border-border/30">
                    <td className="py-3 font-mono text-xs">{new Date(t.timestamp).toLocaleString()}</td>
                    <td className="capitalize">{t.type.replace("_", " ")}</td>
                    <td className="text-muted-foreground">{t.note ?? "—"}</td>
                    <td className={`text-right font-mono ${["deposit", "dividend", "sell"].includes(t.type) ? "text-bull" : t.type === "withdraw" ? "text-bear" : ""}`}>
                      {["deposit", "dividend", "sell"].includes(t.type) ? "+" : t.type === "withdraw" ? "-" : ""}${t.amount.toLocaleString()}
                    </td>
                    <td className="text-right text-xs"><span className={`px-2 py-0.5 rounded ${t.status === "completed" ? "bg-bull/10 text-bull" : t.status === "pending" ? "bg-primary/10 text-primary" : "bg-bear/10 text-bear"}`}>{t.status}</span></td>
                  </tr>
                ))}
                {!tx.length && <tr><td colSpan={5} className="py-8 text-center text-muted-foreground text-sm">No transactions yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
