"use client";

import { useIdioms } from "@/hooks/use-idioms";
import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";
import { ArrowRight, Sparkles, RefreshCcw } from "lucide-react";
import { PremiumCard } from "@/components/shared/premium-card";
import { useEffect } from "react";

export function RandomIdiom() {
  const { randomIdiom, randomLoading, fetchRandomIdiom } = useIdioms();
  const { language } = useLanguage();

  useEffect(() => {
    fetchRandomIdiom();
  }, [fetchRandomIdiom]);

  if (!randomIdiom && !randomLoading) return null;

  const getMeaning = () => {
    if (!randomIdiom) return "";
    switch (language) {
      case "en": return randomIdiom.meaning_en;
      case "vi": return randomIdiom.meaning_vi;
      default: return randomIdiom.meaning_de;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-slate-800 opacity-30 uppercase tracking-[0.3em] italic">Redewendung</h2>
        <div className="flex items-center gap-4">
            <button 
                onClick={() => fetchRandomIdiom()}
                disabled={randomLoading}
                className="text-[10px] font-black text-slate-400 hover:text-primary transition-colors tracking-widest uppercase flex items-center gap-1 disabled:opacity-50"
            >
                <RefreshCcw className={`w-3 h-3 ${randomLoading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <Link 
                href="/redewendung" 
                className="text-[10px] font-black text-primary/50 hover:text-primary transition-colors tracking-widest uppercase flex items-center gap-1 group"
            >
                View All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
      </div>

      <PremiumCard padding="none" className="overflow-hidden group min-h-[220px]">
        {randomIdiom ? (
            <Link href={`/redewendung/${randomIdiom.slug}`} className="flex flex-col md:flex-row items-center h-full">
                {/* Left Side: Visual / Content */}
                <div className="p-8 md:p-10 flex-1 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" /> Random Idiom
                    </div>
                    
                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter italic">
                        {randomIdiom.title}
                    </h3>
                    
                    <p className="text-sm font-bold text-slate-400 leading-relaxed max-w-md line-clamp-2">
                        {getMeaning()}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                        Read Meaning <ArrowRight className="w-3 h-3" />
                    </div>
                </div>

                {/* Right Side: Emoji Icon */}
                <div className="bg-slate-50 w-full md:w-48 h-full flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-700 min-h-[200px] md:min-h-0">
                    {randomIdiom.thumbnail || "🥨"}
                </div>
            </Link>
        ) : (
            <div className="flex items-center justify-center h-[220px] w-full bg-slate-50/50">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Waking up the fox...</p>
                </div>
            </div>
        )}
      </PremiumCard>
    </div>
  );
}
