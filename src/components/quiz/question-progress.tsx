"use client";

import React from "react";
import { Clock } from "lucide-react";

interface QuestionProgressProps {
  currentIndex: number;
  totalQuestions: number;
  timeRemainingMs: number | null;
}

export function QuestionProgress({ currentIndex, totalQuestions, timeRemainingMs }: QuestionProgressProps) {
  const progressWidth = (totalQuestions > 0) ? ((currentIndex) / totalQuestions) * 100 : 0;

  // If timeRemainingMs is null, we show 0:00
  const totalSeconds = timeRemainingMs !== null ? Math.floor(Math.abs(timeRemainingMs) / 1000) : 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  // Logic to determine if we are counting down (timed) or up (ZEN)
  // We can't know for sure here without more props, but we can infer based on context from useQuizSession
  // Actually, we'll just display it.
  
  const isCoundown = timeRemainingMs !== null && timeRemainingMs > 0;
  const isLowTime = isCoundown && totalSeconds < 10;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full bg-primary ${timeRemainingMs !== null ? "animate-pulse" : ""}`} />
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic">Live Quiz</span>
         </div>
         <div className="flex items-center gap-2 glass-pill px-3 py-1 rounded-full border-slate-100/50 min-w-[70px] justify-center">
            <Clock className={`w-3 h-3 ${isLowTime ? "text-rose-500 animate-bounce" : "text-slate-400"}`} />
            <span className={`text-[10px] font-black tabular-nums transition-colors ${isLowTime ? "text-rose-500" : "text-slate-400"}`}>
               {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
         </div>
      </div>

      <div className="h-1.5 w-full bg-slate-100/50 rounded-full overflow-hidden border border-white/50 backdrop-blur-sm relative">
        <div 
          className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-1000 ease-in-out relative"
          style={{ width: `${progressWidth}%` }}
        >
           <div className="absolute top-0 right-0 h-full w-8 bg-white/30 blur-sm" />
        </div>
      </div>
    </div>
  );
}
