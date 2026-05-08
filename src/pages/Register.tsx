import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { isApiConfigured } from "@/lib/api";

const Register = () => {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApiConfigured()) return toast.error("Backend not configured. Set up Apps Script URL first.");
    setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created");
      nav("/dashboard");
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center container py-20">
        <form onSubmit={onSubmit} className="glass rounded-2xl p-8 w-full max-w-md">
          <div className="text-xs tracking-[0.2em] text-primary mb-2">OPEN ACCOUNT</div>
          <h1 className="font-display text-2xl font-bold mb-6">Become an Investor</h1>
          <label className="text-xs text-muted-foreground">Full Name</label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mb-4 mt-1" required />
          <label className="text-xs text-muted-foreground">Email</label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mb-4 mt-1" required />
          <label className="text-xs text-muted-foreground">Password</label>
          <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mb-6 mt-1" required minLength={6} />
          <Button type="submit" disabled={busy} className="w-full bg-gradient-gold text-primary-foreground">{busy ? "Creating..." : "Create Account"}</Button>
          <p className="text-xs text-muted-foreground text-center mt-4">Have an account? <Link to="/login" className="text-primary">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Register;
