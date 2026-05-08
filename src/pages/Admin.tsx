import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  adminGetUsers, adminGetWithdrawals, adminGetLogs, adminAdjustBalance, adminEditPortfolio,
  adminApproveWithdrawal, adminRejectWithdrawal, adminCreateTransaction, adminFreeze,
  adminSimulateMarket, adminSetDividend, adminSetAnnouncement, getApiUrl, setApiUrl, isApiConfigured,
} from "@/lib/api";
import { User, Withdrawal, AdminLog } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Snowflake, Check, X, Plus } from "lucide-react";

const Admin = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [api, setApi] = useState(getApiUrl());

  const refresh = async () => {
    if (!isApiConfigured()) return;
    try {
      const [u, w, l] = await Promise.all([adminGetUsers(), adminGetWithdrawals(), adminGetLogs()]);
      setUsers(u); setWithdrawals(w); setLogs(l);
    } catch (e) { toast.error((e as Error).message); }
  };
  useEffect(() => { refresh(); }, []);

  const saveApi = () => { setApiUrl(api); toast.success("API URL saved"); refresh(); };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container pt-28 pb-16">
          <div className="glass rounded-2xl p-8 max-w-xl">
            <h1 className="font-display text-2xl font-bold mb-2">Admin Access Required</h1>
            <p className="text-muted-foreground mb-4">Sign in with an admin account to manage the platform.</p>
            <div className="space-y-3 border-t border-border pt-4">
              <h2 className="font-display font-semibold">Backend Setup</h2>
              <label className="text-xs text-muted-foreground">Google Apps Script Web App URL</label>
              <Input value={api} onChange={(e) => setApi(e.target.value)} placeholder="https://script.google.com/macros/s/.../exec" />
              <Button onClick={saveApi} className="bg-gradient-gold text-primary-foreground">Save</Button>
              <p className="text-xs text-muted-foreground">After saving, log in as the admin user defined in your Apps Script Users sheet (role=admin).</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container pt-24 pb-16">
        <div className="text-xs tracking-[0.2em] text-primary mb-2">ADMIN CONSOLE</div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">Platform Control</h1>

        <Tabs defaultValue="investors">
          <TabsList className="glass mb-6 flex-wrap h-auto">
            <TabsTrigger value="investors">Investors</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="market">Market Simulation</TabsTrigger>
            <TabsTrigger value="dividends">Dividends</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="logs">Activity Log</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="investors"><InvestorsTab users={users} refresh={refresh} /></TabsContent>
          <TabsContent value="withdrawals"><WithdrawalsTab list={withdrawals} refresh={refresh} /></TabsContent>
          <TabsContent value="market"><MarketTab refresh={refresh} /></TabsContent>
          <TabsContent value="dividends"><DividendsTab users={users} refresh={refresh} /></TabsContent>
          <TabsContent value="announcements"><AnnouncementsTab refresh={refresh} /></TabsContent>
          <TabsContent value="logs"><LogsTab logs={logs} /></TabsContent>
          <TabsContent value="settings">
            <div className="glass rounded-2xl p-6 max-w-xl">
              <h3 className="font-display font-semibold mb-4">Apps Script URL</h3>
              <Input value={api} onChange={(e) => setApi(e.target.value)} className="mb-3" />
              <Button onClick={saveApi} className="bg-gradient-gold text-primary-foreground">Save</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const InvestorsTab = ({ users, refresh }: { users: User[]; refresh: () => void }) => {
  const [edit, setEdit] = useState<Record<string, Partial<User>>>({});

  const adjust = async (id: string, delta: number) => {
    try { await adminAdjustBalance(id, delta, "Admin manual adjustment"); toast.success("Balance updated"); refresh(); }
    catch (e) { toast.error((e as Error).message); }
  };
  const save = async (id: string) => {
    try { await adminEditPortfolio(id, edit[id] || {}); toast.success("Saved"); setEdit({ ...edit, [id]: {} }); refresh(); }
    catch (e) { toast.error((e as Error).message); }
  };
  const freeze = async (id: string, frozen: boolean) => {
    try { await adminFreeze(id, frozen); toast.success(frozen ? "Frozen" : "Unfrozen"); refresh(); }
    catch (e) { toast.error((e as Error).message); }
  };

  return (
    <div className="glass rounded-2xl p-5 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-xs text-muted-foreground border-b border-border">
          <tr><th className="text-left py-2">Investor</th><th className="text-right">Balance</th><th className="text-right">Portfolio</th><th className="text-right">Shares</th><th className="text-right">P/L</th><th className="text-right">Status</th><th /></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-border/30">
              <td className="py-3"><div>{u.name}</div><div className="text-xs text-muted-foreground">{u.email}</div></td>
              <td className="text-right"><Input className="w-28 text-right font-mono ml-auto" defaultValue={u.balance}
                onChange={(e) => setEdit({ ...edit, [u.id]: { ...edit[u.id], balance: Number(e.target.value) } })} /></td>
              <td className="text-right"><Input className="w-28 text-right font-mono ml-auto" defaultValue={u.portfolioValue}
                onChange={(e) => setEdit({ ...edit, [u.id]: { ...edit[u.id], portfolioValue: Number(e.target.value) } })} /></td>
              <td className="text-right"><Input className="w-20 text-right font-mono ml-auto" defaultValue={u.shares}
                onChange={(e) => setEdit({ ...edit, [u.id]: { ...edit[u.id], shares: Number(e.target.value) } })} /></td>
              <td className="text-right"><Input className="w-24 text-right font-mono ml-auto" defaultValue={u.profitLoss}
                onChange={(e) => setEdit({ ...edit, [u.id]: { ...edit[u.id], profitLoss: Number(e.target.value) } })} /></td>
              <td className="text-right text-xs"><span className={`px-2 py-0.5 rounded ${u.status === "active" ? "bg-bull/10 text-bull" : "bg-bear/10 text-bear"}`}>{u.status}</span></td>
              <td className="text-right space-x-1 whitespace-nowrap">
                <Button size="sm" variant="outline" onClick={() => save(u.id)}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => adjust(u.id, 100)}>+100</Button>
                <Button size="sm" variant="outline" onClick={() => adjust(u.id, -100)}>-100</Button>
                <Button size="sm" variant="outline" onClick={() => freeze(u.id, u.status === "active")}><Snowflake size={14} /></Button>
              </td>
            </tr>
          ))}
          {!users.length && <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No investors yet</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

const WithdrawalsTab = ({ list, refresh }: { list: Withdrawal[]; refresh: () => void }) => (
  <div className="glass rounded-2xl p-5 overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="text-xs text-muted-foreground border-b border-border">
        <tr><th className="text-left py-2">Date</th><th className="text-left">Investor</th><th className="text-right">Amount</th><th className="text-left">Method</th><th className="text-right">Status</th><th /></tr>
      </thead>
      <tbody>
        {list.map((w) => (
          <tr key={w.id} className="border-b border-border/30">
            <td className="py-3 text-xs font-mono">{new Date(w.requestedAt).toLocaleString()}</td>
            <td>{w.userName ?? w.userId}</td>
            <td className="text-right font-mono">${w.amount.toLocaleString()}</td>
            <td>{w.method}</td>
            <td className="text-right text-xs"><span className={`px-2 py-0.5 rounded ${w.status === "approved" ? "bg-bull/10 text-bull" : w.status === "rejected" ? "bg-bear/10 text-bear" : "bg-primary/10 text-primary"}`}>{w.status}</span></td>
            <td className="text-right space-x-1">
              {w.status === "pending" && <>
                <Button size="sm" variant="outline" onClick={async () => { await adminApproveWithdrawal(w.id); toast.success("Approved"); refresh(); }}><Check size={14} /></Button>
                <Button size="sm" variant="outline" onClick={async () => { await adminRejectWithdrawal(w.id); toast.success("Rejected"); refresh(); }}><X size={14} /></Button>
              </>}
            </td>
          </tr>
        ))}
        {!list.length && <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No withdrawal requests</td></tr>}
      </tbody>
    </table>
  </div>
);

const MarketTab = ({ refresh }: { refresh: () => void }) => {
  const [symbol, setSymbol] = useState("ANPZ");
  const [mag, setMag] = useState("2");
  const sim = async (dir: "up" | "down") => {
    try { await adminSimulateMarket(symbol, dir, Number(mag)); toast.success(`Pushed ${dir} ${mag}% on ${symbol}`); refresh(); }
    catch (e) { toast.error((e as Error).message); }
  };
  return (
    <div className="glass rounded-2xl p-6 max-w-xl">
      <h3 className="font-display font-semibold mb-4">Market Simulation</h3>
      <p className="text-sm text-muted-foreground mb-4">Push synthetic candles to control the displayed market direction. All changes are logged.</p>
      <label className="text-xs text-muted-foreground">Symbol</label>
      <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} className="mb-3 mt-1 font-mono" />
      <label className="text-xs text-muted-foreground">Magnitude (%)</label>
      <Input value={mag} onChange={(e) => setMag(e.target.value)} className="mb-4 mt-1 font-mono" />
      <div className="flex gap-2">
        <Button className="flex-1 bg-bull text-white" onClick={() => sim("up")}>Bullish Push ▲</Button>
        <Button className="flex-1 bg-bear text-white" onClick={() => sim("down")}>Bearish Push ▼</Button>
      </div>
    </div>
  );
};

