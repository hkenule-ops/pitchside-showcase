import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoModal from "@/components/VideoModal";
import { fetchVideos, isApiConfigured } from "@/lib/api";
import { fallbackVideos, type Video } from "@/lib/data";
import { Play, Clock, Calendar } from "lucide-react";

const videoCategories = ["all", "highlight", "training", "spotlight"] as const;

const Videos = () => {
  const [filter, setFilter] = useState<string>("all");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>(fallbackVideos);

  useEffect(() => {
    if (isApiConfigured()) {
      fetchVideos().then(setVideos).catch(() => setVideos(fallbackVideos));
    }
  }, []);

  const filtered = filter === "all" ? videos : videos.filter((v) => v.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-wider text-center mb-4">
            <span className="text-gradient-primary">Video</span> Hub
          </h1>
          <p className="text-center text-muted-foreground text-lg mb-10">Watch highlights, training, and player spotlights</p>

          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            {videoCategories.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wider transition-colors ${
                  filter === cat ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}>{cat}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((video) => (
              <button key={video.id} onClick={() => setActiveVideo(video.videoUrl)} className="group text-left bg-card rounded-xl overflow-hidden shadow-card hover:shadow-glow transition-shadow">
                <div className="relative aspect-video overflow-hidden">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 flex items-center justify-center bg-background/30 group-hover:bg-background/50 transition-colors">
                    <div className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                      <Play size={24} className="text-primary-foreground ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-foreground uppercase">{video.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock size={14} /> {video.duration}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {video.date}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      {activeVideo && <VideoModal videoUrl={activeVideo} onClose={() => setActiveVideo(null)} />}
      <Footer />
    </div>
  );
};

export default Videos;
