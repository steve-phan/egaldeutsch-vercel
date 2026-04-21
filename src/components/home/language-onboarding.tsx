"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { ChevronRight } from "lucide-react";

export function LanguageOnboarding() {
  const { language, setLanguage, isLoaded } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoaded && mounted) {
      // Check if user has explicitly set a language before
      const hasChosen = localStorage.getItem("language_onboarding_complete");
      if (!hasChosen) {
        setIsOpen(true);
      }
    }
  }, [isLoaded, mounted]);

  const handleSelect = (lang: "en" | "de" | "vi") => {
    setLanguage(lang);
  };

  const handleFinish = () => {
    localStorage.setItem("language_onboarding_complete", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-white/40 animate-in fade-in duration-700">
      <div className="w-full max-w-md glass-card-premium rounded-[3rem] p-6 md:p-8 text-center">
        <div className="mb-8">
          <span className="text-5xl inline-block mb-4 animate-float-gentle">👋</span>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter mb-2 italic">Willkommen!</h2>
          <p className="text-slate-400 font-bold text-sm tracking-tight">Choose your learning language.</p>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-8">
          {[
            { id: "en", label: "English", flag: "🇬🇧" },
            { id: "de", label: "Deutsch", flag: "🇩🇪" },
            { id: "vi", label: "Tiếng Việt", flag: "🇻🇳" }
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleSelect(lang.id as "en" | "de" | "vi")}
              className={`p-4 rounded-2xl border-2 font-black text-sm flex items-center justify-between transition-all
                   ${language === lang.id
                  ? "bg-primary/5 border-primary text-primary shadow-sm"
                  : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"}`}
            >
              <span className="flex items-center gap-3">{lang.flag} {lang.label}</span>
              {language === lang.id && <div className="w-2 h-2 rounded-full bg-primary" />}
            </button>
          ))}
        </div>

        <button
          onClick={handleFinish}
          className="w-full btn-orange btn-compact flex items-center justify-center gap-2"
        >
          Start Learning <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
