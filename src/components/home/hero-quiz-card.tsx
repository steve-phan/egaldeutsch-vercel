"use client";

import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/shared/layout/card";
import { Section } from "@/components/shared/layout/section";
import { useLanguage } from "@/contexts/language-context";

export function HeroQuizCard() {
  const { language } = useLanguage();

  const getTitle = () => {
    switch (language) {
      case "de": return "Tschüss, Sprachbarrieren!";
      case "vi": return "Tạm biệt rào cản ngôn ngữ!";
      default: return "Tschüss, Language Barriers!";
    }
  };

  const getSubtext = () => {
    switch (language) {
      case "de": return "Meistere die deutsche Grammatik mit interaktiven Übungen, die auf dein Niveau zugeschnitten sind.";
      case "vi": return "Chinh phục ngữ pháp tiếng Đức với các bài tập tương tác được thiết kế riêng cho trình độ của bạn.";
      default: return "Master German grammar with interactive exercises tailored for your level.";
    }
  };

  const getButtonText = () => {
    switch (language) {
      case "de": return "Quiz starten";
      case "vi": return "Bắt đầu Quiz";
      default: return "Start Quiz";
    }
  };

  return (
    <Section spacing="sm">
      <Card padding="none" glow className="group h-full">
        {/* Premium Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:bg-primary/10 transition-colors pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full -ml-24 -mb-24 blur-[60px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 opacity-50 group-hover:opacity-100 transition-opacity" />

        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10 p-3 sm:p-8 md:p-14 lg:p-16 text-balance">
          {/* Content Side */}
          <div className="flex-1 space-y-6 md:space-y-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-[10px] md:text-[11px] font-black text-primary uppercase tracking-[0.2em] border border-primary/5">
              <Sparkles className="w-3.5 h-3.5" /> Active Learning Path
            </div>

            <div className="space-y-4 md:space-y-5">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 leading-[1.05] md:leading-[1.05] tracking-tighter italic">
                {getTitle()}
              </h2>
              <p className="text-base md:text-lg font-bold text-slate-400 max-w-md mx-auto md:mx-0 leading-relaxed">
                {getSubtext()}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center md:justify-start">
              <button
                onClick={() => {
                  const lessonsSection = document.getElementById('lessons-section');
                  if (lessonsSection) {
                    lessonsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="btn-orange h-14 md:h-16 px-10 md:px-12 group text-base md:text-xl font-black shadow-premium active-bounce transition-all"
              >
                {getButtonText()} <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1.5 transition-transform" />
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
