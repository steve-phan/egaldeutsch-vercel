import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, List } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import {
  getAllRoadToC1Chapters,
  getRoadToC1AdjacentChapters,
  getRoadToC1ChapterBySlug,
  getRoadToC1Html,
  getRoadToC1Slugs,
} from "@/lib/road-to-c1";
import { getRoadToC1Quiz } from "@/lib/road-to-c1-quizzes";
import { RoadToC1Quiz } from "@/components/road-to-c1/road-to-c1-quiz";

export async function generateStaticParams() {
  return getRoadToC1Slugs().map((slug) => ({
    slug: slug.replace(/\.md$/, ""),
  }));
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const chapter = getRoadToC1ChapterBySlug(resolvedParams.slug);

  if (!chapter) {
    return {
      title: "Road to C1 Chapter Not Found",
    };
  }

  return {
    title: `Kapitel ${chapter.chapterNumber}: ${chapter.title} | Road to C1 German`,
    description: chapter.description,
    alternates: {
      canonical: `/road-to-c1/${chapter.slug}`,
    },
  };
}

export default async function RoadToC1ChapterPage({ params }: Props) {
  const resolvedParams = await params;
  const chapter = getRoadToC1ChapterBySlug(resolvedParams.slug);

  if (!chapter) {
    return notFound();
  }

  const chapters = getAllRoadToC1Chapters();
  const currentIndex = chapters.findIndex((item) => item.slug === chapter.slug);
  const progress =
    currentIndex >= 0 ? Math.round(((currentIndex + 1) / chapters.length) * 100) : 0;
  const { previous, next } = getRoadToC1AdjacentChapters(chapter.slug);
  const contentHtml = await getRoadToC1Html(chapter.contentHtml);
  const quiz = getRoadToC1Quiz(chapter.slug);

  return (
    <AppShell showNav={false} maxWidth="lg">
      <article className="pb-32 pt-5 sm:pb-20 sm:pt-10">
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link
            href="/road-to-c1"
            className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-500 shadow-sm transition-colors hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Contents
          </Link>
          <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary">
            {progress}% gelesen
          </span>
        </div>

        <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <header className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-premium sm:rounded-[3rem] sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              Kapitel {chapter.chapterNumber}
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

        {quiz && <RoadToC1Quiz quiz={quiz} />}

        <nav className="mt-8 grid gap-3 sm:grid-cols-2" aria-label="Chapter navigation">
          {previous ? (
            <Link
              href={`/road-to-c1/${previous.slug}`}
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
              href={`/road-to-c1/${next.slug}`}
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

        <div
          className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-[80] mx-auto max-w-3xl rounded-2xl border border-slate-100 bg-white/95 p-2 shadow-floating backdrop-blur-xl md:hidden"
          aria-label="Mobile chapter navigation"
        >
          <div className="grid grid-cols-3 gap-2">
            {previous ? (
              <Link
                href={`/road-to-c1/${previous.slug}`}
                className="flex items-center justify-center rounded-xl bg-slate-50 px-3 py-3 text-xs font-black uppercase tracking-widest text-slate-600"
              >
                Prev
              </Link>
            ) : (
              <span className="flex items-center justify-center rounded-xl bg-slate-50 px-3 py-3 text-xs font-black uppercase tracking-widest text-slate-300">
                Prev
              </span>
            )}
            <Link
              href="/road-to-c1"
              className="flex items-center justify-center rounded-xl bg-primary px-3 py-3 text-xs font-black uppercase tracking-widest text-white"
            >
              <List className="mr-1 h-4 w-4" />
              TOC
            </Link>
            {next ? (
              <Link
                href={`/road-to-c1/${next.slug}`}
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
      </article>
    </AppShell>
  );
}
