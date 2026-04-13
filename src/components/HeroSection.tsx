import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <img
        src={heroBg}
        alt="Academy training session"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider animate-fade-in-up">
          <span className="text-gradient-primary">Naija Stars</span>
          <br />
          <span className="text-foreground">Football Academy</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl animate-fade-in-up delay-200 opacity-0">
          Raising the Next Generation of Football Stars
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300 opacity-0">
          <Link
            to="/players"
            className="px-8 py-4 bg-gradient-primary text-primary-foreground font-display text-lg uppercase tracking-wider rounded-lg shadow-glow hover:scale-105 transition-transform"
          >
            View Players
          </Link>
          <Link
            to="/gallery"
            className="px-8 py-4 border-2 border-primary text-primary font-display text-lg uppercase tracking-wider rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Explore Gallery
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
