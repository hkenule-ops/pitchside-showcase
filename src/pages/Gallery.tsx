import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LightboxModal from "@/components/LightboxModal";
import { galleryItems } from "@/lib/data";

const categories = ["all", "training", "match", "team", "facility"] as const;

const Gallery = () => {
  const [filter, setFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const filtered = filter === "all" ? galleryItems : galleryItems.filter((g) => g.category === filter);
  const images = filtered.map((g) => g.src);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-wider text-center mb-4">
            <span className="text-gradient-primary">Academy</span> Gallery
          </h1>
          <p className="text-center text-muted-foreground text-lg mb-10">Capturing moments of greatness</p>

          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wider transition-colors ${
                  filter === cat
                    ? "bg-gradient-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setLightboxIndex(i)}
                className="group block w-full overflow-hidden rounded-lg break-inside-avoid"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {lightboxIndex >= 0 && (
        <LightboxModal
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onNext={() => setLightboxIndex((lightboxIndex + 1) % images.length)}
          onPrev={() => setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
