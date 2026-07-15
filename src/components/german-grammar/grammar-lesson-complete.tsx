"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, PartyPopper } from "lucide-react";
import type { GermanGrammarSummary } from "@/lib/german-grammar";
import { cn } from "@/lib/utils";

type Props = {
  chapter: GermanGrammarSummary;
  nextChapter: GermanGrammarSummary | null;
  variant?: "inline" | "sticky";
  className?: string;
};

export function GrammarLessonComplete({
  chapter,
  nextChapter,
  variant = "inline",
  className,
}: Props) {
  if (!nextChapter) {
    return (
      <section
        className={cn(
          "rounded-[2rem] border border-emerald-100 bg-emerald-50/80 p-5 sm:p-6",
          className,
        )}
      >
        <div className="flex items-start gap-3">
          <PartyPopper className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
              Kapitel abgeschlossen
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              {chapter.title}
            </h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              Du hast das letzte Kapitel auf diesem Pfad erreicht. Nutze das
              Inhaltsverzeichnis für Review oder Referenzkapitel.
            </p>
            <Link
              href="/german-grammar"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white"
            >
              Zur Übersicht
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const body = (
    <>
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
            Kapitel abgeschlossen
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            {chapter.title}
          </p>
          <p className="mt-2 text-base font-black leading-snug text-slate-950">
            Als Nächstes: {nextChapter.title}
          </p>
        </div>
      </div>
      <Link
        href={`/german-grammar/${nextChapter.slug}`}
        prefetch
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-sm transition-transform active:scale-[0.98]",
          variant === "sticky" && "mt-3",
          variant === "inline" && "mt-4",
        )}
      >
        Nächstes Kapitel
        <ArrowRight className="h-4 w-4" />
      </Link>
    </>
  );

  if (variant === "sticky") {
    return (
      <div
        className={cn(
          "fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+4.75rem)] z-[85] mx-auto max-w-3xl rounded-2xl border border-emerald-100 bg-white/95 p-3 shadow-floating backdrop-blur-xl",
          className,
        )}
      >
        {body}
      </div>
    );
  }

  return (
    <section
      className={cn(
        "rounded-[2rem] border border-emerald-100 bg-emerald-50/80 p-5 sm:p-6",
        className,
      )}
    >
      {body}
    </section>
  );
}