import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock, LogIn, AlertCircle } from "lucide-react";

const AdminLogin = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (!username || !password) {
      setLocalError("Please enter both username and password");
      return;
    }
    try {
      await login(username, password);
      navigate("/admin");
    } catch {
      setLocalError(error || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 px-4 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Lock size={28} className="text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-wider text-foreground">
              Admin Login
            </h1>
            <p className="text-muted-foreground mt-2">Sign in to manage the academy</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 shadow-card">
            {(localError || error) && (
              <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-3 mb-6 text-sm">
                <AlertCircle size={16} />
                {localError || error}
              </div>
            )}

            <div className="mb-5">
              <label className="block text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none transition-colors"
                placeholder="Enter username"
                autoComplete="username"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:border-primary outline-none transition-colors"
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-primary text-primary-foreground font-display text-sm uppercase tracking-wider rounded-lg shadow-glow hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
              ) : (
                <>
                  <LogIn size={18} /> Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLogin;
