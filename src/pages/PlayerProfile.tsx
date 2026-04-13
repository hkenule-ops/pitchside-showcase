import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatCard from "@/components/StatCard";
import VideoModal from "@/components/VideoModal";
import ResumeViewer from "@/components/ResumeViewer";
import LightboxModal from "@/components/LightboxModal";
import { players } from "@/lib/data";
import { ArrowLeft, Play, FileText, Target, Users, Trophy, Star } from "lucide-react";

const PlayerProfile = () => {
  const { id } = useParams();
  const player = players.find((p) => p.id === id);
  const [showVideo, setShowVideo] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  if (!player) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Player not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-20 px-4">
        <div className="container mx-auto">
          <Link to="/players" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={18} /> Back to Players
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[3/4] overflow-hidden rounded-xl shadow-card">
                <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
              </div>
              {player.videoUrl && (
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute bottom-6 right-6 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow hover:scale-110 transition-transform"
                >
                  <Play size={28} className="text-primary-foreground ml-1" fill="currentColor" />
                </button>
              )}
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                  #{player.jersey}
                </span>
                <span className="text-accent font-semibold uppercase text-sm">{player.position}</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold uppercase text-foreground">{player.name}</h1>
              <p className="text-muted-foreground text-sm mt-1">Age: {player.age}</p>
              <p className="mt-6 text-muted-foreground text-lg leading-relaxed">{player.bio}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <StatCard label="Goals" value={player.stats.goals} icon={<Target size={20} />} />
                <StatCard label="Assists" value={player.stats.assists} icon={<Users size={20} />} />
                <StatCard label="Apps" value={player.stats.appearances} icon={<Trophy size={20} />} />
                <StatCard label="Rating" value={player.stats.rating} icon={<Star size={20} />} />
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                {player.videoUrl && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className="px-6 py-3 bg-gradient-primary text-primary-foreground font-display uppercase tracking-wider rounded-lg shadow-glow hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    <Play size={18} /> Watch Highlights
                  </button>
                )}
                {player.resumeUrl && (
                  <button
                    onClick={() => setShowResume(true)}
                    className="px-6 py-3 border-2 border-accent text-accent font-display uppercase tracking-wider rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                  >
                    <FileText size={18} /> View Resume
                  </button>
                )}
              </div>

              {/* Photo gallery */}
              <div className="mt-10">
                <h3 className="font-display text-xl font-bold text-foreground uppercase mb-4">Photos</h3>
                <div className="grid grid-cols-3 gap-3">
                  {player.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxIndex(i)}
                      className="aspect-square overflow-hidden rounded-lg group"
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showVideo && player.videoUrl && (
        <VideoModal videoUrl={player.videoUrl} onClose={() => setShowVideo(false)} />
      )}
      {showResume && player.resumeUrl && (
        <ResumeViewer url={player.resumeUrl} playerName={player.name} onClose={() => setShowResume(false)} />
      )}
      {lightboxIndex >= 0 && (
        <LightboxModal
          images={player.images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onNext={() => setLightboxIndex((lightboxIndex + 1) % player.images.length)}
          onPrev={() => setLightboxIndex((lightboxIndex - 1 + player.images.length) % player.images.length)}
        />
      )}

      <Footer />
    </div>
  );
};

export default PlayerProfile;
