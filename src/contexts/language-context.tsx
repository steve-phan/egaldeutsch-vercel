"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "@/i18n/en";
import { de } from "@/i18n/de";
import { vi } from "@/i18n/vi";

export type Language = "en" | "de" | "vi";

type Dictionary = typeof en;
const dictionaries: Record<Language, Dictionary> = { en, de, vi };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Try to load language from localStorage
    const saved = localStorage.getItem("preferred_language") as Language;
    if (saved && ["en", "de", "vi"].includes(saved)) {
      setLanguageState(saved);
    } else {
      // Auto-detect based on browser language
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === "de") setLanguageState("de");
      else if (browserLang === "vi") setLanguageState("vi");
      // keep English as default
    }
    setIsLoaded(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferred_language", lang);
  };

  // Helper to get nested translation value (e.g. "common.start")
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = dictionaries[language];
    
    for (const k of keys) {
      if (value === undefined) break;
      value = value[k];
    }
    
    if (typeof value === "string") return value;
    
    // Fallback if key missing
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
