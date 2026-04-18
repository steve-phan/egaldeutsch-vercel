"use client";

import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { PremiumCard } from "@/components/shared/premium-card";
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
    <PremiumCard padding="none" glow className="flex flex-col md:flex-row items-center gap-8 group h-full overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
      
      <div className="flex-1 space-y-6 relative z-10 text-center md:text-left p-8 md:p-12">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-[10px] font-black text-primary uppercase tracking-[0.2em]">
            <Sparkles className="w-3 h-3" /> Active Learning Path
         </div>
         
         <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-slate-800 leading-[0.9] tracking-tighter italic">
               {getTitle()}
            </h2>
            <p className="text-base font-bold text-slate-400 max-w-md leading-relaxed">
               {getSubtext()}
            </p>
         </div>

         <button 
           onClick={() => {
             const lessonsSection = document.getElementById('lessons-section');
             if (lessonsSection) {
               lessonsSection.scrollIntoView({ behavior: 'smooth' });
             }
           }}
           className="btn-orange h-14 px-10 mt-4 group text-lg font-black"
         >
            {getButtonText()} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
         </button>
      </div>

      <div className="relative w-48 h-48 md:w-72 md:h-72 animate-float-gentle shrink-0 group-hover:scale-105 transition-transform duration-700 md:mr-12 mb-8 md:mb-0">
         <Image 
           src="/mascot.png" 
           alt="Fox Mascot" 
           fill 
           sizes="(max-width: 768px) 192px, 288px"
           priority
           loading="eager"
           className="object-contain" 
         />
      </div>
    </PremiumCard>
  );
}
