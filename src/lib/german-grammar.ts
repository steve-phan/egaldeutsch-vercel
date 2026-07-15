import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import { renderBookAudioMarkers } from "@/lib/book-audio";

const bookDirectory = path.join(process.cwd(), "src/content/german-grammar");

export type GermanGrammarLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface GermanGrammarChapter {
  slug: string;
  title: string;
  description: string;
  part: string;
  level: GermanGrammarLevel;
  unit: string;
  chapterNumber: number;
  order: number;
  date: string;
  contentHtml: string;
}

export type GermanGrammarSummary = Omit<GermanGrammarChapter, "contentHtml">;

export function getGermanGrammarSlugs() {
  if (!fs.existsSync(bookDirectory)) {
    return [];
  }

  return fs
    .readdirSync(bookDirectory)
    .filter((filename) => filename.endsWith(".md") && filename !== "index.md");
}

export function getGermanGrammarIntro() {
  const fullPath = path.join(bookDirectory, "index.md");

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    title: data.title || "Complete German Grammar Roadmap",
    titleDe: data.titleDe || "",
    subtitle: data.subtitle || "",
    description: data.description || "",
    contentHtml: content,
  };
}

export function getGermanGrammarChapterBySlug(
  slug: string,
): GermanGrammarChapter | null {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(bookDirectory, `${realSlug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const part = data.part || "German Grammar";
  const levelFromPart = part.match(/^(A1|A2|B1|B2|C1|C2)/)?.[1] as
    | GermanGrammarLevel
    | undefined;

  return {
    slug: realSlug,
    title: data.title || "",
    description: data.description || "",
    part,
    level: (data.level as GermanGrammarLevel) || levelFromPart || "A1",
    unit: data.unit || "general",
    chapterNumber: Number(data.chapterNumber || 0),
    order: Number(data.order || 0),
    date: data.date || "2026-07-15",
    contentHtml: content,
  };
}

export function getAllGermanGrammarChapters(): GermanGrammarSummary[] {
  return getGermanGrammarSlugs()
    .map((slug) => getGermanGrammarChapterBySlug(slug))
    .filter((chapter): chapter is GermanGrammarChapter => chapter !== null)
    .map((chapter) => ({
      slug: chapter.slug,
      title: chapter.title,
      description: chapter.description,
      part: chapter.part,
      level: chapter.level,
      unit: chapter.unit,
      chapterNumber: chapter.chapterNumber,
      order: chapter.order,
      date: chapter.date,
    }))
    .sort((first, second) => first.order - second.order);
}

export function getGermanGrammarAdjacentChapters(slug: string) {
  const chapters = getAllGermanGrammarChapters();
  const currentIndex = chapters.findIndex((chapter) => chapter.slug === slug);

  return {
    previous: currentIndex > 0 ? chapters[currentIndex - 1] : null,
    next:
      currentIndex >= 0 && currentIndex < chapters.length - 1
        ? chapters[currentIndex + 1]
        : null,
  };
}

export function groupGermanGrammarChaptersByPart(
  chapters = getAllGermanGrammarChapters(),
) {
  return chapters.reduce<Record<string, GermanGrammarSummary[]>>(
    (groups, chapter) => {
      if (!groups[chapter.part]) {
        groups[chapter.part] = [];
      }

      groups[chapter.part].push(chapter);
      return groups;
    },
    {},
  );
}

export async function getGermanGrammarHtml(content: string) {
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html)
    .process(content);

  return renderBookAudioMarkers(processedContent.toString());
}
