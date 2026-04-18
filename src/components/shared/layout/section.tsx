"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  showBlob?: boolean;
  blobColor?: "primary" | "indigo" | "rose";
}

const spacingClasses = {
  none: "py-0",
  sm: "py-6 md:py-10",
  md: "py-10 md:py-16",
  lg: "py-16 md:py-24",
  xl: "py-24 md:py-32",
};

const blobColors = {
  primary: "bg-primary/5",
  indigo: "bg-indigo-500/5",
  rose: "bg-rose-500/5",
};

export function Section({ 
  children, 
  className, 
  id, 
  spacing = "md",
  showBlob = false,
  blobColor = "primary"
}: SectionProps) {
  return (
    <section 
      id={id} 
      className={cn(
        "relative w-full",
        spacingClasses[spacing],
        className
      )}
    >
      {showBlob && (
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full rounded-full blur-[120px] pointer-events-none -z-10",
          blobColors[blobColor]
        )} />
      )}
      {children}
    </section>
  );
}
