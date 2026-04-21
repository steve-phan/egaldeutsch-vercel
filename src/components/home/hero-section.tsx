"use client";

import { useLanguage } from "@/contexts/language-context";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="text-center max-w-3xl mx-auto mb-16 pt-8">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        New: A1 - B2 Content Available
      </div>
      
      <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 mb-6 tracking-tight leading-tight">
        {t("home.heroTitle")}
      </h1>
      
      <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
        {t("home.heroSubtitle")}
      </p>
    </section>
  );
}
