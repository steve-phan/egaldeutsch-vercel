"use client";

import { useState } from "react";
import { WeeklyGoal } from "@/components/dashboard/weekly-goal";
import { CourseCompletion } from "@/components/dashboard/course-completion";
import { CategoryGrid } from "@/components/home/category-grid";
import { LevelSelector } from "@/components/home/level-selector";
import { LanguageOnboarding } from "@/components/home/language-onboarding";
import { useCategories } from "@/hooks/use-categories";
import { useLanguage } from "@/contexts/language-context";
import { DashboardHeader } from "@/components/dashboard/header";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import Image from "next/image";

export default function Home() {
  const { language } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const { getCategoriesByLevel, loading } = useCategories();

  const categoriesToDisplay = getCategoriesByLevel(selectedLevel);

  return (
    <main className="flex min-h-screen flex-col bg-background pb-24">
      <LanguageOnboarding />
      
      <DashboardHeader />

      <section className="w-full max-w-5xl mx-auto px-6">
        {/* Hero Section / Your E-Learning Status */}
        <div className="flex items-center gap-6 mb-8 bg-secondary/50 p-6 md:p-8 rounded-[3rem] border border-white relative overflow-hidden group hover:shadow-xl transition-shadow duration-500">
           <div className="flex-1 z-10">
              <h2 className="text-4xl font-black text-slate-800 mb-4 leading-tight">
                Your e-learning journey!
              </h2>
              <p className="text-lg font-bold text-slate-500 max-w-md">
                Master German grammar with your personal study path.
              </p>
           </div>
           <div className="relative w-32 h-32 md:w-40 md:h-40 hidden md:block group-hover:scale-110 transition-transform duration-500">
              <Image 
                src="/mascot.png" 
                alt="Fox" 
                fill 
                sizes="(max-width: 768px) 0vw, 160px"
                loading="eager"
                className="object-contain" 
              />
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <WeeklyGoal />
          <CourseCompletion />
        </div>

        {/* Lessons Section */}
        <section className="mb-10">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-800">
                {language === "de" ? "Deine Lektionen" : language === "vi" ? "Bài học hôm nay" : "Today's Lesson"}
              </h2>
              <LevelSelector selectedLevel={selectedLevel} onSelectLevel={setSelectedLevel} />
           </div>
           
           <CategoryGrid categories={categoriesToDisplay} loading={loading} />
        </section>

        {/* Social Placeholder */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-800">Social</h2>
            <button className="text-sm font-bold text-primary hover:underline">See All</button>
          </div>
          <div className="flex gap-4">
             {["Deutsch", "Blue", "Yellow", "Roden"].map((name) => (
                <div key={name} className="flex flex-col items-center gap-2 group cursor-pointer">
                   <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center overflow-hidden border border-slate-100 group-hover:scale-110 transition-transform">
                      <Image src="/mascot.png" alt={name} width={40} height={40} className="opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter group-hover:text-primary transition-colors">{name}</span>
                </div>
             ))}
          </div>
        </section>
      </section>

      <BottomNav />
    </main>
  );
}

