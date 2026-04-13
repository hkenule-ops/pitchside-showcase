import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/players", label: "Players" },
  { to: "/gallery", label: "Gallery" },
  { to: "/videos", label: "Videos" },
  { to: "/admin", label: "Admin" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("naija_theme") !== "light";
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("light", !dark);
    localStorage.setItem("naija_theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-display text-2xl font-bold tracking-wider">
          <span className="text-gradient-primary">NAIJA</span>
          <span className="text-foreground"> STARS</span>
          <span className="text-accent"> FC</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium uppercase tracking-wider transition-colors hover:text-primary ${
                location.pathname === l.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button onClick={() => setDark(!dark)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button onClick={() => setDark(!dark)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm font-medium uppercase tracking-wider transition-colors hover:bg-secondary ${
                location.pathname === l.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
