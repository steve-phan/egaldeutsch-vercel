"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, List } from "lucide-react";
import { RoadToB2Quiz } from "@/components/road-to-b2/road-to-b2-quiz";
import { GrammarLessonComplete } from "@/components/german-grammar/grammar-lesson-complete";
import { GrammarTocSheet } from "@/components/german-grammar/grammar-toc-sheet";
import { useGermanGrammarProgress } from "@/contexts/german-grammar-progress-context";
import type { RoadToB2Quiz as RoadToB2QuizType } from "@/lib/road-to-b2-quizzes";
import type { GermanGrammarSummary } from "@/lib/german-grammar";
import {
  getSmartNextChapter,
  isChapterLessonComplete,
} from "@/lib/german-grammar-navigation";

type Props = {
  chapter: GermanGrammarSummary;
  contentHtml: string;
  quiz: RoadToB2QuizType | null;
  previous: GermanGrammarSummary | null;
  next: GermanGrammarSummary | null;
  allChapters: GermanGrammarSummary[];
};

export function GrammarChapterClient({
  chapter,
  contentHtml,
  quiz,
  previous,
  next,
  allChapters,
}: Props) {
  const [tocOpen, setTocOpen] = useState(false);
  const {
    stats,
    markChapterRead,
    markQuizResult,
    isChapterRead,
    isQuizPassed,
  } = useGermanGrammarProgress();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      markChapterRead(chapter.slug);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [chapter.slug, markChapterRead]);

  const chapterRead = isChapterRead(chapter.slug);
  const quizDone = isQuizPassed(chapter.slug);
  const hasQuiz = quiz !== null;

  const lessonComplete = isChapterLessonComplete(chapter.slug, {
    hasQuiz,
    isRead: chapterRead,
    isQuizPassed: quizDone,
  });

  const smartNext = useMemo(
    () =>
      getSmartNextChapter(chapter.slug, allChapters, { learningPathOnly: true }),
    [chapter.slug, allChapters],
  );

  return (
    <div className={lessonComplete ? "pb-52 sm:pb-8" : "pb-8"}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/german-grammar"
            className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-500 shadow-sm transition-colors hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Contents
          </Link>
          <button
            type="button"
            onClick={() => setTocOpen(true)}
            className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-500 shadow-sm transition-colors hover:text-primary md:hidden"
            aria-label="Inhaltsverzeichnis öffnen"
          >
            <List className="mr-2 h-4 w-4" />
            Kapitel
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {chapterRead && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Gelesen
            </span>
          )}
          {quizDone && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Quiz bestanden
            </span>
          )}
          <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary">
            {stats.readPercent}% gelesen
          </span>
        </div>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${stats.readPercent}%` }}
        />
      </div>

      <header className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-premium sm:rounded-[3rem] sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
            <BookOpen className="h-3.5 w-3.5" />
            Kapitel {chapter.chapterNumber}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
            {chapter.level}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
            {chapter.part}
          </span>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tighter text-slate-950 sm:text-5xl">
          {chapter.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-600">
          {chapter.description}
        </p>
      </header>

      <div
        className="prose prose-slate mt-8 max-w-none break-words rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-8
          prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-950
          prose-h1:mt-8 prose-h1:text-2xl sm:prose-h1:text-3xl
          prose-h2:mt-10 prose-h2:text-xl sm:prose-h2:text-2xl
          prose-h3:mt-8 prose-h3:text-lg sm:prose-h3:text-xl
          prose-p:text-[17px] prose-p:leading-8 prose-p:text-slate-700
          prose-li:text-[17px] prose-li:leading-8 prose-li:text-slate-700
          prose-strong:font-black prose-strong:text-slate-950
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-blockquote:rounded-2xl prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:not-italic prose-blockquote:text-slate-800
          prose-table:my-8 prose-table:block prose-table:w-full prose-table:overflow-x-auto prose-table:border-collapse sm:prose-table:table
          prose-th:border prose-th:border-slate-200 prose-th:bg-slate-50 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:text-sm prose-th:font-black prose-th:text-slate-900
          prose-td:border prose-td:border-slate-200 prose-td:px-4 prose-td:py-3 prose-td:text-sm
          prose-hr:my-10 prose-hr:border-slate-100"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {quiz && (
        <RoadToB2Quiz
          quiz={quiz}
          onChecked={(score, total) => markQuizResult(chapter.slug, score, total)}
        />
      )}

      {lessonComplete && (
        <GrammarLessonComplete
          chapter={chapter}
          nextChapter={smartNext}
          variant="inline"
          className="mt-8"
        />
      )}

      <nav className="mt-8 grid gap-3 sm:grid-cols-2" aria-label="Chapter navigation">
        {previous ? (
          <Link
            href={`/german-grammar/${previous.slug}`}
            prefetch
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors hover:border-primary/20 hover:bg-primary/5"
          >
            <span className="mb-1 flex items-center text-xs font-black uppercase tracking-widest text-slate-400">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Previous
            </span>
            <span className="font-black text-slate-900">{previous.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/german-grammar/${next.slug}`}
            prefetch
            className="rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition-colors hover:border-primary/20 hover:bg-primary/5 sm:text-right"
          >
            <span className="mb-1 flex items-center text-xs font-black uppercase tracking-widest text-slate-400 sm:justify-end">
              Next
              <ArrowRight className="ml-1 h-4 w-4" />
            </span>
            <span className="font-black text-slate-900">{next.title}</span>
          </Link>
        ) : (
          <div />
        )}
      </nav>

      {lessonComplete && smartNext && (
        <GrammarLessonComplete
          chapter={chapter}
          nextChapter={smartNext}
          variant="sticky"
        />
      )}

      <div
        className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-[80] mx-auto max-w-3xl rounded-2xl border border-slate-100 bg-white/95 p-2 shadow-floating backdrop-blur-xl md:hidden"
        aria-label="Mobile chapter navigation"
      >
        <div className="grid grid-cols-3 gap-2">
          {previous ? (
            <Link
              href={`/german-grammar/${previous.slug}`}
              prefetch
              className="flex items-center justify-center rounded-xl bg-slate-50 px-3 py-3 text-xs font-black uppercase tracking-widest text-slate-600"
            >
              Prev
            </Link>
          ) : (
            <span className="flex items-center justify-center rounded-xl bg-slate-50 px-3 py-3 text-xs font-black uppercase tracking-widest text-slate-300">
              Prev
            </span>
          )}
          <button
            type="button"
            onClick={() => setTocOpen(true)}
            className="flex items-center justify-center rounded-xl bg-primary px-3 py-3 text-xs font-black uppercase tracking-widest text-white"
          >
            <List className="mr-1 h-4 w-4" />
            TOC
          </button>
          {next ? (
            <Link
              href={`/german-grammar/${next.slug}`}
              prefetch
              className="flex items-center justify-center rounded-xl bg-slate-50 px-3 py-3 text-xs font-black uppercase tracking-widest text-slate-600"
            >
              Next
            </Link>
          ) : (
            <span className="flex items-center justify-center rounded-xl bg-slate-50 px-3 py-3 text-xs font-black uppercase tracking-widest text-slate-300">
              Next
            </span>
          )}
        </div>
      </div>

      <GrammarTocSheet
        open={tocOpen}
        onClose={() => setTocOpen(false)}
        chapters={allChapters}
        currentSlug={chapter.slug}
        isChapterRead={isChapterRead}
        isQuizPassed={isQuizPassed}
      />
    </div>
  );
}