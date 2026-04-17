"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  animate?: boolean;
  delay?: number;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
}

const paddings = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-10",
};

export function PremiumCard({ 
  children, 
  className, 
  hover = true, 
  glow = false,
  animate = true,
  delay = 0,
  padding = "md",
  onClick
}: PremiumCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "glass-card-premium rounded-[2.5rem] border border-white/50 relative overflow-hidden",
        hover && "hover:-translate-y-1 hover:shadow-floating transition-all duration-500 cursor-pointer",
        animate && "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both text-balance",
        paddings[padding],
        className
      )}
      style={animate ? { animationDelay: `${delay}ms` } : {}}
    >
      {glow && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
      )}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
