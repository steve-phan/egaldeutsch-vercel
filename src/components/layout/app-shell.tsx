"use client";

import React from "react";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { Navbar } from "@/components/layout/navbar";

import { PageContainer } from "@/components/shared/layout/page-container";

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
  
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const shouldShowNav = showNav && !isAuthPage;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative overflow-x-hidden">
      {/* Premium Background Accents - Global */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
         <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] translate-y-1/2" />
      </div>

      {showHeader && <Navbar />}

      <main className="flex-1 z-10 animate-in fade-in duration-700">
         <PageContainer maxWidth={maxWidth}>
            {children}
         </PageContainer>
      </main>

      <Footer />

      {/* Conditional Components */}
      {shouldShowNav && <BottomNav />}
      <CookieBanner />
    </div>
  );
}
