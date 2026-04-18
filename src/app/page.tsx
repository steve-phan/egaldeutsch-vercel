"use client";

import { useState } from "react";
import { CategoryGrid } from "@/components/home/category-grid";
import { LevelSelector } from "@/components/home/level-selector";
import { LanguageOnboarding } from "@/components/home/language-onboarding";
import { HeroQuizCard } from "@/components/home/hero-quiz-card";
import { useCategories } from "@/hooks/use-categories";
import { useLanguage } from "@/contexts/language-context";
import { GuestConversionBanner } from "@/components/home/guest-conversion-banner";
import { AppShell } from "@/components/layout/app-shell";
import { useSession } from "next-auth/react";
import { HeaderSkeleton, HeroSkeleton } from "@/components/layout/header-skeleton";
import { RandomIdiom } from "@/components/idioms/random-idiom";
import { Facebook, Trophy, Users, Star } from "lucide-react";
import { PremiumCard } from "@/components/shared/premium-card";

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
          <div className="mt-6 md:mt-10">
            <HeroSkeleton />
          </div>
        </div>
      ) : (
        <>
          <section className="w-full max-w-5xl mx-auto mt-6">
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

            {/* Community & Social Section */}
            <section className="mb-24 relative">
               {/* Decorative Background Blob */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

               <div className="flex flex-col md:flex-row gap-8">
                  {/* Social Community Card */}
                  <PremiumCard glow className="flex-1 p-8 md:p-10 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-[#1877F2]/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[#1877F2]/20 transition-colors" />
                     
                     <div className="flex flex-col h-full justify-between">
                        <div className="space-y-4">
                           <div className="w-12 h-12 rounded-2xl bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] mb-6">
                              <Facebook className="w-6 h-6" />
                           </div>
                           <h3 className="text-2xl font-black text-slate-800 tracking-tighter italic leading-tight">
                              {language === "de" ? "Werde Teil der Community" : language === "vi" ? "Tham gia cộng đồng" : "Join the Community"}
                           </h3>
                           <p className="text-sm font-bold text-slate-400 max-w-sm">
                              {language === "de" ? "Vernetze dich auf Facebook, erhalte tägliche Tipps und lerne gemeinsam mit anderen." : language === "vi" ? "Kết nối trên Facebook, nhận mẹo học tiếng Đức mỗi ngày và cùng nhau tiến bộ." : "Connect on Facebook, get daily tips, and grow together with fellow learners."}
                           </p>
                        </div>

                        <div className="mt-10">
                           <a 
                              href="https://www.facebook.com/profile.php?id=61588340432355"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-[#1877F2] text-white text-xs font-black uppercase tracking-widest hover:bg-[#0d65d9] transition-all hover:shadow-lg active:scale-95"
                           >
                              {language === "de" ? "Jetzt beitreten" : language === "vi" ? "Tham gia ngay" : "Join Now"}
                              <Users className="w-4 h-4 ml-1" />
                           </a>
                        </div>
                     </div>
                  </PremiumCard>

                  {/* Leaderboard Teaser Card */}
                  <div className="w-full md:w-[320px] lg:w-[400px]">
                     <div className="h-full bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                           <Trophy className="w-8 h-8 text-slate-300" />
                        </div>
                        
                        <div className="space-y-2 relative z-10">
                           <h4 className="text-lg font-black text-slate-800 tracking-tighter italic">
                              Leaderboard
                           </h4>
                           <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              <Star className="w-2.5 h-2.5" /> Coming Soon
                           </div>
                        </div>

                        <div className="mt-8 w-full space-y-3 opacity-30 select-none pointer-events-none">
                           {[1, 2, 3].map((i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100" />
                                    <div className="w-20 h-2 bg-slate-100 rounded" />
                                 </div>
                                 <div className="w-8 h-8 rounded-lg bg-slate-50" />
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </section>
          </section>
        </>
      )}
    </AppShell>
  );
}
