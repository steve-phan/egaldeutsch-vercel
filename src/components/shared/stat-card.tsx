"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { PremiumCard } from "./premium-card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  delay?: number;
  className?: string;
}

export function StatCard({ 
  label, 
  value, 
  icon, 
  color = "bg-primary", 
  delay = 0,
  className 
}: StatCardProps) {
  return (
    <PremiumCard 
      delay={delay} 
      padding="md"
      className={cn("flex items-center gap-5 group", className)}
    >
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-500",
        color
      )}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-800 tracking-tighter italic">{value}</p>
      </div>
    </PremiumCard>
  );
}
