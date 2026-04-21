"use client";

import { CategoryMeta } from "@/types/quiz";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/shared/layout/card";

interface CategoryCardProps {
   category: CategoryMeta;
}

import { useLanguage } from "@/contexts/language-context";

export function CategoryCard({ category }: CategoryCardProps) {
   const { t, language } = useLanguage();

   return (
      <Link
         href={`/quiz/${category.id}`}
         className="group block active:scale-[0.98] transition-all h-full min-w-[260px] md:min-w-[300px]"
      >
         <Card
            radius="2xl"
            padding="md"
            hover
            className="h-[190px] flex flex-col justify-between overflow-hidden shadow-premium hover:shadow-2xl transition-all duration-500 border-white/60 bg-white/40"
         >
            {/* Background Accent Gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

            {/* Top Section: Levels & Title + Icon */}
            <div className="flex justify-between items-start z-10 gap-3">
               <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex gap-1.5 flex-wrap pb-2">
                     {category.levels.map(lvl => (
                        <span key={lvl} className="px-2.5 py-0.5 rounded-full bg-secondary/80 backdrop-blur-sm text-[10px] font-bold text-secondary-foreground uppercase tracking-widest shadow-sm border border-white/50">
                           {lvl}
                        </span>
                     ))}
                  </div>
                  <h3 className="text-xl font-black text-slate-800 leading-tight tracking-tighter italic line-clamp-2 min-h-[3rem]">
                     {category.label.de || category.label.en}
                  </h3>
               </div>

               <div className="w-12 h-12 flex-shrink-0 glass-pill flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 bg-white/20 border border-white/40">
                  {category.icon}
               </div>
            </div>

            {/* Bottom Section: Action & Arrow */}
            <div className="flex items-center justify-between z-10 pt-2 border-t border-slate-100/50">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
                  {t("practice.explore_grammar")}
               </p>
               <div className="w-9 h-9 rounded-full bg-white/80 shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:translate-x-1 transition-all duration-300 border border-slate-50">
                  <ChevronRight className="w-5 h-5" />
               </div>
            </div>
         </Card>
      </Link>
   );
}
