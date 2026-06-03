"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/shared/layout/card";
import { Section } from "@/components/shared/layout/section";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

export function HeroQuizCard() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const isVietnamese = language === "vi";

  return (
    <Section spacing="sm">
      <Card padding="none" glow className="group h-full">
        {/* Zen/Growth Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:bg-primary/10 transition-colors pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full -ml-24 -mb-24 blur-[60px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 opacity-50 group-hover:opacity-100 transition-opacity" />

        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10 p-3 sm:p-8 md:p-14 lg:p-16 text-balance">
          {/* Content Side */}
          <div className="flex-1 space-y-6 md:space-y-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-[10px] md:text-[11px] font-black text-primary uppercase tracking-[0.2em] border border-primary/5">
              <Sparkles className="w-3.5 h-3.5" /> {t("home.hero.badge")}
            </div>

            <div className="space-y-4 md:space-y-5">
              <h2
                className={cn(
                  "font-black text-slate-800 tracking-tighter",
                  isVietnamese
                    ? "text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.12] not-italic"
                    : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] italic",
                )}
              >
                {t("home.hero.title")}
              </h2>
              <p className="text-base md:text-lg font-bold text-slate-400 max-w-md mx-auto md:mx-0 leading-relaxed">
                {t("home.hero.subtitle")}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center md:justify-start gap-4">
              <button
                onClick={() => router.push('/estimate')}
                className="btn-orange h-14 md:h-16 px-7 md:px-8 group text-sm md:text-base font-black shadow-premium active-bounce transition-all w-full sm:w-auto sm:min-w-[210px] whitespace-nowrap"
              >
                <span>{t("home.hero.estimate_btn")}</span>
                <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1.5 transition-transform" />
              </button>
              
              <button
                onClick={() => {
                  const lessonsSection = document.getElementById('lessons-section');
                  if (lessonsSection) {
                    lessonsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="h-14 md:h-16 px-7 md:px-8 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-[2rem] text-slate-800 text-sm md:text-base font-black border border-white/50 transition-all w-full sm:w-auto sm:min-w-[210px] whitespace-nowrap inline-flex items-center justify-center"
              >
                <span>{t("home.hero.practice_btn")}</span>
              </button>
            </div>
          </div>

          {/* Mascot Side */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-96 lg:h-96 animate-float-gentle shrink-0 group-hover:scale-105 transition-transform duration-1000 md:mr-4 lg:mr-8 mb-4 md:mb-0">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <Image
              src="/mascot.png"
              alt="Fox Mascot"
              fill
              sizes="(max-width: 640px) 200px, (max-width: 768px) 250px, (max-width: 1024px) 300px, 400px"
              priority
              loading="eager"
              className="object-contain relative z-10 drop-shadow-2xl"
            />
          </div>
        </div>
      </Card>
    </Section>
  );
}
