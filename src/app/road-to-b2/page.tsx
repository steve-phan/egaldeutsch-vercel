import Link from "next/link";
import { BookOpen, CheckCircle2, GraduationCap, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import {
  getAllRoadToB2Chapters,
  getRoadToB2Intro,
  groupRoadToB2ChaptersByPart,
} from "@/lib/road-to-b2";

export const metadata = {
  title: "Road to B2 Deutsch — German B2 Training Book",
  description:
    "Ein praktisches Trainingsbuch für Lernende, die von B1 zu B2 kommen möchten. Mit 30 Kapiteln, Grammatik, Schreiben, Sprechen und Prüfungstraining.",
  alternates: {
    canonical: "/road-to-b2",
  },
};

export default function RoadToB2Page() {
  const intro = getRoadToB2Intro();
  const chapters = getAllRoadToB2Chapters();
  const groupedChapters = groupRoadToB2ChaptersByPart(chapters);
  const firstChapter = chapters[0];

  return (
    <AppShell showNav maxWidth="lg">
      <div className="pb-24 pt-6 sm:pt-10">
        <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-premium sm:rounded-[3rem]">
          <div className="relative px-5 py-8 sm:px-10 sm:py-12 lg:px-14">
            <div className="absolute right-0 top-0 h-56 w-56 translate-x-1/3 -translate-y-1/3 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative max-w-3xl">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                <Sparkles className="h-4 w-4" />
                B1 zu B2
              </span>
              <h1 className="text-3xl font-black leading-tight tracking-tighter text-slate-950 sm:text-5xl">
                {intro?.title || "Road to B2 Deutsch"}
              </h1>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:text-lg">
                {intro?.description ||
                  "Ein praktisches Trainingsbuch für Lernende, die sicher B2 erreichen möchten."}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <BookOpen className="mb-3 h-5 w-5 text-primary" />
                  <p className="text-2xl font-black text-slate-950">30</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Kapitel
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <CheckCircle2 className="mb-3 h-5 w-5 text-primary" />
                  <p className="text-2xl font-black text-slate-950">B2</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Grammatik
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <GraduationCap className="mb-3 h-5 w-5 text-primary" />
                  <p className="text-2xl font-black text-slate-950">Exam</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Prüfungstraining
                  </p>
                </div>
              </div>

              {firstChapter && (
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/road-to-b2/${firstChapter.slug}`}
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

        <section id="chapters" className="mt-12">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
              Inhaltsverzeichnis
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Der komplette Road-to-B2-Lesepfad
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
                  {partChapters.map((chapter) => (
                    <Link
                      key={chapter.slug}
                      href={`/road-to-b2/${chapter.slug}`}
                      className="group rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-primary/20 hover:bg-primary/5"
                    >
                      <span className="mb-2 inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                        Kapitel {chapter.chapterNumber}
                      </span>
                      <h4 className="text-base font-black leading-snug text-slate-900 transition-colors group-hover:text-primary">
                        {chapter.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
