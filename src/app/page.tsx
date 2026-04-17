"use client";

import { useLessons } from "@/hooks/use-lessons";
import { Navbar } from "@/components/home/navbar";
import { HeroSection } from "@/components/home/hero-section";
import { LessonGrid } from "@/components/home/lesson-grid";

export default function Home() {
  const { lessons, loading } = useLessons();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-slate-50">
      <Navbar />

      <HeroSection />

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        <LessonGrid lessons={lessons} loading={loading} />
      </div>
    </main>
  );
}
