import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedPlayers from "@/components/FeaturedPlayers";
import GalleryPreview from "@/components/GalleryPreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturedPlayers />
      <GalleryPreview />
      <Footer />
    </div>
  );
};

export default Index;
