import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const bookDirectory = path.join(process.cwd(), "src/content/road-to-b2");

export interface RoadToB2Chapter {
  slug: string;
  title: string;
  description: string;
  part: string;
  chapterNumber: number;
  order: number;
  date: string;
  contentHtml: string;
}

export type RoadToB2Summary = Omit<RoadToB2Chapter, "contentHtml">;

export function getRoadToB2Slugs() {
  if (!fs.existsSync(bookDirectory)) {
    return [];
  }

  return fs
    .readdirSync(bookDirectory)
    .filter((filename) => filename.endsWith(".md") && filename !== "index.md");
}

export function getRoadToB2Intro() {
  const fullPath = path.join(bookDirectory, "index.md");

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    title: data.title || "Road to B2 Deutsch",
    description: data.description || "",
    contentHtml: content,
  };
}

export function getRoadToB2ChapterBySlug(slug: string): RoadToB2Chapter | null {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(bookDirectory, `${realSlug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title || "",
    description: data.description || "",
    part: data.part || "Road to B2",
    chapterNumber: Number(data.chapterNumber || 0),
    order: Number(data.order || 0),
    date: data.date || "2026-07-07",
    contentHtml: content,
  };
}

export function getAllRoadToB2Chapters(): RoadToB2Summary[] {
  return getRoadToB2Slugs()
    .map((slug) => getRoadToB2ChapterBySlug(slug))
    .filter((chapter): chapter is RoadToB2Chapter => chapter !== null)
    .map((chapter) => ({
      slug: chapter.slug,
      title: chapter.title,
      description: chapter.description,
      part: chapter.part,
      chapterNumber: chapter.chapterNumber,
      order: chapter.order,
      date: chapter.date,
    }))
    .sort((first, second) => first.order - second.order);
}

export function getRoadToB2AdjacentChapters(slug: string) {
  const chapters = getAllRoadToB2Chapters();
  const currentIndex = chapters.findIndex((chapter) => chapter.slug === slug);

  return {
    previous: currentIndex > 0 ? chapters[currentIndex - 1] : null,
    next:
      currentIndex >= 0 && currentIndex < chapters.length - 1
        ? chapters[currentIndex + 1]
        : null,
  };
}

export function groupRoadToB2ChaptersByPart(chapters = getAllRoadToB2Chapters()) {
  return chapters.reduce<Record<string, RoadToB2Summary[]>>((groups, chapter) => {
    if (!groups[chapter.part]) {
      groups[chapter.part] = [];
    }

    groups[chapter.part].push(chapter);
    return groups;
  }, {});
}

export async function getRoadToB2Html(content: string) {
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html)
    .process(content);

  return processedContent.toString();
}
