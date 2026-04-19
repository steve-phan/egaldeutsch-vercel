"use client";

import { Sparkles, ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/shared/layout/card";
import { Section } from "@/components/shared/layout/section";
import { Brand } from "@/components/shared/brand";

export function GuestConversionBanner() {
   return (
      <Section spacing="sm">
         <Card padding="lg" className="w-full group" glow>
            {/* Animated Gradient Border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/20 via-indigo-500 to-indigo-500/20" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
               <div className="space-y-4 flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                     <Trophy className="w-3 h-3" /> Mastery Awaits
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-[0.9] tracking-tighter italic">
                     Master German with <Brand as="span" inline />.
                  </h2>
                  <p className="text-sm font-bold text-slate-400 max-w-md">
                     <Brand as="span" inline className="font-bold tracking-normal italic-normal text-slate-400" /> is an interactive platform designed to help you master German grammar through gamified quizzes, structured lessons, and professional exam preparation.
                  </p>
               </div>

               <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Link href="/signup" className="w-full sm:w-auto">
                     <button className="btn-orange h-14 px-10 w-full group-hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                        Create Account <ArrowRight className="w-4 h-4" />
                     </button>
                  </Link>
               </div>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl" />
         </Card>
      </Section>
   );
}
