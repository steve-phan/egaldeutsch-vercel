"use client";

import React from "react";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

interface AppShellProps {
  children: React.ReactNode;
  showNav?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "none";
}

export function AppShell({ 
  children, 
  showNav = true, 
  maxWidth = "xl" 
}: AppShellProps) {
  const pathname = usePathname();
  const { status } = useSession();
  
  // Hide nav on specific routes if needed (e.g., login, certain quiz states)
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const shouldShowNav = showNav && !isAuthPage;

  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    none: "max-w-none",
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center relative overflow-x-hidden">
      {/* Premium Background Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
         <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] translate-y-1/2" />
      </div>

      {/* Content Container */}
      <div className={`w-full ${maxWidthClasses[maxWidth]} px-6 z-10 flex flex-col flex-1`}>
         <main className="flex-1 py-8 pb-32 animate-in fade-in duration-700">
            {children}
         </main>
      </div>

      {/* Conditional Navigation */}
      {shouldShowNav && <BottomNav />}
    </div>
  );
}
