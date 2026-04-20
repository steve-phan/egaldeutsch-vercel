"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Settings2, Clock, Hash, Zap, LayoutGrid } from "lucide-react";
import { QuizSessionConfig, CEFRLevel, QuizCategory } from "@/types/quiz";
import { Card } from "@/components/shared/layout/card";
import { CATEGORY_META } from "@/lib/constants";
import { useLanguage } from "@/contexts/language-context";
import React, { useMemo } from "react";

interface SessionSetupProps {
  category: QuizCategory;
  onStart: (config: QuizSessionConfig) => void;
}

export function SessionSetup({ category, onStart }: SessionSetupProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const [level, setLevel] = useState<CEFRLevel | "mixed">("mixed");
  const [totalQuestions, setTotalQuestions] = useState<number>(10);
  const [timeLimit, setTimeLimit] = useState<number | undefined>(undefined); // seconds

  // Persistent Settings Logic
  useEffect(() => {
    const saved = sessionStorage.getItem("egaldeutsch_quiz_setup");
    if (saved) {
      try {
        const { level: sLevel, totalQuestions: sTotal, timeLimit: sTime } = JSON.parse(saved);
        if (sLevel) setLevel(sLevel);
        if (sTotal) setTotalQuestions(sTotal);
        setTimeLimit(sTime);
      } catch (e) {
        console.error("Failed to load quiz setup from session storage", e);
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("egaldeutsch_quiz_setup", JSON.stringify({ level, totalQuestions, timeLimit }));
  }, [level, totalQuestions, timeLimit]);

  const handleStart = () => {
    onStart({
      category,
      level,
      totalQuestions,
      timePerQuestion: timeLimit,
    });
  };

  const categoryGrid = useMemo(() => (
    <div className="flex flex-wrap gap-2">
      {CATEGORY_META.map(cat => (
        <button
          key={cat.id}
          onClick={() => router.push(`/quiz/${cat.id}`)}
          className={`h-10 px-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-wider transition-all flex items-center gap-2
             ${category === cat.id
              ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
              : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"}`}
        >
          <span className={`text-base leading-none ${category === cat.id ? "" : "grayscale-[0.5]"}`}>{cat.icon}</span>
          <span>{cat.label.de || cat.label.en}</span>
        </button>
      ))}
    </div>
  ), [category, language, router]);

  return (
    <Card padding="lg" radius="3xl" className="w-full max-w-2xl animate-in zoom-in-95 duration-500 mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <Settings2 className="w-5 h-5" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tighter italic leading-none">Auf geht&apos;s!</h2>
      </div>
      <p className="text-slate-400 font-bold text-sm mb-10">Customize your session for maximum mastery.</p>

      <div className="space-y-10">
        {/* Topic Selection */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
            <LayoutGrid className="w-3 h-3" /> Mission Topic
          </label>
          {categoryGrid}
        </div>

        {/* Level Selection */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
            <Zap className="w-3 h-3" /> CEFR Level
          </label>
          <div className="flex flex-wrap gap-2">
            {["mixed", "A1", "A2", "B1", "B2"].map(l => (
              <button
                key={l}
                onClick={() => setLevel(l as CEFRLevel | "mixed")}
                className={`h-11 px-4 min-w-[64px] flex-1 sm:flex-none rounded-xl border-2 font-bold text-xs transition-all
                         ${level === l
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"}`}
              >
                {l === "mixed" ? "MIX" : l}
              </button>
            ))}
          </div>
        </div>

        {/* Total Questions */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
            <Hash className="w-3 h-3" /> Quantity
          </label>
          <div className="grid grid-cols-2 xs:grid-cols-3 gap-3">
            {[5, 10, 20].map(n => (
              <button
                key={n}
                onClick={() => setTotalQuestions(n)}
                className={`h-11 rounded-xl border-2 font-bold text-xs transition-all
                         ${totalQuestions === n
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"}`}
              >
                {n} <span className="hidden xs:inline">Questions</span>
                <span className="xs:hidden">Q.</span>
              </button>
            ))}
          </div>
        </div>

        {/* Timer Selection */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
            <Clock className="w-3 h-3" /> Pace (Per Question)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: undefined, label: "ZEN" },
              { val: 30, label: "30s" },
              { val: 60, label: "60s" }
            ].map(t => (
              <button
                key={t.label}
                onClick={() => setTimeLimit(t.val)}
                className={`h-11 rounded-xl border-2 font-bold text-xs transition-all
                         ${timeLimit === t.val
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <button
          className="w-full btn-orange h-14 md:h-16 text-lg"
          onClick={handleStart}
        >
          Start Mission <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </Card>
  );
}
