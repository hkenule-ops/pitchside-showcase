import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import facility from "@/assets/refinery-facility.jpg";
import tanks from "@/assets/refinery-tanks.jpg";
import { Award, Factory, Globe, Users } from "lucide-react";

const Company = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="relative pt-28 pb-16">
      <div className="container">
        <div className="text-xs tracking-[0.2em] text-primary mb-3">CORPORATE OVERVIEW</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 max-w-3xl">ATYRAU OIL REFINERY <span className="text-gradient-gold">ANPZ LLP</span></h1>
        <p className="text-muted-foreground max-w-2xl">A national strategic asset of the Republic of Kazakhstan. Operating since 1945. In partnership with KazMunayGas.</p>
      </div>
    </section>

    <section className="container py-10 grid md:grid-cols-2 gap-8 items-center">
      <motion.img initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        src={facility} alt="ANPZ refinery" className="rounded-2xl shadow-glass" loading="lazy" />
      <div>
        <h2 className="font-display text-3xl font-bold mb-4">Our Mission</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          To produce world-class refined petroleum products that fuel Kazakhstan and Central Asia, while
          delivering sustained shareholder returns through operational excellence and strategic infrastructure investment.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { l: "Founded", v: "1945" },
            { l: "Capacity", v: "5.5M tons/yr" },
            { l: "Workforce", v: "2,400+" },
            { l: "Partner", v: "KazMunayGas" },
          ].map((s) => (
            <div key={s.l} className="glass rounded-lg p-4">
              <div className="text-xs text-muted-foreground">{s.l}</div>
              <div className="font-mono text-lg font-bold text-primary">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="container py-16">
      <h2 className="font-display text-3xl font-bold mb-8 text-center">What We Do</h2>
      <div className="grid md:grid-cols-4 gap-5">
        {[
          { icon: <Factory />, t: "Crude Refining", d: "Premium Caspian crude into EURO-5 fuels" },
          { icon: <Globe />, t: "Export Operations", d: "Distribution across Eurasia and Asia" },
          { icon: <Award />, t: "Quality Assurance", d: "ISO-certified petroleum products" },
          { icon: <Users />, t: "Investor Returns", d: "Quarterly dividends, equity growth" },
        ].map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="glass glass-hover rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">{f.icon}</div>
            <h3 className="font-display font-semibold mb-1">{f.t}</h3>
            <p className="text-xs text-muted-foreground">{f.d}</p>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="container py-10 grid md:grid-cols-2 gap-8 items-center">
      <div className="order-2 md:order-1">
        <h2 className="font-display text-3xl font-bold mb-4">Shareholding Structure</h2>
        <div className="space-y-3">
          {[["KazMunayGas (KMG)", 51], ["Public Investors", 34], ["Strategic Partners", 15]].map(([n, v]) => (
            <div key={n as string}>
              <div className="flex justify-between text-sm mb-1"><span>{n}</span><span className="font-mono text-primary">{v}%</span></div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-gradient-gold" style={{ width: `${v}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <motion.img initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        src={tanks} alt="Storage tanks" className="rounded-2xl shadow-glass order-1 md:order-2" loading="lazy" />
    </section>

    <section className="container py-16">
      <h2 className="font-display text-3xl font-bold mb-8 text-center">Leadership</h2>
      <div className="max-w-2xl mx-auto glass rounded-2xl p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-gold mx-auto mb-4 flex items-center justify-center font-display text-2xl text-primary-foreground font-bold">BK</div>
        <div className="font-display text-xl font-bold">Mr. Bishimov Kuanysh Erdauletovich</div>
        <div className="text-sm text-primary mt-1">Investor Relations Representative</div>
        <p className="text-sm text-muted-foreground mt-4">Driving institutional and retail investor engagement across Kazakhstan and global capital markets.</p>
      </div>
    </section>

    <Footer />
  </div>
);

export default Company;
