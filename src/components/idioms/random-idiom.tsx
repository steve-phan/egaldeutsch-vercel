"use client";

import { useIdioms } from "@/hooks/use-idioms";
import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";
import { ArrowRight, Sparkles, RefreshCcw } from "lucide-react";
import { Card } from "@/components/shared/layout/card";
import { Section } from "@/components/shared/layout/section";
import { useEffect } from "react";

import { Idiom } from "@/types/idiom";

interface RandomIdiomProps {
  initialIdiom?: Idiom | null;
}

export function RandomIdiom({ initialIdiom = null }: RandomIdiomProps) {
  const { randomIdiom: clientIdiom, randomLoading, fetchRandomIdiom } = useIdioms();
  const { language } = useLanguage();

  const randomIdiom = clientIdiom || initialIdiom;

  useEffect(() => {
    // Only fetch if we don't have an initial idiom from the server
    if (!initialIdiom) {
      fetchRandomIdiom();
    }
  }, [fetchRandomIdiom, initialIdiom]);

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
    <Section spacing="md">
      <div className="w-full">
        <Card className="sm:flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 pb-3">
            <h2 className="text-xl font-black text-slate-800 tracking-tighter italic leading-none">Redewendung</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchRandomIdiom()}
              disabled={randomLoading}
              className="text-[10px] font-black text-slate-400 hover:text-primary transition-colors tracking-widest uppercase flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCcw className={`w-3.5 h-3.5 ${randomLoading ? 'animate-spin' : ''}`} /> Update
            </button>
            <Link
              href="/redewendung"
              className="text-[10px] font-black text-primary hover:text-primary/70 transition-colors tracking-widest uppercase flex items-center gap-1 group"
            >
              Library <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </Card>

        <Card padding="none" hover className="min-h-[220px]">
          {randomIdiom ? (
            <Link href={`/redewendung/${randomIdiom.slug}`} className="flex flex-col md:flex-row items-center h-full">
              {/* Left Side: Visual / Content */}
              <div className="p-5 md:p-12 flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" /> Daily Bloom
                </div>

                <h3 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter italic leading-tight">
                  {randomIdiom.title}
                </h3>

                <p className="text-sm font-bold text-slate-400 leading-relaxed max-w-md line-clamp-2">
                  {getMeaning()}
                </p>

                <div className="pt-2 flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                  Dive Into Meaning <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              {/* Right Side: Emoji Icon */}
              <div className="bg-slate-50 w-full md:w-56 h-full flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-1000 min-h-[200px] md:min-h-0 border-l border-white/50">
                {randomIdiom.thumbnail || "🥨"}
              </div>
            </Link>
          ) : (
            <div className="flex items-center justify-center h-[260px] w-full bg-slate-50/50">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Fetching a German pearl...</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </Section>
  );
}
