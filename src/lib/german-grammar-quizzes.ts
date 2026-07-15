import {
  GERMAN_GRAMMAR_MANIFEST,
  getGrammarManifestEntry,
} from "@/lib/german-grammar-manifest";
import { getRichQuestionsForChapter } from "@/lib/german-grammar-quiz-bank";
import type { RoadToB2Quiz } from "@/lib/road-to-b2-quizzes";

const levelChapterIndex = new Map<string, number>();
for (const level of ["A1", "A2", "B1", "B2", "C1", "C2"] as const) {
  GERMAN_GRAMMAR_MANIFEST.filter((entry) => entry.level === level)
    .sort((first, second) => first.order - second.order)
    .forEach((entry, index) => {
      levelChapterIndex.set(entry.slug, index + 1);
    });
}

function buildQuiz(slug: string): RoadToB2Quiz | null {
  const entry = getGrammarManifestEntry(slug);
  if (!entry) return null;

  const chapterNumber = levelChapterIndex.get(slug) ?? entry.order;
  const questions = getRichQuestionsForChapter(
    slug,
    entry.spiralTopic,
    entry.unit,
    entry.level,
    4,
  );

  return {
    title: `Kapitel-${chapterNumber}-Check: ${entry.title}`,
    description:
      "Vier Grammatikfragen mit echten Beispielen — teste dein Verständnis, bevor du weiterliest.",
    questions,
  };
}

const quizzes: Record<string, RoadToB2Quiz> = Object.fromEntries(
  GERMAN_GRAMMAR_MANIFEST.map((entry) => [entry.slug, buildQuiz(entry.slug)]).filter(
    ([, quiz]) => quiz !== null,
  ),
);

export function getGermanGrammarQuiz(slug: string) {
  return quizzes[slug] ?? null;
}