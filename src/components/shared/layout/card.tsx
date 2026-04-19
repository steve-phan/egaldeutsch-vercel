"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  hover?: boolean;
  glow?: boolean;
  glass?: boolean;
  border?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const paddings = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8 md:p-10",
  xl: "p-10 md:p-16",
};

const radii = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-[2.5rem]",
  full: "rounded-full",
};

export function Card({ 
  children, 
  className, 
  padding = "md",
  radius = "3xl",
  hover = false,
  glow = false,
  glass = true,
  border = true,
  style,
  onClick
}: CardProps) {
  return (
    <div 
      onClick={onClick}
      style={style}
      className={cn(
        "relative overflow-hidden transition-all duration-500",
        glass && "glass-card-premium backdrop-blur-xl",
        border && "border border-white/40",
        hover && "hover-lift-premium cursor-pointer",
        !glass && "bg-white",
        radii[radius],
        paddings[padding],
        className
      )}
    >
      {glow && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
      )}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
