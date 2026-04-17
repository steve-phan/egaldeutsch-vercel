"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { ChevronRight } from "lucide-react";

export function LanguageOnboarding() {
  const { language, setLanguage, isLoaded } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      // Check if user has explicitly set a language before
      const hasChosen = localStorage.getItem("language_onboarding_complete");
      if (!hasChosen) {
        setIsOpen(true);
      }
    }
  }, [isLoaded]);

  const handleSelect = (lang: "en" | "de" | "vi") => {
    setLanguage(lang);
  };

  const handleFinish = () => {
    localStorage.setItem("language_onboarding_complete", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-white/40 animate-in fade-in duration-500">
      <Card className="w-full max-w-lg shadow-2xl border-none">
        <CardContent className="p-8 md:p-12 text-center">
          <div className="mb-8">
            <span className="text-6xl inline-block mb-6 animate-bounce">👋</span>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome to EgalDeutsch</h2>
            <p className="text-slate-500 text-lg">Before we start, choose your preferred language for interfaces and grammar explanations.</p>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-10">
            <button
               onClick={() => handleSelect("en")}
               className={`p-4 rounded-xl border-2 font-bold text-lg flex items-center justify-between transition-all
                  ${language === "en" ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm scale-100" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 scale-95 hover:scale-100"}`}
            >
               <span className="flex items-center gap-3">🇬🇧 English</span>
               {language === "en" && <div className="w-3 h-3 rounded-full bg-indigo-500" />}
            </button>
            <button
               onClick={() => handleSelect("de")}
               className={`p-4 rounded-xl border-2 font-bold text-lg flex items-center justify-between transition-all
                  ${language === "de" ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm scale-100" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 scale-95 hover:scale-100"}`}
            >
               <span className="flex items-center gap-3">🇩🇪 Deutsch</span>
               {language === "de" && <div className="w-3 h-3 rounded-full bg-indigo-500" />}
            </button>
            <button
               onClick={() => handleSelect("vi")}
               className={`p-4 rounded-xl border-2 font-bold text-lg flex items-center justify-between transition-all
                  ${language === "vi" ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm scale-100" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 scale-95 hover:scale-100"}`}
            >
               <span className="flex items-center gap-3">🇻🇳 Tiếng Việt</span>
               {language === "vi" && <div className="w-3 h-3 rounded-full bg-indigo-500" />}
            </button>
          </div>

          <Button 
            size="lg" 
            onClick={handleFinish}
            className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg"
          >
            Continue to App <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
