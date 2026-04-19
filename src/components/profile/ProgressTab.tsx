"use client";

import { Card } from "@/components/shared/layout/card";
import { ChevronRight, TrendingUp, Zap, Target } from "lucide-react";
import { DashboardStats } from "@/hooks/use-dashboard";

interface ProgressTabProps {
  accuracyProgress: number;
  levelInfo: {
    current: string;
    next: string;
  };
  stats: DashboardStats | null;
}

export function ProgressTab({ accuracyProgress, levelInfo, stats }: ProgressTabProps) {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Global Progress Bar Card */}
      <Card padding="lg" glass className="bg-gradient-to-br from-white to-slate-50 border-white/60 shadow-premium">
        <div className="flex justify-between items-baseline mb-4">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Overall Accuracy</p>
            <h2 className="text-3xl font-black text-slate-800 italic">Mastery {Math.round(accuracyProgress)}%</h2>
          </div>
          <div className="text-right">
            <p className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 leading-none">
              Next: {levelInfo.next} <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>
        <div className="overflow-hidden h-4 rounded-full bg-slate-100 shadow-inner flex p-1">
          <div
            style={{ width: `${accuracyProgress}%` }}
            className="rounded-full bg-primary shadow-lg shadow-primary/20 transition-all duration-1000 ease-out"
          />
        </div>
      </Card>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card padding="lg" hover className="group">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-2xl font-black text-slate-800 leading-none">{stats?.total_sessions || 0}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 px-2">Total Labs Complete</p>
          </div>
        </Card>

        <Card padding="lg" hover className="group">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <p className="text-2xl font-black text-slate-800 leading-none">{stats?.total_questions || 0}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 px-2">Questions Mastered</p>
          </div>
        </Card>
      </div>

      <Card padding="md" className="bg-slate-50 border-dashed border-slate-200">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm text-primary">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 italic">Daily Streak: 0 Days</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Maintain consistency</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>
      </Card>
    </div>
  );
}
