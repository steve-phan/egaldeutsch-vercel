"use client";

import React from "react";
import { Clock } from "lucide-react";

interface QuestionProgressProps {
  currentIndex: number;
  totalQuestions: number;
  timeRemainingMs: number;
}

export function QuestionProgress({ currentIndex, totalQuestions, timeRemainingMs }: QuestionProgressProps) {
  const progressWidth = (totalQuestions > 0) ? ((currentIndex) / totalQuestions) * 100 : 0;

  const seconds = Math.floor(timeRemainingMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic">Live Quiz</span>
         </div>
         <div className="flex items-center gap-2 glass-pill px-3 py-1 rounded-full border-slate-100/50">
            <Clock className={`w-3 h-3 ${seconds < 10 ? "text-rose-500 animate-bounce" : "text-slate-400"}`} />
            <span className={`text-[10px] font-black tabular-nums transition-colors ${seconds < 10 ? "text-rose-500" : "text-slate-400"}`}>
               {minutes}:{displaySeconds < 10 ? `0${displaySeconds}` : displaySeconds}
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
