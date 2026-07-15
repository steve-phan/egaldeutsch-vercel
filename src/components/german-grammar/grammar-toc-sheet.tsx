"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, X } from "lucide-react";
import type { GermanGrammarSummary } from "@/lib/german-grammar";
import type { GrammarLevel } from "@/lib/german-grammar-manifest";
import {
  GRAMMAR_LEVELS,
  getLevelProgress,
  groupChaptersByLevel,
} from "@/lib/german-grammar-navigation";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  chapters: GermanGrammarSummary[];
  currentSlug: string;
  isChapterRead: (slug: string) => boolean;
  isQuizPassed: (slug: string) => boolean;
};

export function GrammarTocSheet({
  open,
  onClose,
  chapters,
  currentSlug,
  isChapterRead,
  isQuizPassed,
}: Props) {
  const currentChapter = chapters.find((chapter) => chapter.slug === currentSlug);
  const activeLevel = currentChapter?.level ?? "A1";
  const listRef = useRef<HTMLDivElement>(null);
  const currentItemRef = useRef<HTMLAnchorElement>(null);

  const byLevel = useMemo(() => groupChaptersByLevel(chapters), [chapters]);

  const isLessonComplete = (slug: string) =>
    isChapterRead(slug) && isQuizPassed(slug);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      currentItemRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [open, activeLevel, currentSlug]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Inhaltsverzeichnis schließen"
      />

      <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[2rem] border border-slate-100 bg-white shadow-floating">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-primary">
              Inhaltsverzeichnis
            </p>
            <p className="mt-1 text-sm font-bold text-slate-500">
              Springe zu einem Kapitel
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600"
            aria-label="Schließen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none">
          {GRAMMAR_LEVELS.map((level) => {
            const { done, total } = getLevelProgress(
              chapters,
              isLessonComplete,
              level,
            );
            const isActive = level === activeLevel;

            return (
              <button
                key={level}
                type="button"
                onClick={() => {
                  const section = listRef.current?.querySelector(
                    `[data-level="${level}"]`,
                  );
                  section?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-600",
                )}
              >
                {level} {done}/{total}
              </button>
            );
          })}
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          {GRAMMAR_LEVELS.map((level) => {
            const levelChapters = byLevel[level];
            if (levelChapters.length === 0) return null;

            return (
              <div key={level} data-level={level} className="mb-4">
                <p className="sticky top-0 z-10 bg-white/95 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 backdrop-blur-sm">
                  {level}
                </p>
                <ul className="space-y-1">
                  {levelChapters.map((chapter) => {
                    const read = isChapterRead(chapter.slug);
                    const quiz = isQuizPassed(chapter.slug);
                    const isCurrent = chapter.slug === currentSlug;

                    return (
                      <li key={chapter.slug}>
                        <Link
                          ref={isCurrent ? currentItemRef : undefined}
                          href={`/german-grammar/${chapter.slug}`}
                          onClick={onClose}
                          className={cn(
                            "flex items-start gap-3 rounded-xl px-3 py-3 transition-colors",
                            isCurrent
                              ? "bg-primary/10 ring-1 ring-primary/20"
                              : "hover:bg-slate-50",
                          )}
                        >
                          <span className="mt-0.5 shrink-0">
                            {read ? (
                              <CheckCircle2
                                className={cn(
                                  "h-5 w-5",
                                  quiz ? "text-primary" : "text-emerald-600",
                                )}
                              />
                            ) : (
                              <Circle className="h-5 w-5 text-slate-300" />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Kap. {chapter.chapterNumber}
                            </span>
                            <span className="block text-sm font-black leading-snug text-slate-900">
                              {chapter.title}
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}