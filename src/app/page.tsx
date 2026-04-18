"use client";

import { useState } from "react";
import { CategoryGrid } from "@/components/home/category-grid";
import { LevelSelector } from "@/components/home/level-selector";
import { LanguageOnboarding } from "@/components/home/language-onboarding";
import { HeroQuizCard } from "@/components/home/hero-quiz-card";
import { useCategories } from "@/hooks/use-categories";
import { useLanguage } from "@/contexts/language-context";
import { DashboardHeader } from "@/components/dashboard/header";
import { GuestHeader } from "@/components/layout/guest-header";
import { GuestConversionBanner } from "@/components/home/guest-conversion-banner";
import { AppShell } from "@/components/layout/app-shell";
import { useSession } from "next-auth/react";
import { HeaderSkeleton, HeroSkeleton } from "@/components/layout/header-skeleton";
import { RandomIdiom } from "@/components/idioms/random-idiom";

export default function Home() {
  const { language } = useLanguage();
  const { status } = useSession();
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const { getCategoriesByLevel, loading } = useCategories();

  const categoriesToDisplay = getCategoriesByLevel(selectedLevel);
  const isGuest = status === "unauthenticated";

  return (
    <AppShell showNav={true} maxWidth="none">
      <LanguageOnboarding />
      
      {status === "loading" ? (
        <div className="w-full max-w-5xl mx-auto">
          <HeaderSkeleton />
          <div className="mt-6 md:mt-10">
            <HeroSkeleton />
          </div>
        </div>
      ) : (
        <>
          <div className="w-full max-w-5xl mx-auto">
            {isGuest ? <GuestHeader /> : <DashboardHeader />}
          </div>

          <section className="w-full max-w-5xl mx-auto">
            {/* Hero / Welcome Context */}
            <div className="mb-12">
               {isGuest ? (
                  <GuestConversionBanner />
               ) : (
                  <HeroQuizCard />
               )}
            </div>

            {/* Random Idiom Section */}
            <section className="mb-12">
               <RandomIdiom />
            </section>

            {/* Lessons Section */}
            <section id="lessons-section" className="mb-12">
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                  <div>
                     <h2 className="text-3xl font-black text-slate-800 tracking-tighter italic">
                        {language === "de" ? "Deine Lektionen" : language === "vi" ? "Bài học hôm nay" : "Your Lessons"}
                     </h2>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Curated Grammar Modules</p>
                  </div>
                  <LevelSelector selectedLevel={selectedLevel} onSelectLevel={setSelectedLevel} />
               </div>
               
               <CategoryGrid categories={categoriesToDisplay} loading={loading} />
            </section>

            {/* Community / Social Highlights */}
            <section className="mb-20">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-slate-800 opacity-30 uppercase tracking-[0.3em] italic">Social</h2>
                  <button className="text-[10px] font-black text-primary/50 hover:text-primary transition-colors tracking-widest uppercase">Leaderboard</button>
               </div>
               
               <div className="flex flex-wrap gap-6">
                  {["Deutsch", "Blue", "Yellow", "Roden", "Keks"].map((name, i) => (
                     <div key={name} className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group hover:border-primary/20 hover:bg-white hover:shadow-premium transition-all duration-300">
                           <span className="text-lg grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all">🦊</span>
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-primary transition-colors">{name}</span>
                     </div>
                  ))}
               </div>
            </section>
          </section>
        </>
      )}
    </AppShell>
  );
}
