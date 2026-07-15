"use client";

import Link from "next/link";
import { CheckCircle2, Cloud, CloudOff, RotateCcw } from "lucide-react";
import { useGermanGrammarProgress } from "@/contexts/german-grammar-progress-context";
import type { GermanGrammarSummary } from "@/lib/german-grammar";
import { cn } from "@/lib/utils";

type Props = {
  groupedChapters: Record<string, GermanGrammarSummary[]>;
  fallbackSlug?: string;
};

export function GrammarLandingProgress({
  groupedChapters,
  fallbackSlug,
}: Props) {
  const { progress, stats, isChapterRead, isQuizPassed, isSynced, isLoading } =
    useGermanGrammarProgress();

  const allChapters = Object.values(groupedChapters).flat();
  const continueSlug =
    progress.lastReadSlug ||
    allChapters.find((chapter) => !isChapterRead(chapter.slug))?.slug ||
    fallbackSlug;

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
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-primary transition-colors hover:bg-primary/15"
          >
            <RotateCcw className="h-4 w-4" />
            Weiterlesen
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

        <div className="space-y-6">
          {Object.entries(groupedChapters).map(([part, partChapters]) => (
            <div
              key={part}
              className="rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-6"
            >
              <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">
                {part}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {partChapters.map((chapter) => {
                  const read = isChapterRead(chapter.slug);
                  const quiz = isQuizPassed(chapter.slug);

                  return (
                    <Link
                      key={chapter.slug}
                      href={`/german-grammar/${chapter.slug}`}
                      className={cn(
                        "group rounded-2xl border bg-slate-50 p-4 transition-colors hover:border-primary/20 hover:bg-primary/5",
                        read ? "border-emerald-100" : "border-slate-100",
                      )}
                    >
                      <div className="mb-2 flex flex-wrap gap-2">
                        <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                          {chapter.level}
                        </span>
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
          ))}
        </div>
      </section>
    </>
  );
}