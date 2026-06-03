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

import { useLanguage } from "@/contexts/language-context";

export function VisualPageHeader({
  title,
  subtitle,
  icon,
  iconColor = "bg-primary",
  backHref,
  backLabel,
  children,
  className
}: VisualPageHeaderProps) {
  const { t } = useLanguage();
  const displayBackLabel = backLabel || t("common.back");

  return (
    <div className={cn("space-y-6 animate-in slide-in-from-top-4 duration-700", className)}>
      {backHref && (
        <Link href={backHref}>
          <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-[0.2em] transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {displayBackLabel}
          </button>
        </Link>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className={cn(
            "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex shrink-0 items-center justify-center text-white shadow-lg",
            iconColor
          )}>
            {icon}
          </div>
          <div className="min-w-0">
            <h1 className="whitespace-nowrap text-[1.85rem] sm:text-4xl font-black text-slate-800 tracking-tighter italic leading-none">
              {title}
            </h1>
            <p className="mt-1.5 flex items-start gap-1.5 text-[10px] font-bold uppercase leading-snug tracking-tight text-slate-400 sm:mt-2 sm:items-center sm:gap-2 sm:text-xs">
              <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-amber-500 sm:mt-0" />
              <span>{subtitle}</span>
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
