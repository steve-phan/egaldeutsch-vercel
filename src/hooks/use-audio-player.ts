import { useState, useRef, useCallback, useEffect } from "react";

export function useAudioPlayer(audioUrl: string | undefined) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Effect to handle audio URL changes
  useEffect(() => {
    // Cleanup previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Required to sync playing state when URL changes
    setIsPlaying(false);

    // Create new audio if URL provided
    if (audioUrl) {
      const newAudio = new Audio(audioUrl);
      newAudio.onended = () => setIsPlaying(false);
      audioRef.current = newAudio;
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  return { isPlaying, togglePlay, hasAudio: !!audioUrl };
}
