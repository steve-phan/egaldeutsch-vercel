"use client";

import { useState, useMemo } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CategoryGrid } from "@/components/home/category-grid";
import { useCategories } from "@/hooks/use-categories";
import { Search, Compass, Target, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { VisualPageHeader } from "@/components/shared/visual-page-header";
import { PremiumCard } from "@/components/shared/premium-card";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";

export function ExploreClientView() {
   const { getAllCategories, loading } = useCategories();
   const { language } = useLanguage();
   const router = useRouter();
   const [search, setSearch] = useState("");

   const categories = getAllCategories();

   const featuredCategory = useMemo(() => {
      if (categories.length === 0) return null;
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
      const weekNumber = Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
      const index = (weekNumber + now.getFullYear()) % categories.length;
      return categories[index];
   }, [categories]);

   const filteredCategories = categories.filter(cat =>
      cat.label.de.toLowerCase().includes(search.toLowerCase()) ||
      cat.label.en.toLowerCase().includes(search.toLowerCase()) ||
      cat.id.toLowerCase().includes(search.toLowerCase())
   );

   return (
      <AppShell showNav={true} maxWidth="xl">
         <section className="w-full pt-10 space-y-12">
            <VisualPageHeader
               title="Discovery Centre"
               subtitle="Find your next grammar mission"
               icon={<Compass className="w-6 h-6" />}
            >
               <div className="w-full md:w-80 relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input
                     type="text"
                     placeholder="Search categories..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full h-12 pl-12 pr-6 rounded-2xl bg-white border border-slate-100 shadow-premium input-focus-premium font-bold text-sm"
                  />
               </div>
            </VisualPageHeader>

            {!search && featuredCategory && (
               <PremiumCard padding="none" glow className="h-[28rem] md:h-80 overflow-hidden animate-in zoom-in-95 duration-1000 relative group hover-lift-premium">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-600/90 to-transparent z-10" />
                  <div className="absolute inset-0 z-0">
                     <div className="absolute inset-0 flex items-center justify-end pr-20 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                        <span className="text-[20rem] select-none">{featuredCategory.icon}</span>
                     </div>
                     <Image
                        src="/mascot.png"
                        alt="Featured"
                        fill
                        className="object-cover opacity-10 grayscale mix-blend-overlay"
                     />
                  </div>

                  <div className="relative z-20 h-full p-8 md:p-12 flex flex-col justify-center items-start space-y-6 max-w-xl">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/5 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                        <Sparkles className="w-3 h-3 text-amber-400" /> Mission of the Week
                     </div>
                     <div className="space-y-3">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tighter leading-[0.9]">
                           {featuredCategory.label[language as keyof typeof featuredCategory.label] || featuredCategory.label.de}
                        </h2>
                        <p className="text-base font-bold text-indigo-100/70 leading-relaxed max-w-md">
                           {featuredCategory.description[language as keyof typeof featuredCategory.description] || featuredCategory.description.de}
                        </p>
                     </div>
                     <button
                        onClick={() => router.push(`/quiz/${featuredCategory.id}`)}
                        className="btn-white h-12 px-8 group text-[11px] font-black flex items-center gap-2 active:scale-95 transition-all"
                     >
                        Start Mission <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                     </button>
                  </div>
               </PremiumCard>
            )}

            <div className="space-y-8">
               <div className="flex items-center gap-3">
                  <h2 className="text-xl font-black text-slate-800 tracking-tighter italic">Available Modules</h2>
                  <div className="h-0.5 flex-1 bg-slate-100/50 rounded-full" />
               </div>

               <CategoryGrid categories={filteredCategories} loading={loading} />

               {filteredCategories.length === 0 && !loading && (
                  <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-md rounded-[3rem] border border-dashed border-slate-200">
                     <Target className="w-12 h-12 text-slate-200 mb-4" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching grammar mission found</p>
                  </div>
               )}
            </div>
         </section>
      </AppShell>
   );
}
