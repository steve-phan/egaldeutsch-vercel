import { CATEGORY_META } from "@/lib/constants";
import { getAllGermanGrammarChapters } from "@/lib/german-grammar";
import { getGrammarManifestEntry } from "@/lib/german-grammar-manifest";
import { getAllPosts } from "@/lib/markdown";
import { getAllRoadToB2Chapters } from "@/lib/road-to-b2";
import { getAllRoadToC1Chapters } from "@/lib/road-to-c1";
import type { SiteSearchEntry } from "@/lib/site-search-types";

function buildSearchText(parts: Array<string | number | undefined | null>) {
  return parts
    .filter((part) => part !== undefined && part !== null && String(part).trim() !== "")
    .join(" ")
    .toLowerCase();
}

function entry(
  partial: Omit<SiteSearchEntry, "searchText"> & {
    keywords?: Array<string | undefined | null>;
  },
): SiteSearchEntry {
  const { keywords = [], ...rest } = partial;
  return {
    ...rest,
    searchText: buildSearchText([
      rest.title,
      rest.description,
      rest.level,
      rest.badge,
      ...keywords,
    ]),
  };
}

export function buildSiteSearchIndex(): SiteSearchEntry[] {
  const results: SiteSearchEntry[] = [];

  results.push(
    entry({
      id: "page-german-grammar",
      title: "Complete German Grammar",
      description: "A1–C2 grammar roadmap with quizzes and progress tracking.",
      href: "/german-grammar",
      type: "page",
      level: "A1–C2",
      badge: "186 Kapitel",
      keywords: ["grammatik", "grammar", "A1", "C2", "cases", "verbs"],
    }),
    entry({
      id: "page-road-to-b2",
      title: "Road to B2 Deutsch",
      description: "Structured B2 grammar, vocabulary and exam preparation.",
      href: "/road-to-b2",
      type: "page",
      level: "B1–B2",
      keywords: ["B2", "TELC", "Beruf", "book"],
    }),
    entry({
      id: "page-road-to-c1",
      title: "Von B2 zu telc C1",
      description: "Advanced argumentation, Redemittel and C1 exam strategy.",
      href: "/road-to-c1",
      type: "page",
      level: "B2–C1",
      keywords: ["C1", "telc", "book"],
    }),
    entry({
      id: "page-practice",
      title: "Grammar Practice & Quizzes",
      description: "Interactive quizzes by topic and CEFR level.",
      href: "/practice",
      type: "page",
      keywords: ["quiz", "practice", "übung", "test"],
    }),
    entry({
      id: "page-books",
      title: "German Learning Books",
      description: "Choose a structured book: Grammar, B2 or C1.",
      href: "/books",
      type: "page",
      keywords: ["books", "bücher", "roadmap"],
    }),
    entry({
      id: "page-blogs",
      title: "German Grammar Blog",
      description: "Articles, tips and grammar explanations.",
      href: "/blogs",
      type: "page",
      keywords: ["blog", "articles", "tips"],
    }),
    entry({
      id: "page-redewendung",
      title: "German Idioms (Redewendungen)",
      description: "Search idioms with German, English and Vietnamese meanings.",
      href: "/redewendung",
      type: "page",
      keywords: ["idioms", "redewendung", "phrases", "sprichwort"],
    }),
    entry({
      id: "page-explore",
      title: "Discovery Centre",
      description: "Explore grammar modules and learning missions.",
      href: "/explore",
      type: "page",
      keywords: ["explore", "discover", "modules"],
    }),
  );

  for (const chapter of getAllGermanGrammarChapters()) {
    const manifest = getGrammarManifestEntry(chapter.slug);
    results.push(
      entry({
        id: `grammar-${chapter.slug}`,
        title: chapter.title,
        description: chapter.description,
        href: `/german-grammar/${chapter.slug}`,
        type: "grammar",
        level: chapter.level,
        badge: `Kap. ${chapter.chapterNumber}`,
        keywords: [
          chapter.part,
          chapter.unit,
          manifest?.spiralTopic,
          manifest?.unit,
        ],
      }),
    );
  }

  for (const chapter of getAllRoadToB2Chapters()) {
    results.push(
      entry({
        id: `b2-${chapter.slug}`,
        title: chapter.title,
        description: chapter.description,
        href: `/road-to-b2/${chapter.slug}`,
        type: "road-to-b2",
        badge: `Kap. ${chapter.chapterNumber}`,
        keywords: [chapter.part, "B2", "road to b2"],
      }),
    );
  }

  for (const chapter of getAllRoadToC1Chapters()) {
    results.push(
      entry({
        id: `c1-${chapter.slug}`,
        title: chapter.title,
        description: chapter.description,
        href: `/road-to-c1/${chapter.slug}`,
        type: "road-to-c1",
        badge: `Kap. ${chapter.chapterNumber}`,
        keywords: [chapter.part, "C1", "telc"],
      }),
    );
  }

  for (const post of getAllPosts()) {
    results.push(
      entry({
        id: `blog-${post.slug}`,
        title: post.title,
        description: post.description,
        href: `/blogs/${post.slug}`,
        type: "blog",
        level: post.level,
        badge: post.category,
        keywords: post.tags,
      }),
    );
  }

  for (const category of CATEGORY_META) {
    results.push(
      entry({
        id: `quiz-${category.id}`,
        title: category.label.en,
        description: category.description.en,
        href: `/quiz/${category.id}`,
        type: "quiz",
        level: category.levels.join("–"),
        badge: category.icon,
        keywords: [
          category.label.de,
          category.label.vi,
          category.id,
          ...(category.keywords ?? []),
        ],
      }),
    );
  }

  return results;
}