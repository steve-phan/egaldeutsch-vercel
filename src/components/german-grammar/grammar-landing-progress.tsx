"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronDown,
  Cloud,
  CloudOff,
  RotateCcw,
} from "lucide-react";
import { useGermanGrammarProgress } from "@/contexts/german-grammar-progress-context";
import type { GermanGrammarSummary } from "@/lib/german-grammar";
import type { GrammarLevel } from "@/lib/german-grammar-manifest";
import {
  GRAMMAR_LEVELS,
  findContinueChapter,
  getLevelProgress,
  groupChaptersByLevel,
  isChapterLessonComplete,
} from "@/lib/german-grammar-navigation";
import { cn } from "@/lib/utils";

type Props = {
  chapters: GermanGrammarSummary[];
  fallbackSlug?: string;
};

function getDefaultOpenLevel(
  continueChapter: GermanGrammarSummary | null,
): GrammarLevel {
  return continueChapter?.level ?? "A1";
}

export function GrammarLandingProgress({ chapters, fallbackSlug }: Props) {
  const { progress, stats, isChapterRead, isQuizPassed, isSynced, isLoading } =
    useGermanGrammarProgress();

  const isLessonComplete = (slug: string) =>
    isChapterLessonComplete(slug, {
      hasQuiz: true,
      isRead: isChapterRead(slug),
      isQuizPassed: isQuizPassed(slug),
    });

  const continueChapter = useMemo(() => {
    const isComplete = (slug: string) =>
      isChapterLessonComplete(slug, {
        hasQuiz: true,
        isRead: isChapterRead(slug),
        isQuizPassed: isQuizPassed(slug),
      });

    return findContinueChapter(chapters, {
      lastReadSlug: progress.lastReadSlug,
      isComplete,
      learningPathOnly: true,
    });
  }, [chapters, progress.lastReadSlug, isChapterRead, isQuizPassed]);

  const continueSlug = continueChapter?.slug ?? fallbackSlug;

  const byLevel = useMemo(() => groupChaptersByLevel(chapters), [chapters]);

  const [openLevels, setOpenLevels] = useState<Set<GrammarLevel>>(
    () => new Set(["A1"]),
  );
  const [hasInitializedOpen, setHasInitializedOpen] = useState(false);

  useEffect(() => {
    if (hasInitializedOpen || isLoading) return;
    setOpenLevels(new Set([getDefaultOpenLevel(continueChapter)]));
    setHasInitializedOpen(true);
  }, [continueChapter, isLoading, hasInitializedOpen]);

  const toggleLevel = (level: GrammarLevel) => {
    setOpenLevels((current) => {
      const next = new Set(current);
      if (next.has(level)) {
        next.delete(level);
      } else {
        next.add(level);
      }
      return next;
    });
  };

  return (
    <>
      <section className="mt-8 rounded-[2rem] border border-primary/10 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-primary">
              Dein Fortschritt
            </p>
            <p className="mt-2 text-3xl font-black text-slate-950">
              {stats.readCount}/{stats.total} gelesen
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {stats.quizPassedCount} Quiz bestanden (≥75%)
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            {isLoading ? (
              <span>Fortschritt wird geladen …</span>
            ) : isSynced ? (
              <>
                <Cloud className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">Mit Konto synchronisiert</span>
              </>
            ) : (
              <>
                <CloudOff className="h-4 w-4" />
                <span>Lokal gespeichert</span>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${stats.readPercent}%` }}
          />
        </div>

        {continueSlug && (
          <Link
            href={`/german-grammar/${continueSlug}`}
            prefetch
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-primary transition-colors hover:bg-primary/15"
          >
            <RotateCcw className="h-4 w-4" />
            Weiterlesen
            {continueChapter && (
              <span className="font-bold normal-case tracking-normal text-slate-500">
                — {continueChapter.title}
              </span>
            )}
          </Link>
        )}
      </section>

      <section id="chapters" className="mt-12">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
            Inhaltsverzeichnis
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Der komplette Grammatik-Lesepfad
          </h2>
        </div>

        <div className="space-y-3">
          {GRAMMAR_LEVELS.map((level) => {
            const levelChapters = byLevel[level];
            if (levelChapters.length === 0) return null;

            const { done, total } = getLevelProgress(
              chapters,
              isLessonComplete,
              level,
            );
            const isOpen = openLevels.has(level);

            return (
              <div
                key={level}
                className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleLevel(level)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                  aria-expanded={isOpen}
                >
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-primary">
                      {level}
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {done}/{total} Kapitel abgeschlossen
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-slate-400 transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {levelChapters.map((chapter) => {
                        const read = isChapterRead(chapter.slug);
                        const quiz = isQuizPassed(chapter.slug);
                        const complete = isLessonComplete(chapter.slug);

                        return (
                          <Link
                            key={chapter.slug}
                            href={`/german-grammar/${chapter.slug}`}
                            prefetch
                            className={cn(
                              "group rounded-2xl border bg-slate-50 p-4 transition-colors hover:border-primary/20 hover:bg-primary/5",
                              complete
                                ? "border-emerald-100"
                                : read
                                  ? "border-primary/10"
                                  : "border-slate-100",
                            )}
                          >
                            <div className="mb-2 flex flex-wrap gap-2">
                              <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
                                Kapitel {chapter.chapterNumber}
                              </span>
                              {read && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Gelesen
                                </span>
                              )}
                              {quiz && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Quiz
                                </span>
                              )}
                            </div>
                            <h4 className="text-base font-black leading-snug text-slate-900 transition-colors group-hover:text-primary">
                              {chapter.title}
                            </h4>
                            <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-slate-500">
                              {chapter.description}
                            </p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}