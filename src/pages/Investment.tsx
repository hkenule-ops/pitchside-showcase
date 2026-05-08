import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveTicker from "@/components/LiveTicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, TrendingUp } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link } from "react-router-dom";

const packages = [
  { name: "Bronze", min: 1000, roi: 8.5, color: "text-orange-300", perks: ["Quarterly dividends", "Investor portal", "Email reports"] },
  { name: "Silver", min: 10000, roi: 12.4, color: "text-zinc-300", perks: ["All Bronze perks", "Priority support", "Monthly insights"] },
  { name: "Gold", min: 50000, roi: 16.8, color: "text-primary", perks: ["All Silver perks", "Direct IR access", "Annual shareholder summit"], featured: true },
  { name: "Platinum", min: 250000, roi: 22.5, color: "text-emerald-300", perks: ["All Gold perks", "Board briefings", "Equity advisory"] },
];

const Investment = () => {
  const [principal, setPrincipal] = useState(10000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(16.8);

  const projection = Array.from({ length: years + 1 }, (_, i) => ({
    year: `Y${i}`,
    value: Math.round(principal * Math.pow(1 + rate / 100, i)),
  }));
  const finalValue = projection[projection.length - 1].value;
  const profit = finalValue - principal;

  return (
    <div className="min-h-screen">
      <Navbar />
      <LiveTicker />

      <section className="container pt-28 pb-12 text-center max-w-3xl mx-auto">
        <div className="text-xs tracking-[0.2em] text-primary mb-3">SHARE SUBSCRIPTION</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Build Wealth in <span className="text-gradient-gold">Kazakhstan's Energy Sector</span></h1>
        <p className="text-muted-foreground">Choose your equity package. Earn quarterly dividends. Own a piece of Atyrau's refining infrastructure.</p>
      </section>

      <section className="container pb-16 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {packages.map((p, i) => (
          <motion.div key={p.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className={`glass glass-hover rounded-2xl p-6 relative ${p.featured ? "ring-2 ring-primary shadow-gold" : ""}`}>
            {p.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-gold text-primary-foreground text-xs font-semibold">MOST POPULAR</div>}
            <h3 className={`font-display text-xl font-bold ${p.color}`}>{p.name}</h3>
            <div className="mt-3 mb-4">
              <span className="text-3xl font-mono font-bold">${p.min.toLocaleString()}</span>
              <span className="text-muted-foreground text-sm"> minimum</span>
            </div>
            <div className="text-sm font-mono text-bull flex items-center gap-1 mb-5">
              <TrendingUp size={14} /> {p.roi}% projected ROI / yr
            </div>
            <ul className="space-y-2 mb-6 text-sm">
              {p.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-muted-foreground"><Check size={14} className="mt-0.5 text-primary shrink-0" /> {perk}</li>
              ))}
            </ul>
            <Link to="/register" className="block">
              <Button className={`w-full ${p.featured ? "bg-gradient-gold text-primary-foreground" : ""}`} variant={p.featured ? "default" : "outline"}>Subscribe</Button>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Calculator */}
      <section className="container py-16 grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-2xl font-bold mb-4">Investment Calculator</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Initial Investment (USD)</label>
              <Input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value) || 0)} className="font-mono" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Investment Period (years): <span className="text-primary font-mono">{years}</span></label>
              <input type="range" min={1} max={20} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Annual ROI (%): <span className="text-primary font-mono">{rate.toFixed(1)}%</span></label>
              <input type="range" min={5} max={30} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="glass rounded-lg p-4">
              <div className="text-xs text-muted-foreground">Final Value</div>
              <div className="font-mono text-2xl font-bold text-primary">${finalValue.toLocaleString()}</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-xs text-muted-foreground">Total Profit</div>
              <div className="font-mono text-2xl font-bold text-bull">+${profit.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-2xl font-bold mb-4">Projected Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projection}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(45 90% 60%)" />
                  <stop offset="100%" stopColor="hsl(38 75% 45%)" />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" stroke="rgba(200,200,210,0.4)" style={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <YAxis stroke="rgba(200,200,210,0.4)" style={{ fontSize: 11, fontFamily: "JetBrains Mono" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "hsl(222 47% 7%)", border: "1px solid hsl(222 35% 16%)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="value" stroke="url(#g)" strokeWidth={3} dot={{ fill: "hsl(45 80% 55%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Timeline */}
      <section className="container py-16">
        <h2 className="font-display text-3xl font-bold text-center mb-10">Investment Growth Timeline</h2>
        <div className="grid md:grid-cols-4 gap-5">
          {[
            { y: "Day 1", t: "Subscribe & receive equity certificate" },
            { y: "Q1", t: "First quarterly dividend distribution" },
            { y: "Year 1", t: "Annual shareholder report + bonus shares" },
            { y: "Year 5", t: "Compound returns + voting rights" },
          ].map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-5">
              <div className="text-xs text-primary font-mono tracking-wider mb-2">{step.y}</div>
              <p className="text-sm text-muted-foreground">{step.t}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Investment;
