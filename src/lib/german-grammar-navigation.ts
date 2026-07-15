import {
  GERMAN_GRAMMAR_MANIFEST,
  getGrammarManifestEntry,
  type GrammarLevel,
} from "@/lib/german-grammar-manifest";
import type { GermanGrammarSummary } from "@/lib/german-grammar";

export const GRAMMAR_LEVELS: GrammarLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

/** Units skipped on the default learning path (reference material). */
export const LEARNING_PATH_SKIP_UNITS = new Set([
  "reference",
  "answer-key",
  "workbook",
]);

export function isOnLearningPath(slug: string): boolean {
  const entry = getGrammarManifestEntry(slug);
  if (!entry) return true;
  return !LEARNING_PATH_SKIP_UNITS.has(entry.unit);
}

export function groupChaptersByLevel(chapters: GermanGrammarSummary[]) {
  return GRAMMAR_LEVELS.reduce<Record<GrammarLevel, GermanGrammarSummary[]>>(
    (groups, level) => {
      groups[level] = chapters
        .filter((chapter) => chapter.level === level)
        .sort((a, b) => a.order - b.order);
      return groups;
    },
    { A1: [], A2: [], B1: [], B2: [], C1: [], C2: [] },
  );
}

export function getLevelProgress(
  chapters: GermanGrammarSummary[],
  isComplete: (slug: string) => boolean,
  level: GrammarLevel,
) {
  const levelChapters = chapters.filter((chapter) => chapter.level === level);
  const done = levelChapters.filter((chapter) => isComplete(chapter.slug)).length;
  return { done, total: levelChapters.length };
}

export function findContinueChapter(
  chapters: GermanGrammarSummary[],
  options: {
    lastReadSlug?: string;
    isComplete: (slug: string) => boolean;
    learningPathOnly?: boolean;
  },
): GermanGrammarSummary | null {
  const ordered = [...chapters].sort((a, b) => a.order - b.order);
  const pool = options.learningPathOnly
    ? ordered.filter((chapter) => isOnLearningPath(chapter.slug))
    : ordered;

  if (pool.length === 0) return null;

  if (options.lastReadSlug) {
    const lastIndex = pool.findIndex(
      (chapter) => chapter.slug === options.lastReadSlug,
    );
    if (lastIndex >= 0) {
      const resume = pool.slice(lastIndex).find((chapter) => !options.isComplete(chapter.slug));
      if (resume) return resume;
    }
  }

  return pool.find((chapter) => !options.isComplete(chapter.slug)) ?? pool[0];
}

export function getSmartNextChapter(
  currentSlug: string,
  chapters: GermanGrammarSummary[],
  options: { learningPathOnly?: boolean } = {},
): GermanGrammarSummary | null {
  const ordered = [...chapters].sort((a, b) => a.order - b.order);
  const pool = options.learningPathOnly
    ? ordered.filter((chapter) => isOnLearningPath(chapter.slug))
    : ordered;

  const currentIndex = pool.findIndex((chapter) => chapter.slug === currentSlug);
  if (currentIndex < 0 || currentIndex >= pool.length - 1) {
    return null;
  }

  return pool[currentIndex + 1];
}

export function isChapterLessonComplete(
  slug: string,
  options: {
    hasQuiz: boolean;
    isRead: boolean;
    isQuizPassed: boolean;
  },
): boolean {
  if (options.hasQuiz) {
    return options.isQuizPassed;
  }
  return options.isRead;
}

export function getManifestUnitLabel(slug: string): string | null {
  const entry = getGrammarManifestEntry(slug);
  if (!entry) return null;

  const labels: Record<string, string> = {
    reference: "Referenz",
    "answer-key": "Lösungen",
    workbook: "Arbeitsbuch",
    tests: "Test",
    review: "Review",
  };

  return labels[entry.unit] ?? null;
}

export function countLearningPathChapters() {
  return GERMAN_GRAMMAR_MANIFEST.filter(
    (entry) => !LEARNING_PATH_SKIP_UNITS.has(entry.unit),
  ).length;
}