"use client";

import { useCallback, useRef } from "react";

export const SOUND_URLS = {
  CORRECT: "/sounds/correct.mp3",
  WRONG: "/sounds/wrong.mp3",
  FINISH: "/sounds/finish.mp3",
};

export function useAudio() {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const playSound = useCallback((url: string, volume: number = 0.5) => {
    try {
      if (!audioRefs.current[url]) {
        audioRefs.current[url] = new Audio(url);
      }
      
      const audio = audioRefs.current[url];
      audio.volume = volume;
      audio.currentTime = 0; // Reset to start if already playing
      audio.play().catch(err => {
        console.warn("Audio playback failed (interaction required?):", err);
      });
    } catch (err) {
      console.error("Failed to play sound:", err);
    }
  }, []);

  return {
    playCorrect: () => playSound(SOUND_URLS.CORRECT),
    playWrong: () => playSound(SOUND_URLS.WRONG, 0.4),
    playFinish: () => playSound(SOUND_URLS.FINISH, 0.6),
  };
}
