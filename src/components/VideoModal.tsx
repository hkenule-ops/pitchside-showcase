import { X } from "lucide-react";

interface VideoModalProps {
  videoUrl: string;
  onClose: () => void;
}

const VideoModal = ({ videoUrl, onClose }: VideoModalProps) => {
  return (
    <div className="fixed inset-0 z-[100] bg-background/95 flex items-center justify-center p-4" onClick={onClose}>
      <button className="absolute top-4 right-4 text-foreground hover:text-primary transition-colors z-10" onClick={onClose}>
        <X size={32} />
      </button>
      <div className="w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
        <iframe
          src={videoUrl}
          className="w-full h-full rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoModal;
