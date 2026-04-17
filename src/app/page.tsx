"use client";

import { useState } from "react";
import { Navbar } from "@/components/home/navbar";
import { HeroSection } from "@/components/home/hero-section";
import { CategoryGrid } from "@/components/home/category-grid";
import { LevelSelector } from "@/components/home/level-selector";
import { LanguageOnboarding } from "@/components/home/language-onboarding";
import { useCategories } from "@/hooks/use-categories";
import { useLanguage } from "@/contexts/language-context";

export default function Home() {
  const { language } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const { getCategoriesByLevel, loading } = useCategories();

  // Re-fetch when level selected changes
  const categoriesToDisplay = getCategoriesByLevel(selectedLevel);

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 selection:bg-indigo-100">
      <LanguageOnboarding />
      
      <Navbar />
      
      <HeroSection />

      <section className="w-full max-w-6xl px-4 md:px-8 pb-32">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
           <h2 className="text-2xl font-bold text-slate-800 mb-4 md:mb-0">
             {language === "de" ? "Kategorien" : language === "vi" ? "Chuyên mục" : "Categories"}
           </h2>
           <LevelSelector selectedLevel={selectedLevel} onSelectLevel={setSelectedLevel} />
        </div>
        
        <CategoryGrid categories={categoriesToDisplay} loading={loading} />
      </section>
    </main>
  );
}
