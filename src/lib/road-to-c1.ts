import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const bookDirectory = path.join(process.cwd(), "src/content/road-to-c1");

export interface RoadToC1Chapter {
  slug: string;
  title: string;
  description: string;
  part: string;
  chapterNumber: number;
  order: number;
  date: string;
  contentHtml: string;
}

export type RoadToC1Summary = Omit<RoadToC1Chapter, "contentHtml">;

export function getRoadToC1Slugs() {
  if (!fs.existsSync(bookDirectory)) {
    return [];
  }

  return fs
    .readdirSync(bookDirectory)
    .filter((filename) => filename.endsWith(".md") && filename !== "index.md");
}

export function getRoadToC1Intro() {
  const fullPath = path.join(bookDirectory, "index.md");

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    title: data.title || "Von B2 zu telc C1",
    description: data.description || "",
    contentHtml: content,
  };
}

export function getRoadToC1ChapterBySlug(
  slug: string,
): RoadToC1Chapter | null {
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
    part: data.part || "Road to C1",
    chapterNumber: Number(data.chapterNumber || 0),
    order: Number(data.order || 0),
    date: data.date || "2026-07-07",
    contentHtml: content,
  };
}

export function getAllRoadToC1Chapters(): RoadToC1Summary[] {
  return getRoadToC1Slugs()
    .map((slug) => getRoadToC1ChapterBySlug(slug))
    .filter((chapter): chapter is RoadToC1Chapter => chapter !== null)
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

export function getRoadToC1AdjacentChapters(slug: string) {
  const chapters = getAllRoadToC1Chapters();
  const currentIndex = chapters.findIndex((chapter) => chapter.slug === slug);

  return {
    previous: currentIndex > 0 ? chapters[currentIndex - 1] : null,
    next:
      currentIndex >= 0 && currentIndex < chapters.length - 1
        ? chapters[currentIndex + 1]
        : null,
  };
}

export function groupRoadToC1ChaptersByPart(chapters = getAllRoadToC1Chapters()) {
  return chapters.reduce<Record<string, RoadToC1Summary[]>>((groups, chapter) => {
    if (!groups[chapter.part]) {
      groups[chapter.part] = [];
    }

    groups[chapter.part].push(chapter);
    return groups;
  }, {});
}

export async function getRoadToC1Html(content: string) {
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html)
    .process(content);

  return processedContent.toString();
}
