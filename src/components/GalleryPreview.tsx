import { Link } from "react-router-dom";
import { galleryItems } from "@/lib/data";
import { Camera } from "lucide-react";

const GalleryPreview = () => {
  const items = galleryItems.slice(0, 4);

  return (
    <section className="py-20 px-4 bg-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-wider">
            <span className="text-gradient-primary">Academy</span> Gallery
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">Life at Naija Stars FC</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/60 transition-colors flex items-center justify-center">
                <Camera className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/gallery"
            className="inline-block px-8 py-3 border-2 border-primary text-primary font-display text-sm uppercase tracking-wider rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
