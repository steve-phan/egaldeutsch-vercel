"use client";

import { CategoryMeta } from "@/types/quiz";
import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface CategoryCardProps {
  category: CategoryMeta;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { language } = useLanguage();

  const getLabel = () => {
    switch (language) {
      case "de": return category.label.de;
      case "vi": return category.label.vi;
      case "en":
      default: return category.label.en;
    }
  };

  return (
    <Link href={`/quiz/${category.id}`} className="group block active:scale-[0.98] transition-all h-full">
      <div className="relative h-[180px] rounded-[2rem] glass-card-premium p-6 flex flex-col justify-between overflow-hidden group-hover:-translate-y-2 group-hover:shadow-floating transition-all duration-500 border border-white/40">
        {/* Background Accent Gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />

        <div className="flex justify-between items-start z-10">
           <div className="space-y-3">
              <div className="flex gap-1.5 flex-wrap">
                 {category.levels.map(lvl => (
                    <span key={lvl} className="px-2.5 py-0.5 rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground uppercase tracking-widest shadow-sm border border-white/50">
                       {lvl}
                    </span>
                 ))}
              </div>
              <h3 className="text-xl font-black text-slate-800 leading-tight tracking-tighter italic">
                 {getLabel()}
              </h3>
           </div>
           
           <div className="w-12 h-12 glass-pill flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-500">
              {category.icon}
           </div>
        </div>
        
        <div className="flex items-center justify-between z-10">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
              Explore Grammar
           </p>
           <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <ChevronRight className="w-4 h-4" />
           </div>
        </div>
      </div>
    </Link>
  );
}
