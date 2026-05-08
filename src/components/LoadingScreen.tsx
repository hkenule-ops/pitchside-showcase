import { Loader2 } from "lucide-react";

const LoadingScreen = ({ message = "Loading market data..." }: { message?: string }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      <Loader2 className="absolute inset-0 m-auto text-primary" size={20} />
    </div>
    <p className="text-sm text-muted-foreground font-mono">{message}</p>
  </div>
);

export default LoadingScreen;
