import { useState, useEffect } from "react";

export function useAudioPlayer(audioUrl: string | undefined) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioUrl) {
      const newAudio = new Audio(audioUrl);
      newAudio.onended = () => setIsPlaying(false);
      setAudio(newAudio);

      return () => {
        newAudio.pause();
        setAudio(null);
      };
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return { isPlaying, togglePlay, hasAudio: !!audio };
}
