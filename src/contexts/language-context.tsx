"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "@/i18n/en";
import { de } from "@/i18n/de";
import { vi } from "@/i18n/vi";
import { useSession } from "next-auth/react";

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
  const [state, setState] = useState<{ language: Language; isLoaded: boolean }>({
    language: "en",
    isLoaded: false
  });

  useEffect(() => {
    // Try to load language from localStorage
    const saved = localStorage.getItem("language") as Language;
    let initialLang: Language = "en";

    if (saved && ["en", "de", "vi"].includes(saved)) {
      initialLang = saved;
    } else {
      // Auto-detect based on browser language
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === "de") initialLang = "de";
      else if (browserLang === "vi") initialLang = "vi";
    }

    // We update state in the next tick to avoid cascading render warnings 
    // and ensure hydration consistency.
    setTimeout(() => {
      setState({ language: initialLang, isLoaded: true });
    }, 0);
  }, []);

  const { data: session } = useSession();

  // Sync language with user profile if logged in
  useEffect(() => {
    if (session?.user) {
      const userLang = (session.user as { language?: string }).language as Language;
      if (userLang && ["en", "de", "vi"].includes(userLang) && userLang !== state.language) {
        // We update state in the next tick to avoid cascading render warnings
        setTimeout(() => {
          setState(prev => ({ ...prev, language: userLang }));
        }, 0);
      }
    }
  }, [session, state.language]);


  const setLanguage = (lang: Language) => {
    setState(prev => ({ ...prev, language: lang }));
    localStorage.setItem("language", lang);
  };

  // Helper to get nested translation value (e.g. "common.start")
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: unknown = dictionaries[state.language];

    for (const k of keys) {
      if (value === undefined || value === null) break;
      value = (value as Record<string, unknown>)[k];
    }

    if (typeof value === "string") return value;

    // Fallback if key missing
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language: state.language, setLanguage, t, isLoaded: state.isLoaded }}>
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
