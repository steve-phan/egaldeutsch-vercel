"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "none";
}

const maxWidthClasses = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  none: "max-w-none",
};

export function PageContainer({ 
  children, 
  className, 
  maxWidth = "xl" 
}: PageContainerProps) {
  return (
    <div className={cn(
      "w-full mx-auto",
      "px-3 sm:px-6 md:px-8", // Mobile-first padding: tight on small screens
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  );
}
