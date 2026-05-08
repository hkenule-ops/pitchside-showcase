import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Building2, Globe2, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveTicker from "@/components/LiveTicker";
import CandlestickChart from "@/components/CandlestickChart";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { fetchCandles, fetchAnnouncements } from "@/lib/api";
import { Candle, Announcement } from "@/lib/types";
import heroImg from "@/assets/refinery-hero.jpg";
import facilityImg from "@/assets/refinery-facility.jpg";

const Index = () => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [news, setNews] = useState<Announcement[]>([]);

  useEffect(() => {
    fetchCandles("ANPZ").then(setCandles);
    fetchAnnouncements().then(setNews);
  }, []);

  const last = candles[candles.length - 1];
  const first = candles[0];
  const changePct = last && first ? ((last.close - first.close) / first.close) * 100 : 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <LiveTicker />

      {/* HERO */}
      <section className="relative pt-8 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="Atyrau refinery at dusk" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 grid-bg opacity-30" />
        </div>

        <div className="container relative pt-20 pb-10 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-6 text-xs">
              <span className="w-2 h-2 rounded-full bg-bull animate-pulse-dot" />
              <span className="text-muted-foreground tracking-wider">LIVE • KAZAKHSTAN ENERGY MARKET</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] mb-5">
              Invest in the <span className="text-gradient-gold">Future of Energy</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
              Acquire equity in <span className="text-foreground font-semibold">ATYRAU OIL REFINERY ANPZ LLP</span> —
              Kazakhstan's strategic petroleum refining powerhouse, in partnership with KazMunayGas.
              Eight decades of operational excellence. Backed by national infrastructure.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/investment">
                <Button size="lg" className="bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-gold">
                  Buy Shares <ArrowRight size={16} className="ml-1.5" />
                </Button>
              </Link>
              <Link to="/market">
                <Button size="lg" variant="outline" className="border-border">
                  View Live Market
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
              <div><div className="text-2xl font-display font-bold text-primary">80+</div><div className="text-xs text-muted-foreground">Years Operating</div></div>
              <div><div className="text-2xl font-display font-bold text-primary">5.5M</div><div className="text-xs text-muted-foreground">Tons / Year</div></div>
              <div><div className="text-2xl font-display font-bold text-primary">$4.2B</div><div className="text-xs text-muted-foreground">Market Cap</div></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-muted-foreground tracking-wider">ANPZ.KZ</div>
                <div className="font-mono text-2xl font-bold tabular">${last?.close.toFixed(2) ?? "—"}</div>
              </div>
              <div className={`text-sm font-mono ${changePct >= 0 ? "text-bull" : "text-bear"}`}>
                {changePct >= 0 ? "▲ +" : "▼ "}{changePct.toFixed(2)}%
              </div>
            </div>
            <CandlestickChart data={candles.slice(-90)} height={280} showVolume={false} />
          </motion.div>
        </div>
      </section>

      {/* MARKET STATS */}
      <section className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Share Price" value={`$${last?.close.toFixed(2) ?? "—"}`} change={changePct} icon={<TrendingUp size={18} />} delay={0} />
          <StatCard label="Market Cap" value="$4.2B" change={2.1} icon={<BarChart3 size={18} />} delay={0.1} />
          <StatCard label="Daily Volume" value="2.4M" change={5.8} icon={<Zap size={18} />} delay={0.2} />
          <StatCard label="Active Investors" value="18,420" change={3.4} icon={<Globe2 size={18} />} delay={0.3} />
        </div>
      </section>

      {/* WHY INVEST */}
      <section className="container py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs tracking-[0.2em] text-primary mb-3">WHY ANPZ</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">A Strategic Energy Asset</h2>
          <p className="text-muted-foreground">Backed by sovereign infrastructure, decades of refining mastery, and an integrated partnership with KazMunayGas.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: <Building2 />, title: "State-Backed Infrastructure", desc: "Critical national asset operating one of Central Asia's largest refining complexes since 1945." },
            { icon: <ShieldCheck />, title: "Investor Protection", desc: "Regulated equity structure, transparent reporting, and quarterly dividend distributions." },
            { icon: <Globe2 />, title: "Global Energy Demand", desc: "Strategic positioning across Caspian, European, and Asian energy markets." },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass glass-hover rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">{f.icon}</div>
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SPLIT IMAGE */}
      <section className="container py-16 grid md:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <img src={facilityImg} alt="Atyrau refinery facility" className="rounded-2xl shadow-glass w-full" loading="lazy" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className="text-xs tracking-[0.2em] text-primary mb-3">REFINERY OPERATIONS</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Eight Decades of <span className="text-gradient-gold">Refining Excellence</span></h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Located on the Caspian shore in Atyrau, our complex processes Kazakhstan's premium crude into gasoline, diesel,
            jet fuel, and petrochemicals — distributed across Eurasia.
          </p>
          <ul className="space-y-3 text-sm">
            {["Caspian-grade crude processing", "EURO-5 fuel production", "Strategic KMG partnership", "ISO 14001 certified operations"].map((b) => (
              <li key={b} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {b}
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* NEWS */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs tracking-[0.2em] text-primary mb-2">INVESTOR UPDATES</div>
            <h2 className="font-display text-3xl font-bold">Latest Announcements</h2>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {news.slice(0, 3).map((n, i) => (
            <motion.article key={n.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass glass-hover rounded-xl p-6">
              <div className="text-xs text-muted-foreground font-mono mb-2">{new Date(n.date).toLocaleDateString()}</div>
              <h3 className="font-display font-semibold mb-2 leading-snug">{n.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{n.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <div className="glass rounded-2xl p-10 md:p-14 text-center bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20 -z-10" />
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Open Your Investor Account</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-7">Join 18,000+ investors building wealth through Kazakhstan's energy backbone.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/register"><Button size="lg" className="bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-gold">Get Started <ArrowRight size={16} className="ml-1.5" /></Button></Link>
            <Link to="/company"><Button size="lg" variant="outline">Learn More</Button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
