import Link from "next/link";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import {
  getAllGermanGrammarChapters,
  getGermanGrammarIntro,
  groupGermanGrammarChaptersByPart,
} from "@/lib/german-grammar";
import { GrammarLandingProgress } from "@/components/german-grammar/grammar-landing-progress";
import { getGrammarManifestStats } from "@/lib/german-grammar-manifest";

export const metadata = {
  title: "Complete German Grammar Roadmap — A1 to C2",
  description:
    "A structured German grammar book from A1 to C2: cases, articles, verbs, word order, clauses, passive, Konjunktiv, register and style.",
  alternates: {
    canonical: "/german-grammar",
  },
};

export default function GermanGrammarPage() {
  const intro = getGermanGrammarIntro();
  const chapters = getAllGermanGrammarChapters();
  const groupedChapters = groupGermanGrammarChaptersByPart(chapters);
  const firstChapter = chapters[0];
  const manifestStats = getGrammarManifestStats();

  return (
    <AppShell showNav maxWidth="lg">
      <div className="pb-24 pt-6 sm:pt-10">
        <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-premium sm:rounded-[3rem]">
          <div className="relative px-5 py-8 sm:px-10 sm:py-12 lg:px-14">
            <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/3 translate-y-1/3 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative max-w-3xl">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                <Sparkles className="h-4 w-4" />
                A1 bis C2 Grammatik
              </span>
              <h1 className="text-3xl font-black leading-tight tracking-tighter text-slate-950 sm:text-5xl">
                {intro?.titleDe || intro?.title || "Complete German Grammar Roadmap"}
              </h1>
              {intro?.subtitle && (
                <p className="mt-3 text-sm font-bold uppercase tracking-widest text-slate-500">
                  {intro.subtitle}
                </p>
              )}
              <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:text-lg">
                {intro?.description ||
                  "A structured German grammar book for learners who want the whole system."}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <BookOpen className="mb-3 h-5 w-5 text-primary" />
                  <p className="text-2xl font-black text-slate-950">
                    {manifestStats.published}/{manifestStats.total}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Kapitel fertig
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <GraduationCap className="mb-3 h-5 w-5 text-primary" />
                  <p className="text-2xl font-black text-slate-950">A1–C2</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Level
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <Brain className="mb-3 h-5 w-5 text-primary" />
                  <p className="text-2xl font-black text-slate-950">System</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Grammar map
                  </p>
                </div>
              </div>

              {firstChapter && (
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/german-grammar/${firstChapter.slug}`}
                    className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-premium transition-transform active:scale-95"
                  >
                    Start reading
                  </Link>
                  <a
                    href="#chapters"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-black uppercase tracking-widest text-slate-700 transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    View contents
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {manifestStats.byLevel.map((levelStats) => (
            <div
              key={levelStats.level}
              className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-black uppercase tracking-widest text-primary">
                {levelStats.level}
              </p>
              <p className="mt-2 text-2xl font-black text-slate-950">
                {levelStats.published}/{levelStats.count}
              </p>
              <p className="text-sm font-semibold text-slate-500">Kapitel</p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            "German-specific order: gender, cases, word order and sentence brackets first.",
            "Every chapter has Alltag, Beruf and Software Engineer examples.",
            "Solutions are collapsible so mobile reading stays calm and focused.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-slate-100 bg-white p-5 text-sm font-semibold leading-6 text-slate-600 shadow-sm"
            >
              <CheckCircle2 className="mb-3 h-5 w-5 text-primary" />
              {item}
            </div>
          ))}
        </section>

        <GrammarLandingProgress
          groupedChapters={groupedChapters}
          fallbackSlug={firstChapter?.slug}
        />
      </div>
    </AppShell>
  );
}
