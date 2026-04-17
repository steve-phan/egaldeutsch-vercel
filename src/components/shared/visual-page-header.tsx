"use client";

import React from "react";
import { Sparkles, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface VisualPageHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconColor?: string;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
  className?: string;
}

export function VisualPageHeader({
  title,
  subtitle,
  icon,
  iconColor = "bg-primary",
  backHref,
  backLabel = "Back",
  children,
  className
}: VisualPageHeaderProps) {
  return (
    <div className={cn("space-y-6 animate-in slide-in-from-top-4 duration-700", className)}>
      {backHref && (
        <Link href={backHref}>
          <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-[0.2em] transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {backLabel}
          </button>
        </Link>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg",
            iconColor
          )}>
            {icon}
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic leading-none">
              {title}
            </h1>
            <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-tight flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-amber-500" /> {subtitle}
            </p>
          </div>
        </div>
        
        {children && (
          <div className="flex items-center gap-3 w-full md:w-auto">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
