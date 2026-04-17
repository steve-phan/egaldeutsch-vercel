"use client";

import { useLanguage } from "@/contexts/language-context";

export function WeeklyGoal() {
  const { language } = useLanguage();
  const percentage = 77;
  const strokeDasharray = 2 * Math.PI * 34;
  const strokeDashoffset = strokeDasharray * (1 - percentage / 100);

  return (
    <div className="glass-card-premium rounded-[2.5rem] p-6 flex items-center justify-between gap-6 overflow-hidden relative group">
      {/* Decorative Blob */}
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/30 rounded-full blur-3xl group-hover:bg-secondary/50 transition-colors" />

      <div className="space-y-1 relative z-10">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
          {language === "de" ? "Wochenziel" : language === "vi" ? "Mục tiêu tuần" : "Weekly goal"}
        </h3>
        <p className="text-3xl font-black text-slate-800 tracking-tighter">Excellent!</p>
        <p className="text-xs font-bold text-slate-500">You completed 12 lessons.</p>
      </div>
      
      <div className="relative w-24 h-24 flex items-center justify-center shrink-0 z-10">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="34"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100"
          />
          <circle
            cx="48"
            cy="48"
            r="34"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
           <span className="text-xl font-black text-slate-800 leading-none">{percentage}%</span>
        </div>
      </div>
    </div>
  );
}
