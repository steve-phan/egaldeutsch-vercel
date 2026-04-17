"use client";

import { useLanguage } from "@/contexts/language-context";
import { Card, CardContent } from "@/components/ui/card";

export function WeeklyGoal() {
  const { language } = useLanguage();
  const percentage = 77;
  const strokeDasharray = 2 * Math.PI * 40;
  const strokeDashoffset = strokeDasharray * (1 - percentage / 100);

  return (
    <Card className="rounded-[2rem] border-none shadow-xl shadow-indigo-100/50 bg-white">
      <CardContent className="p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">
          {language === "de" ? "Wochenziel" : language === "vi" ? "Mục tiêu tuần" : "Weekly goal"}
        </h3>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="40"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="64"
                cy="64"
                r="40"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-primary transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="absolute text-2xl font-black text-slate-800">{percentage}%</span>
          </div>

          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm font-bold text-slate-500">55% Weekly</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-sm font-bold text-slate-500">13% Volume</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <span className="text-sm font-bold text-slate-500">32% Remainder</span>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
