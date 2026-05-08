import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { isApiConfigured } from "@/lib/api";

const Login = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApiConfigured()) return toast.error("Backend not configured. Ask admin to paste Apps Script URL in Admin → Settings.");
    setBusy(true);
    try {
      const u = await login(email, pw);
      toast.success("Logged in");
      nav(u.role === "admin" ? "/admin" : "/dashboard");
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center container py-20">
        <form onSubmit={onSubmit} className="glass rounded-2xl p-8 w-full max-w-md">
          <div className="text-xs tracking-[0.2em] text-primary mb-2">INVESTOR PORTAL</div>
          <h1 className="font-display text-2xl font-bold mb-6">Sign In</h1>
          <label className="text-xs text-muted-foreground">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4 mt-1" required />
          <label className="text-xs text-muted-foreground">Password</label>
          <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="mb-6 mt-1" required />
          <Button type="submit" disabled={busy} className="w-full bg-gradient-gold text-primary-foreground">{busy ? "Signing in..." : "Sign In"}</Button>
          <p className="text-xs text-muted-foreground text-center mt-4">No account? <Link to="/register" className="text-primary">Open one</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
