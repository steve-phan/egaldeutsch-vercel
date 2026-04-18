"use client";

import { Card } from "@/components/shared/layout/card";
import { Target, TrendingUp } from "lucide-react";

export function WeeklyGoal() {
  return (
    <Card padding="md" radius="3xl" hover className="flex items-center justify-between gap-6 group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800 italic">Weekly Goal</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">4/5 Sessions Complete</p>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1">
         <div className="flex items-center gap-1 text-emerald-500 font-black text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>80%</span>
         </div>
         <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-4/5 bg-indigo-500 rounded-full" />
         </div>
      </div>
    </Card>
  );
}
