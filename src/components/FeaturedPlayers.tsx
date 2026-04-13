import { Link } from "react-router-dom";
import { players } from "@/lib/data";
import { Star } from "lucide-react";

const FeaturedPlayers = () => {
  const featured = players.filter((p) => p.featured);

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-wider">
            <span className="text-gradient-primary">Featured</span> Players
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">Our top talents ready for the world stage</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((player, i) => (
            <Link
              key={player.id}
              to={`/players/${player.id}`}
              className={`group relative overflow-hidden rounded-xl shadow-card animate-fade-in-up opacity-0 delay-${(i + 1) * 100}`}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={player.image}
                  alt={player.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-card" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gradient-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold uppercase">
                    #{player.jersey}
                  </span>
                  <span className="text-accent text-xs font-semibold uppercase">{player.position}</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground uppercase">{player.name}</h3>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span>{player.stats.goals} Goals</span>
                  <span>{player.stats.assists} Assists</span>
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-accent" fill="currentColor" />
                    {player.stats.rating}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPlayers;
