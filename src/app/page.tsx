"use client";

import { useState } from "react";
import { WeeklyGoal } from "@/components/dashboard/weekly-goal";
import { CourseCompletion } from "@/components/dashboard/course-completion";
import { CategoryGrid } from "@/components/home/category-grid";
import { LevelSelector } from "@/components/home/level-selector";
import { LanguageOnboarding } from "@/components/home/language-onboarding";
import { useCategories } from "@/hooks/use-categories";
import { useLanguage } from "@/contexts/language-context";
import { Home as HomeIcon, Book, MessageSquare, Bell, Settings } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const { language } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const { getCategoriesByLevel, loading } = useCategories();

  const categoriesToDisplay = getCategoriesByLevel(selectedLevel);

  return (
    <main className="flex min-h-screen flex-col bg-background pb-32">
      <LanguageOnboarding />
      
      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-10">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-white shadow-md">
                 <Image src="/mascot.png" alt="Profile" fill className="object-contain" />
              </div>
              <div>
                 <h1 className="text-2xl font-black text-slate-800 tracking-tight">Student Dashboard</h1>
                 <p className="text-sm font-bold text-slate-400">Guten Tag, Ben!</p>
              </div>
           </div>
           <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400">
              <Bell className="w-5 h-5" />
           </button>
        </div>

        {/* Hero Section / Your E-Learning Status */}
        <div className="flex items-center gap-8 mb-12 bg-secondary/50 p-8 rounded-[3rem] border border-white relative overflow-hidden">
           <div className="flex-1 z-10">
              <h2 className="text-4xl font-black text-slate-800 mb-4 leading-tight">
                Your e-learning journey!
              </h2>
              <p className="text-lg font-bold text-slate-500 max-w-md">
                Master German grammar with your personal study path.
              </p>
           </div>
           <div className="relative w-40 h-40 hidden md:block">
              <Image src="/mascot.png" alt="Fox" fill className="object-contain" />
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
          <WeeklyGoal />
          <CourseCompletion />
        </div>

        {/* Lessons Section */}
        <section className="mb-16">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-800">
                {language === "de" ? "Deine Lektionen" : language === "vi" ? "Bài học hôm nay" : "Today's Lesson"}
              </h2>
              <LevelSelector selectedLevel={selectedLevel} onSelectLevel={setSelectedLevel} />
           </div>
           
           <CategoryGrid categories={categoriesToDisplay} loading={loading} />
        </section>

        {/* Social / Social Placeholder */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-800">Social</h2>
            <button className="text-sm font-bold text-primary">See All</button>
          </div>
          <div className="flex gap-4">
             {["Deutsch", "Blue", "Yellow", "Roden"].map((name) => (
                <div key={name} className="flex flex-col items-center gap-2">
                   <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center overflow-hidden border border-slate-100">
                      <Image src="/mascot.png" alt={name} width={40} height={40} className="opacity-50 grayscale" />
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase">{name}</span>
                </div>
             ))}
          </div>
        </section>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-8 z-50">
         <NavItem icon={<HomeIcon />} active />
         <NavItem icon={<Book />} />
         <NavItem icon={<MessageSquare />} />
         <NavItem icon={<Bell />} />
         <NavItem icon={<Settings />} />
      </nav>
    </main>
  );
}

function NavItem({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) {
   return (
      <button className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${active ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-slate-300 hover:text-slate-400"}`}>
        {icon}
      </button>
   )
}
