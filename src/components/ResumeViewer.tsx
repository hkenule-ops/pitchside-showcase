import { X } from "lucide-react";

interface ResumeViewerProps {
  url: string;
  playerName: string;
  onClose: () => void;
}

const ResumeViewer = ({ url, playerName, onClose }: ResumeViewerProps) => {
  return (
    <div className="fixed inset-0 z-[100] bg-background/95 flex flex-col items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-bold text-foreground uppercase">{playerName} — Resume</h3>
          <button className="text-foreground hover:text-primary transition-colors" onClick={onClose}>
            <X size={28} />
          </button>
        </div>
        <div className="bg-card rounded-xl overflow-hidden aspect-[3/4] md:aspect-video">
          <iframe
            src={url}
            className="w-full h-full"
            title={`${playerName} Resume`}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
        <p className="mt-3 text-center text-muted-foreground text-sm">View only — downloading is disabled</p>
      </div>
    </div>
  );
};

export default ResumeViewer;
