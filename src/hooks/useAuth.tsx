import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@/lib/types";
import * as api from "@/lib/api";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(api.getStoredUser());
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    const u = await api.login(email, password);
    setUser(u);
    return u;
  };
  const register = async (name: string, email: string, password: string) => {
    const u = await api.register(name, email, password);
    setUser(u);
    return u;
  };
  const logout = async () => {
    await api.logout();
    setUser(null);
  };
  const refresh = async () => {
    if (!api.getToken()) return;
    setLoading(true);
    try {
      const fresh = await api.fetchPortfolio();
      setUser(fresh);
      localStorage.setItem("anpz_user", JSON.stringify(fresh));
    } catch { /* ignore — keep cached */ }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, []);

  return <Ctx.Provider value={{ user, loading, login, register, logout, refresh }}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be inside AuthProvider");
  return v;
};
