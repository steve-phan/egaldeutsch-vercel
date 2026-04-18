"use client";

import { Card } from "@/components/shared/layout/card";
import { GraduationCap, Award } from "lucide-react";

export function CourseCompletion() {
  return (
    <Card padding="md" radius="3xl" hover className="flex items-center justify-between gap-6 group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800 italic">Course Progress</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Level A1 Complete</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100 italic">
         <Award className="w-4 h-4 text-amber-500" />
         <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Certified</span>
      </div>
    </Card>
  );
}
