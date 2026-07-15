import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { GrammarChapterClient } from "@/components/german-grammar/grammar-chapter-client";
import {
  getGermanGrammarAdjacentChapters,
  getGermanGrammarChapterBySlug,
  getGermanGrammarHtml,
  getGermanGrammarSlugs,
} from "@/lib/german-grammar";
import { getGermanGrammarQuiz } from "@/lib/german-grammar-quizzes";

export async function generateStaticParams() {
  return getGermanGrammarSlugs().map((slug) => ({
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
  const chapter = getGermanGrammarChapterBySlug(resolvedParams.slug);

  if (!chapter) {
    return {
      title: "German Grammar Chapter Not Found",
    };
  }

  return {
    title: `Kapitel ${chapter.chapterNumber}: ${chapter.title} | Complete German Grammar`,
    description: chapter.description,
    alternates: {
      canonical: `/german-grammar/${chapter.slug}`,
    },
  };
}

export default async function GermanGrammarChapterPage({ params }: Props) {
  const resolvedParams = await params;
  const chapter = getGermanGrammarChapterBySlug(resolvedParams.slug);

  if (!chapter) {
    return notFound();
  }

  const { previous, next } = getGermanGrammarAdjacentChapters(chapter.slug);
  const { contentHtml: rawContent, ...chapterSummary } = chapter;
  const contentHtml = await getGermanGrammarHtml(rawContent);
  const quiz = getGermanGrammarQuiz(chapter.slug);

  return (
    <AppShell showNav={false} maxWidth="lg">
      <article className="pb-32 pt-5 sm:pb-20 sm:pt-10">
        <GrammarChapterClient
          chapter={chapterSummary}
          contentHtml={contentHtml}
          quiz={quiz}
          previous={previous}
          next={next}
        />
      </article>
    </AppShell>
  );
}