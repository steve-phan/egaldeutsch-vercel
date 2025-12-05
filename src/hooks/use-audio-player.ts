import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Custom hook for managing audio playback.
 * Handles audio element lifecycle and play/pause state.
 * 
 * @param audioUrl - URL of the audio file to play
 * @returns Object with isPlaying state, togglePlay function, and hasAudio boolean
 */
export function useAudioPlayer(audioUrl: string | undefined) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Effect to synchronize audio element with URL changes.
  // This is a valid use case for setState in effect because we're synchronizing
  // React state with an external system (the browser's Audio API).
  useEffect(() => {
    // Cleanup previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    // Reset playing state when audio URL changes - this is necessary to sync
    // the React state with the actual audio playback state
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Syncing state with external audio system
    setIsPlaying(false);

    // Create new audio if URL provided
    if (audioUrl) {
      const newAudio = new Audio(audioUrl);
      // Subscribe to audio ended event to sync React state
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
