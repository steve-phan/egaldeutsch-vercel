"use client";

import { useSession } from "next-auth/react";
import { useCategories } from "@/hooks/use-categories";
import { CategoryGrid } from "@/components/home/category-grid";
import { HeroQuizCard } from "@/components/home/hero-quiz-card";
import { RandomIdiom } from "@/components/idioms/random-idiom";
import { PurposeSection } from "@/components/home/purpose-section";
import { GuestConversionBanner } from "@/components/home/guest-conversion-banner";
import { LanguageOnboarding } from "@/components/home/language-onboarding";
import { AppShell } from "@/components/layout/app-shell";
import { Section } from "@/components/shared/layout/section";

export function HomeClientView() {
   const { status } = useSession();
   const { getAllCategories, loading } = useCategories();

   const categories = getAllCategories();
   const isGuest = status === "unauthenticated";

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

            {/* Featured Idiom Section */}
            <RandomIdiom />

            {/* Main Content Area */}
            <Section spacing="md" id="lessons-section">
               <div className="space-y-8">
                  <div className="flex items-center gap-3">
                     <h2 className="text-xl font-black text-slate-800 tracking-tighter italic leading-none">Grammar Modules</h2>
                     <div className="h-0.5 flex-1 bg-slate-100/50 rounded-full" />
                  </div>
                  <CategoryGrid categories={categories} loading={loading} />
               </div>
            </Section>
         </div>
      </AppShell>
   );
}
