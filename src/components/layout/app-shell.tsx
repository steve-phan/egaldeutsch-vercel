"use client";

import React, { useEffect, useRef } from "react";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { Navbar } from "@/components/layout/navbar";

import { PageContainer } from "@/components/shared/layout/page-container";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  showNav?: boolean;
  showHeader?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "brand" | "none";
}

export function AppShell({ 
  children, 
  showNav = true, 
  showHeader = true,
  maxWidth = "xl" 
}: AppShellProps) {
  const pathname = usePathname();
  useSession();
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    function handleAudioPlay(event: Event) {
      const audio = event.target;

      if (!(audio instanceof HTMLAudioElement)) {
        return;
      }

      const activeAudio = activeAudioRef.current;

      if (activeAudio && activeAudio !== audio && !activeAudio.paused) {
        activeAudio.pause();

        try {
          activeAudio.currentTime = 0;
        } catch {
          // Some browsers can throw while seeking streams. Pausing is enough.
        }
      }

      activeAudioRef.current = audio;
    }

    function handleAudioStop(event: Event) {
      if (event.target === activeAudioRef.current) {
        activeAudioRef.current = null;
      }
    }

    document.addEventListener("play", handleAudioPlay, true);
    document.addEventListener("ended", handleAudioStop, true);

    return () => {
      document.removeEventListener("play", handleAudioPlay, true);
      document.removeEventListener("ended", handleAudioStop, true);
    };
  }, []);
  
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isReaderPage =
    pathname.startsWith("/road-to-b2/") ||
    pathname.startsWith("/road-to-c1/") ||
    pathname.startsWith("/blogs/") ||
    pathname.startsWith("/redewendung/");
  const shouldShowNav = showNav && !isAuthPage && !isReaderPage;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-x-hidden pt-px">
      {/* Premium Texture Overlay */}
      <div className="fixed inset-0 bg-noise pointer-events-none" />

      {/* Brand Background Accents - Global */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/[0.08] rounded-full blur-[120px] -translate-y-1/2" />
         <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/[0.1] rounded-full blur-[140px] translate-y-1/2" />
      </div>

      {showHeader && <Navbar />}

      <main
        className={cn(
          "flex-1 z-10 animate-in fade-in duration-700",
          shouldShowNav && "pb-24 md:pb-0",
        )}
      >
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
