import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 mt-24">
    <div className="container py-16 grid md:grid-cols-4 gap-10">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center font-display font-bold text-primary-foreground">A</div>
          <div>
            <div className="font-display font-bold tracking-wider">ATYRAU</div>
            <div className="text-[10px] text-muted-foreground tracking-[0.2em]">REFINERY ANPZ LLP</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Kazakhstan's premier petroleum refining and energy investment platform. Founded 1945. Strategic partner of KazMunayGas.
        </p>
      </div>

      <div>
        <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {[["Live Market", "/market"], ["Investment", "/investment"], ["Dashboard", "/dashboard"], ["Company", "/company"]].map(([l, h]) => (
            <li key={h}><Link to={h} className="hover:text-primary transition-colors">{l}</Link></li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a className="hover:text-primary transition-colors flex items-center gap-1" href="#">Investor Prospectus <ArrowUpRight size={12} /></a></li>
          <li><a className="hover:text-primary transition-colors flex items-center gap-1" href="#">Annual Report 2025 <ArrowUpRight size={12} /></a></li>
          <li><a className="hover:text-primary transition-colors flex items-center gap-1" href="#">Compliance <ArrowUpRight size={12} /></a></li>
          <li><a className="hover:text-primary transition-colors flex items-center gap-1" href="#">Risk Disclosure <ArrowUpRight size={12} /></a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 text-primary shrink-0" />1 Zeinolla Kabdolov St., Atyrau 060001, Kazakhstan</li>
          <li className="flex items-center gap-2"><Mail size={14} className="text-primary" /><a href="mailto:ref@anpzexport.kz" className="hover:text-primary">ref@anpzexport.kz</a></li>
          <li className="flex items-center gap-2"><Phone size={14} className="text-primary" />Investor Relations</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border">
      <div className="container py-5 flex flex-col md:flex-row justify-between gap-2 text-xs text-muted-foreground">
        <div>© {new Date().getFullYear()} ATYRAU OIL REFINERY ANPZ LLP. All rights reserved.</div>
        <div>Strategic Partner: <span className="text-primary">KazMunayGas (KMG)</span></div>
      </div>
    </div>
  </footer>
);

export default Footer;
