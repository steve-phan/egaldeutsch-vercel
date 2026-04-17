"use client";

import { Navbar } from "@/components/home/navbar";
import { HeroSection } from "@/components/home/hero-section";

// Phase 4 will add: CategoryGrid, LevelSelector, LanguageOnboarding
// For now this is the cleaned-up placeholder home page

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50">
      <Navbar />
      <HeroSection />

      <section className="w-full max-w-5xl px-8 py-12">
        <div className="text-center py-24">
          <div className="text-6xl mb-6">🇩🇪</div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Quiz System Coming Soon
          </h2>
          <p className="text-slate-500 text-lg max-w-lg mx-auto">
            We are building a comprehensive German grammar quiz system covering
            A1 to B2. Categories like Artikel, Kasus, Adjektivendungen, and more.
          </p>
        </div>
      </section>
    </main>
  );
}
