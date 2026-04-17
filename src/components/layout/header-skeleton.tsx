"use client";

import React from "react";

export function HeaderSkeleton() {
  return (
    <header className="w-full h-24 flex justify-between items-center animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-200" />
        <div className="space-y-2">
          <div className="h-5 w-32 bg-slate-200 rounded-md" />
          <div className="h-3 w-20 bg-slate-100 rounded-md" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-10 w-20 bg-slate-100 rounded-xl" />
        <div className="h-10 w-24 bg-slate-200 rounded-xl" />
      </div>
    </header>
  );
}

export function HeroSkeleton() {
  return (
    <div className="w-full h-[320px] rounded-[3rem] bg-slate-100 animate-pulse relative overflow-hidden">
       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
  );
}
