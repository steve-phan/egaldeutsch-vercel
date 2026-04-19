"use client";

import { useSession } from "next-auth/react";
import { HeroQuizCard } from "@/components/home/hero-quiz-card";
import { PurposeSection } from "@/components/home/purpose-section";
import { GuestConversionBanner } from "@/components/home/guest-conversion-banner";
import { LanguageOnboarding } from "@/components/home/language-onboarding";
import { AppShell } from "@/components/layout/app-shell";

import { Session } from "next-auth";

interface HomeClientViewProps {
   initialSession: Session | null;
   children?: React.ReactNode;
}

export function HomeClientView({ initialSession, children }: HomeClientViewProps) {
   const { status } = useSession();

   // Use server-side status during hydration, then sync with client-side status
   const isGuest = status === "loading"
      ? initialSession === null
      : status === "unauthenticated";

   return (
      <AppShell showNav={true} maxWidth="lg">
         <LanguageOnboarding />

         <div className="w-full">
            {/* Hero / Welcome Context */}
            {isGuest ? (
               <>
                  <GuestConversionBanner />
                  <PurposeSection />
               </>
            ) : (
               <HeroQuizCard />
            )}

            {children}
         </div>
      </AppShell>
   );
}
