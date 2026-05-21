import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'src/content/blogs');

export interface MarkdownPost {
  slug: string;
  title: string;
  description: string;
  level: string;
  category: string;
  tags: string[];
  date: string;
  contentHtml: string;
}

export function getPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string): MarkdownPost | null {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title || '',
    description: data.description || '',
    level: data.level || 'A1',
    category: data.category || 'Grammatik',
    tags: data.tags || [],
    date: data.date || new Date().toISOString(),
    contentHtml: content, // We will convert to HTML on the fly or just return markdown
  };
}

export async function getPostHtml(content: string) {
  const processedContent = await remark()
    .use(html)
    .process(content);
  return processedContent.toString();
}

export function getAllPosts(): Omit<MarkdownPost, 'contentHtml'>[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is MarkdownPost => post !== null)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      level: post.level,
      category: post.category,
      tags: post.tags,
      date: post.date,
    }))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  
  return posts;
}
