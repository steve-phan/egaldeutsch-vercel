"use client";

import React from "react";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { Navbar } from "@/components/layout/navbar";

interface AppShellProps {
  children: React.ReactNode;
  showNav?: boolean;
  showHeader?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "none";
}

export function AppShell({ 
  children, 
  showNav = true, 
  showHeader = true,
  maxWidth = "xl" 
}: AppShellProps) {
  const pathname = usePathname();
  useSession();
  
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
      <div className={`w-full ${maxWidthClasses[maxWidth]} z-10 flex flex-col min-h-screen`}>
         {showHeader && <Navbar />}
         <main className="flex-1 py-6 md:py-10 animate-in fade-in duration-700 px-4 md:px-8">
            {children}
         </main>
         <Footer />
      </div>

      {/* Conditional Components */}
      {shouldShowNav && <BottomNav />}
      <CookieBanner />
    </div>
  );
}
