"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Section } from "@/components/shared/layout/section";
import { Card } from "@/components/shared/layout/card";
import { CATEGORY_META, CEFR_LEVELS } from "@/lib/constants";
import { CategoryCard } from "@/components/home/category-card";
import { GraduationCap, Sparkles, Filter, Target, Zap, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";

import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";

export default function PracticeLandingPage() {
  const { t } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<string | "all">("all");

  const filteredCategories = selectedLevel === "all"
    ? CATEGORY_META
    : CATEGORY_META.filter(cat => cat.levels.includes(selectedLevel as any));

  return (
    <AppShell showNav={true} maxWidth="2xl">
      {/* Hero Section - Optimized for Desktop */}
      <Section spacing="lg" className="pt-8 md:pt-16">
        <div className="relative overflow-hidden rounded-[3rem] bg-primary p-8 md:p-16 text-white shadow-2xl shadow-primary/20">
          {/* Brand-aligned Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />

          {/* Animated Background Elements */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-[100px] animate-pulse" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-black/20 blur-[100px]" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-6 animate-in slide-in-from-top-4 duration-700">
              <Sparkles className="w-4 h-4 text-orange-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-100">{t("practice.hero_tag")}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight italic mb-6 leading-[1.1]">
              Targeted <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-white">Practice</span> Hub
            </h1>

            <p className="text-lg text-slate-300 font-medium mb-8 leading-relaxed max-w-xl">
              {t("practice.hero_subtitle")}
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-2xl border border-white/5 italic">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold">{t("practice.concept_focus")}</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-2xl border border-white/5 italic">
                <Zap className="w-5 h-5 text-orange-400" />
                <span className="text-sm font-bold">{t("practice.instant_feedback")}</span>
              </div>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 top-0 hidden lg:flex items-center pr-16 pointer-events-none transition-transform hover:scale-105 duration-700">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 bg-white/20 blur-[80px] rounded-full animate-pulse" />
              <img src="/mascot.png" alt="Mascot" className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </Section>

      {/* Interactive Selection Area */}
      <Section spacing="xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Filter className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest leading-none pt-0.5">{t("practice.filter_label")}</span>
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter italic">{t("practice.filter_title")}</h2>
          </div>

          {/* Level Tabs */}
          <div className="flex p-1.5 bg-slate-100 rounded-[1.5rem] w-fit">
            <button
              onClick={() => setSelectedLevel("all")}
              className={cn(
                "px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                selectedLevel === "all" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {t("practice.all")}
            </button>
            {CEFR_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={cn(
                  "px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                  selectedLevel === level ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Category Grid - Responsive for Big Devices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="animate-in fade-in zoom-in-95 duration-500 fill-mode-both">
              <CategoryCard category={cat} />
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="w-full py-24 text-center border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50">
            <div className="text-4xl mb-4 grayscale opacity-20">🏜️</div>
            <p className="text-slate-400 font-black italic">{t("practice.no_modules")}</p>
          </div>
        )}
      </Section>

      {/* Info Cards / Stats section placeholder */}
      <Section spacing="xl" className="pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card padding="xl" radius="3xl" className="bg-gradient-to-br from-indigo-50/50 to-white border-indigo-100/50 shadow-premium">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white mb-6">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-800 italic tracking-tighter mb-4">{t("practice.exam_ready_title")}</h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
              {t("practice.exam_ready_desc")}
            </p>
          </Card>

          <Card padding="xl" radius="3xl" className="bg-gradient-to-br from-primary/5 to-white border-primary/10 shadow-premium">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-800 italic tracking-tighter mb-4">{t("practice.daily_streak_title")}</h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">
              {t("practice.daily_streak_desc")}
            </p>
          </Card>

          <Card padding="xl" radius="3xl" className="bg-gradient-to-br from-emerald-50/50 to-white border-emerald-100 shadow-premium group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <FileDown className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-800 italic tracking-tighter mb-4">Offline Lernen</h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">
              Lade dir individuelle Übungsblätter als PDF herunter – perfekt zum Ausdrucken und für unterwegs.
            </p>
            <Link href="/uebungsmaterial">
              <button className="flex items-center gap-2 text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-[0.2em] transition-colors">
                Jetzt erstellen <Sparkles className="w-3 h-3" />
              </button>
            </Link>
          </Card>
        </div>
      </Section>
    </AppShell>
  );
}