const DividendsTab = ({ users, refresh }: { users: User[]; refresh: () => void }) => {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("Q1 2026");
  const submit = async () => {
    try { await adminSetDividend(userId, Number(amount), period); toast.success("Dividend recorded"); refresh(); }
    catch (e) { toast.error((e as Error).message); }
  };
  return (
    <div className="glass rounded-2xl p-6 max-w-xl">
      <h3 className="font-display font-semibold mb-4">Distribute Dividend</h3>
      <select value={userId} onChange={(e) => setUserId(e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm mb-3">
        <option value="">Select investor...</option>
        {users.map((u) => <option key={u.id} value={u.id}>{u.name} — {u.email}</option>)}
      </select>
      <Input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mb-3 font-mono" />
      <Input placeholder="Period" value={period} onChange={(e) => setPeriod(e.target.value)} className="mb-4 font-mono" />
      <Button onClick={submit} className="bg-gradient-gold text-primary-foreground"><Plus size={14} className="mr-1" /> Pay Dividend</Button>
    </div>
  );
};

const AnnouncementsTab = ({ refresh }: { refresh: () => void }) => {
  const [t, setT] = useState(""); const [b, setB] = useState("");
  const submit = async () => {
    try { await adminSetAnnouncement({ title: t, body: b, date: new Date().toISOString(), pinned: false });
      toast.success("Announcement published"); setT(""); setB(""); refresh(); }
    catch (e) { toast.error((e as Error).message); }
  };
  return (
    <div className="glass rounded-2xl p-6 max-w-xl">
      <h3 className="font-display font-semibold mb-4">Publish Announcement</h3>
      <Input placeholder="Title" value={t} onChange={(e) => setT(e.target.value)} className="mb-3" />
      <textarea placeholder="Body" value={b} onChange={(e) => setB(e.target.value)} rows={4}
        className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm mb-4" />
      <Button onClick={submit} className="bg-gradient-gold text-primary-foreground">Publish</Button>
    </div>
  );
};

const LogsTab = ({ logs }: { logs: AdminLog[] }) => (
  <div className="glass rounded-2xl p-5 overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="text-xs text-muted-foreground border-b border-border">
        <tr><th className="text-left py-2">Time</th><th className="text-left">Admin</th><th className="text-left">Action</th><th className="text-left">Target</th><th className="text-left">Before → After</th></tr>
      </thead>
      <tbody>
        {logs.map((l) => (
          <tr key={l.id} className="border-b border-border/30 align-top">
            <td className="py-2 text-xs font-mono">{new Date(l.timestamp).toLocaleString()}</td>
            <td className="text-xs">{l.adminUser}</td>
            <td className="text-xs"><span className="px-2 py-0.5 rounded bg-primary/10 text-primary">{l.action}</span></td>
            <td className="text-xs font-mono">{l.targetId}</td>
            <td className="text-xs text-muted-foreground"><span className="text-bear">{l.before}</span> → <span className="text-bull">{l.after}</span></td>
          </tr>
        ))}
        {!logs.length && <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No admin activity yet</td></tr>}
      </tbody>
    </table>
  </div>
);

export default Admin;
