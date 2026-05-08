import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/market", label: "Market" },
  { to: "/investment", label: "Invest" },
  { to: "/company", label: "Company" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => typeof window !== "undefined" ? localStorage.getItem("anpz_theme") !== "light" : true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("light", !dark);
    localStorage.setItem("anpz_theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-bold">
          <div className="w-9 h-9 rounded-lg bg-gradient-gold flex items-center justify-center text-primary-foreground shadow-gold">
            <span className="text-sm">A</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm tracking-wider">ATYRAU</div>
            <div className="text-[10px] text-muted-foreground tracking-[0.2em]">ANPZ LLP</div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                }`}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <>
              {user.role === "admin" && (
                <Button size="sm" variant="ghost" onClick={() => navigate("/admin")}>
                  <Shield size={16} className="mr-1.5" /> Admin
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => navigate("/dashboard")}>
                <LayoutDashboard size={16} className="mr-1.5" /> Dashboard
              </Button>
              <Button size="sm" variant="outline" onClick={async () => { await logout(); navigate("/"); }}>
                <LogOut size={16} />
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={() => navigate("/login")}>Login</Button>
              <Button size="sm" className="bg-gradient-gold text-primary-foreground hover:opacity-90" onClick={() => navigate("/register")}>
                Open Account
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button onClick={() => setDark(!dark)} className="p-2 rounded-lg text-muted-foreground">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setOpen(!open)} className="text-foreground">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden glass border-t">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setOpen(false)}
              className={({ isActive }) => `block px-6 py-3 text-sm ${isActive ? "text-primary" : "text-muted-foreground"}`}>
              {l.label}
            </NavLink>
          ))}
          <div className="px-6 py-3 border-t border-border flex gap-2">
            {user ? (
              <>
                <Button size="sm" className="flex-1" variant="outline" onClick={() => { setOpen(false); navigate("/dashboard"); }}>Dashboard</Button>
                {user.role === "admin" && (
                  <Button size="sm" className="flex-1" variant="outline" onClick={() => { setOpen(false); navigate("/admin"); }}>Admin</Button>
                )}
                <Button size="sm" variant="ghost" onClick={async () => { await logout(); setOpen(false); navigate("/"); }}>
                  <LogOut size={16} />
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => { setOpen(false); navigate("/login"); }}>Login</Button>
                <Button size="sm" className="flex-1 bg-gradient-gold text-primary-foreground" onClick={() => { setOpen(false); navigate("/register"); }}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
