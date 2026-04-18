"use client";

import { Idiom } from "@/types/idiom";
import { useLanguage } from "@/contexts/language-context";
import { Quote } from "lucide-react";

interface IdiomDetailProps {
  idiom: Idiom;
}

export function IdiomDetail({ idiom }: IdiomDetailProps) {
  const { language } = useLanguage();

  const getMeaning = () => {
    switch (language) {
      case "en": return idiom.meaning_en;
      case "vi": return idiom.meaning_vi;
      default: return idiom.meaning_de;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="relative text-center space-y-6 pt-8">
        <div className="inline-flex w-24 h-24 bg-white shadow-floating rounded-3xl items-center justify-center text-5xl border border-slate-100 animate-bounce-slow">
          {idiom.thumbnail || "🇩🇪"}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic leading-tight">
          {idiom.title}
        </h1>

        <div className="flex flex-col items-center gap-2">
            <p className="text-lg md:text-xl text-slate-500 font-bold max-w-2xl mx-auto leading-relaxed">
              {getMeaning()}
            </p>
            <div className="flex gap-2 mt-4">
              {idiom.tags.map((tag) => (
                <span key={tag} className="px-4 py-1.5 bg-slate-100 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-500">
                  #{tag}
                </span>
              ))}
            </div>
        </div>

        {/* Literal Translation Highlight */}
        <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8 mt-12 relative overflow-hidden">
          <Quote className="absolute -top-4 -left-4 w-24 h-24 text-primary/10 -rotate-12" />
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-widest text-primary/60 mb-2">Literal Translation</p>
            <p className="text-2xl font-black text-slate-800 italic">"{idiom.literal}"</p>
          </div>
        </div>
      </div>

      {/* Main Content (Raw HTML) */}
      <div 
        className="prose prose-slate prose-lg max-w-none 
          prose-headings:font-black prose-headings:tracking-tighter prose-headings:italic prose-headings:text-slate-900
          prose-p:text-slate-600 prose-p:leading-relaxed
          prose-strong:text-slate-800
          bg-white rounded-[3rem] p-8 md:p-12 shadow-premium border border-slate-100"
        dangerouslySetInnerHTML={{ __html: idiom.content_html }}
      />
      
      {/* Footer Meta */}
      <div className="text-center pt-8 pb-16">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
          Last Updated: {new Date(idiom.updated_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
