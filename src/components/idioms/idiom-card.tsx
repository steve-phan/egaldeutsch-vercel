"use client";

import Link from "next/link";
import { Idiom } from "@/types/idiom";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface IdiomCardProps {
  idiom: Idiom;
}

export function IdiomCard({ idiom }: IdiomCardProps) {
  const { language } = useLanguage();

  const getMeaning = () => {
    switch (language) {
      case "en": return idiom.meaning_en;
      case "vi": return idiom.meaning_vi;
      default: return idiom.meaning_de;
    }
  };

  return (
    <Link
      href={`/redewendung/${idiom.slug}`}
      className="group bg-white rounded-[2rem] p-6 shadow-premium border border-slate-100 hover:border-primary/20 hover:shadow-floating transition-all duration-500 flex flex-col h-full relative overflow-hidden"
    >
      {/* Background Micro-animation */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-500">
          {idiom.thumbnail || "🇩🇪"}
        </div>

        <h3 className="text-xl font-black text-slate-800 tracking-tighter italic mb-2 group-hover:text-primary transition-colors">
          {idiom.title}
        </h3>

        <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2">
          {getMeaning()}
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex gap-2">
            {idiom.tags && idiom.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">
                {tag}
              </span>
            ))}
          </div>

          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
