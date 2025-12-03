import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface AudioPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  disabled: boolean;
}

export function AudioPlayer({ isPlaying, onTogglePlay, disabled }: AudioPlayerProps) {
  return (
    <div className="flex items-center justify-center p-6 bg-slate-100 rounded-lg">
      <Button
        size="lg"
        className="rounded-full w-16 h-16 p-0"
        onClick={onTogglePlay}
        disabled={disabled}
      >
        {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
      </Button>
    </div>
  );
}
