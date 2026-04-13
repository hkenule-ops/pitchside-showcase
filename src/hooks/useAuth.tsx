import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { isLoggedIn, getAdminUser, loginAdmin, logoutAdmin } from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());
  const [username, setUsername] = useState(getAdminUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsAuthenticated(isLoggedIn());
    setUsername(getAdminUser());
  }, []);

  const login = async (user: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginAdmin(user, pass);
      setIsAuthenticated(true);
      setUsername(res.username);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login failed";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
