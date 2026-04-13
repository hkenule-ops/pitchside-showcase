import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxModalProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const LightboxModal = ({ images, currentIndex, onClose, onNext, onPrev }: LightboxModalProps) => {
  return (
    <div className="fixed inset-0 z-[100] bg-background/95 flex items-center justify-center" onClick={onClose}>
      <button className="absolute top-4 right-4 text-foreground hover:text-primary transition-colors z-10" onClick={onClose}>
        <X size={32} />
      </button>
      {images.length > 1 && (
        <>
          <button
            className="absolute left-4 text-foreground hover:text-primary transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
          >
            <ChevronLeft size={40} />
          </button>
          <button
            className="absolute right-4 text-foreground hover:text-primary transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
          >
            <ChevronRight size={40} />
          </button>
        </>
      )}
      <img
        src={images[currentIndex]}
        alt=""
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default LightboxModal;
