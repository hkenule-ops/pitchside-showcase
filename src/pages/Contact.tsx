import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error("All fields required");
    toast.success("Message received. Investor relations will respond within 24h.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="container pt-28 pb-12">
        <div className="text-xs tracking-[0.2em] text-primary mb-3">INVESTOR RELATIONS</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground max-w-xl">Reach the ATYRAU ANPZ investor relations team in Kazakhstan.</p>
      </section>

      <section className="container pb-16 grid lg:grid-cols-2 gap-6">
        <form onSubmit={onSubmit} className="glass rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground">Full Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Message</label>
            <Textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <Button type="submit" className="w-full bg-gradient-gold text-primary-foreground"><Send size={16} className="mr-1.5" /> Send Message</Button>
        </form>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display font-semibold mb-4">Head Office — Atyrau</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3"><MapPin className="text-primary shrink-0" size={18} /> 1, Zeinolla Kabdolov Street, Atyrau, 060001 Kazakhstan</li>
              <li className="flex items-center gap-3"><Mail className="text-primary" size={18} /> <a href="mailto:ref@anpzexport.kz" className="hover:text-primary">ref@anpzexport.kz</a></li>
              <li className="flex items-center gap-3"><Phone className="text-primary" size={18} /> Investor Relations Direct</li>
            </ul>
          </div>
          <div className="glass rounded-2xl overflow-hidden">
            <iframe title="Atyrau location"
              src="https://www.google.com/maps?q=Atyrau,Kazakhstan&output=embed"
              className="w-full h-[280px] border-0 grayscale opacity-90" loading="lazy" />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
