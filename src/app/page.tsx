"use client";

import { useState } from "react";
import { WeeklyGoal } from "@/components/dashboard/weekly-goal";
import { CourseCompletion } from "@/components/dashboard/course-completion";
import { CategoryGrid } from "@/components/home/category-grid";
import { LevelSelector } from "@/components/home/level-selector";
import { LanguageOnboarding } from "@/components/home/language-onboarding";
import { useCategories } from "@/hooks/use-categories";
import { useLanguage } from "@/contexts/language-context";
import { DashboardHeader } from "@/components/dashboard/header";
import { GuestHeader } from "@/components/layout/guest-header";
import { GuestConversionBanner } from "@/components/home/guest-conversion-banner";
import { AppShell } from "@/components/layout/app-shell";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { PremiumCard } from "@/components/shared/premium-card";
import { ArrowRight } from "lucide-react";

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
      
      {isGuest ? <GuestHeader /> : <DashboardHeader />}

      <section className="w-full max-w-5xl mx-auto">
        {/* Hero / Welcome Context */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
           {isGuest ? (
             <div className="lg:col-span-12">
                <GuestConversionBanner />
             </div>
           ) : (
             <>
               {/* Logged In Hero Card */}
               <div className="lg:col-span-8">
                  <PremiumCard padding="none" glow className="flex flex-col md:flex-row items-center gap-8 group h-full">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
                    
                    <div className="flex-1 space-y-4 relative z-10 text-center md:text-left p-8 md:p-10">
                       <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                          Active Learning Path
                       </div>
                       <h2 className="text-4xl md:text-5xl font-black text-slate-800 leading-[0.9] tracking-tighter italic">
                          Tschüss, <br className="hidden md:block" /> Language Barriers!
                       </h2>
                       <p className="text-sm font-bold text-slate-400 max-w-md">
                          You&apos;re 12% closer to your B1 certificate. Keep the momentum!
                       </p>
                       <button className="btn-orange h-12 px-8 rounded-2xl flex items-center gap-2 group mt-2 font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95">
                          Continue Quiz <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                       </button>
                    </div>

                    <div className="relative w-40 h-40 md:w-56 md:h-56 animate-float-gentle shrink-0 group-hover:scale-110 transition-transform duration-700 md:mr-10">
                       <Image 
                         src="/mascot.png" 
                         alt="Fox Mascot" 
                         fill 
                         sizes="(max-width: 768px) 160px, 224px"
                         priority
                         className="object-contain" 
                       />
                    </div>
                  </PremiumCard>
               </div>

               {/* Stats Widgets Stack */}
               <div className="lg:col-span-4 flex flex-col gap-6">
                  <WeeklyGoal />
                  <div className="flex-1">
                     <CourseCompletion />
                  </div>
               </div>
             </>
           )}
        </div>

        {/* Lessons Section */}
        <section className="mb-12">
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
                    <PremiumCard padding="sm" className="w-14 h-14 rounded-2xl flex items-center justify-center animate-none group" delay={i*50}>
                       <Image 
                         src="/mascot.png" 
                         alt={name} 
                         width={32} 
                         height={32} 
                         className="opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all group-hover:scale-110" 
                       />
                    </PremiumCard>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-primary transition-colors">{name}</span>
                 </div>
              ))}
           </div>
        </section>
      </section>
    </AppShell>
  );
}
