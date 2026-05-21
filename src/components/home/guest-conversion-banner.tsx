"use client";

import { Sparkles, ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/shared/layout/card";
import { Section } from "@/components/shared/layout/section";
import { Brand } from "@/components/shared/brand";

import { useLanguage } from "@/contexts/language-context";

export function GuestConversionBanner() {
   const { t } = useLanguage();

   return (
      <Section spacing="sm">
         <Card
            padding="none"
            className="w-full group overflow-hidden bg-[#F1F5F9] border-slate-200/50 shadow-xl shadow-slate-200/20"
         >
            {/* Metallic Gloss Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between relative min-h-[360px] md:min-h-[420px]">
               {/* Content Side */}
               <div className="p-8 md:p-14 space-y-6 flex-1 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border border-slate-100">
                     <Sparkles className="w-3 h-3 text-primary" /> {t("home.guest.badge")}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[0.85] tracking-tighter italic uppercase">
                     {t("home.guest.title_prefix")} <Brand /> <br />
                     <span className="text-primary italic">{t("home.guest.title_highlight")}</span>
                  </h1>
                  <p className="text-sm md:text-base font-bold text-slate-500 max-w-md leading-relaxed px-1">
                     {t("home.guest.subtitle")}
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                     <Link href="/signup">
                        <button className="btn-orange h-14 md:h-16 px-12 text-sm group-hover:scale-105 transition-all shadow-xl shadow-primary/20 rounded-full font-black w-full sm:w-auto justify-center">
                           {t("home.guest.cta")} <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                     </Link>
                     <Link href="/estimate">
                        <button className="h-14 md:h-16 px-12 bg-white/50 hover:bg-white/80 backdrop-blur-md rounded-full text-slate-800 text-sm font-black border border-slate-200 transition-all w-full sm:w-auto flex items-center justify-center">
                           {t("home.hero.estimate_btn")}
                        </button>
                     </Link>
                  </div>
               </div>

               {/* Design Side - Subtle Silhouette */}
               <div className="hidden md:flex w-1/3 h-full absolute right-0 bottom-0 opacity-[0.03] pointer-events-none items-end justify-end">
                  <div className="text-[240px] leading-none select-none grayscale">🏙️</div>
               </div>
            </div>
         </Card>
      </Section>
   );
}
