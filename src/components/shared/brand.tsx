import React from "react";
import { cn } from "@/lib/utils";

type BrandSize = "sm" | "md" | "lg" | "xl" | "2xl";

interface BrandProps {
  size?: BrandSize;
  className?: string;
  as?: "h1" | "div" | "span" | "p";
  inline?: boolean;
}

const sizeClasses: Record<BrandSize, string> = {
  sm: "text-sm",
  md: "text-base md:text-lg",
  lg: "text-xl md:text-2xl",
  xl: "text-3xl md:text-4xl",
  "2xl": "text-4xl md:text-5xl",
};

export function Brand({ 
  size = "md", 
  className, 
  as: Component = "div",
  inline = false
}: BrandProps) {
  return (
    <Component 
      className={cn(
        "font-black tracking-tighter italic",
        !inline && "text-slate-800 leading-none",
        !inline && sizeClasses[size],
        className
      )}
    >
      {!inline && "Egal"}<span className={cn("text-primary", inline && "italic")}>{inline ? "EgalDeutsch" : "Deutsch"}</span>
    </Component>
  );
}
