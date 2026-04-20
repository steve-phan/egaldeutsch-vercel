"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "brand" | "none";
}

const maxWidthClasses = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  "brand": "max-w-[1440px]",
  none: "max-w-none",
};

export function PageContainer({ 
  children, 
  className, 
  maxWidth = "brand" 
}: PageContainerProps) {
  return (
    <div className={cn(
      "w-full mx-auto",
      "px-6 sm:px-8 lg:px-16", // 24px mobile (Hòa Khí), 32px tablet, 64px desktop
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  );
}
