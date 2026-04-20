"use client";

import { Sparkles, ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/shared/layout/card";
import { Section } from "@/components/shared/layout/section";
import { Brand } from "@/components/shared/brand";

export function GuestConversionBanner() {
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
                     <Sparkles className="w-3 h-3 text-primary" /> Professional German Mastery
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[0.85] tracking-tighter italic uppercase">
                     Master German, <br />
                     <span className="text-primary italic">Egal Wie!</span>
                  </h1>
                  <p className="text-sm md:text-base font-bold text-slate-500 max-w-md leading-relaxed px-1">
                     Experience the growth of your language skills with our gamified platform, designed for your success.
                  </p>
                  
                  <div className="pt-4">
                    <Link href="/signup">
                       <button className="btn-orange h-14 md:h-16 px-12 text-sm group-hover:scale-105 transition-all shadow-xl shadow-primary/20 rounded-full font-black">
                          GET STARTED NOW <ArrowRight className="w-4 h-4 ml-2" />
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
