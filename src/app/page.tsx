"use client";

import { useLessons } from "@/hooks/use-lessons";
import { Navbar } from "@/components/home/navbar";
import { HeroSection } from "@/components/home/hero-section";
import { FeatureCard } from "@/components/home/feature-card";
import { LessonGrid } from "@/components/home/lesson-grid";

export default function Home() {
  const { lessons, loading } = useLessons();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-slate-50">
      <Navbar />

      <HeroSection />

      {/* Feature Cards */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <FeatureCard
          href="/quiz-demo"
          icon="🎯"
          title="Quiz Demo"
          description="Try our interactive quiz types"
        />
        <FeatureCard
          href="/vocabulary-demo"
          icon="📚"
          title="Vocabulary Learning"
          description="Baicizhan-inspired flashcards & daily goals"
          className="border-orange-200 bg-orange-50"
        />
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        <LessonGrid lessons={lessons} loading={loading} />
      </div>
    </main>
  );
}
