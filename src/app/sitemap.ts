import { MetadataRoute } from "next";
import { CATEGORY_META, API_ROUTES, apiUrl } from "@/lib/constants";
import { getPostSlugs, getPostBySlug } from "@/lib/markdown";
import { getAllRoadToB2Chapters } from "@/lib/road-to-b2";
import { getAllRoadToC1Chapters } from "@/lib/road-to-c1";
import { getAllGermanGrammarChapters } from "@/lib/german-grammar";

type SitemapIdiom = {
  slug?: string;
  updated_at?: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://egaldeutsch.com";

  // 1. Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/blogs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/practice`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/feedback`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/redewendung`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/books`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/road-to-b2`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/road-to-c1`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/german-grammar`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // 2. Quiz Category Routes (Dynamic from constants)
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_META.map((cat) => ({
    url: `${baseUrl}/quiz/${cat.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 3. Blog Post Routes (Local Markdown Files)
  const slugs = getPostSlugs();
  const blogRoutes: MetadataRoute.Sitemap = slugs.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const post = getPostBySlug(slug);
    
    // Safely parse the date from frontmatter, default to current date if invalid
    let lastMod = new Date();
    if (post && post.date) {
      const parsedDate = new Date(post.date);
      if (!isNaN(parsedDate.getTime())) {
        lastMod = parsedDate;
      }
    }

    return {
      url: `${baseUrl}/blogs/${slug}`,
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.8,
    };
  });

  // 4. Book Routes (Local Markdown Files)
  const roadToB2Routes: MetadataRoute.Sitemap = getAllRoadToB2Chapters().map(
    (chapter) => ({
      url: `${baseUrl}/road-to-b2/${chapter.slug}`,
      lastModified: new Date(chapter.date),
      changeFrequency: "monthly",
      priority: chapter.chapterNumber === 1 ? 0.85 : 0.75,
    }),
  );

  const roadToC1Routes: MetadataRoute.Sitemap = getAllRoadToC1Chapters().map(
    (chapter) => ({
      url: `${baseUrl}/road-to-c1/${chapter.slug}`,
      lastModified: new Date(chapter.date),
      changeFrequency: "monthly",
      priority: chapter.chapterNumber === 1 ? 0.85 : 0.75,
    }),
  );

  const germanGrammarRoutes: MetadataRoute.Sitemap =
    getAllGermanGrammarChapters().map((chapter) => ({
      url: `${baseUrl}/german-grammar/${chapter.slug}`,
      lastModified: new Date(chapter.date),
      changeFrequency: "monthly",
      priority: chapter.chapterNumber === 1 ? 0.85 : 0.75,
    }));

  // 5. Idiom Routes (Dynamic from API)
  let idiomRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(apiUrl(API_ROUTES.IDIOMS), {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000) // Don't hang the build
    });

    if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const idioms = await res.json();
            if (Array.isArray(idioms)) {
                idiomRoutes = idioms
                    .filter(
                      (idiom: SitemapIdiom) =>
                        idiom.slug && idiom.slug.trim() !== "",
                    )
                    .map((idiom: SitemapIdiom) => {
                        // Safety check for invalid/zero dates from Go backend (0001-01-01)
                        let lastMod = new Date();
                        if (idiom.updated_at) {
                            const d = new Date(idiom.updated_at);
                            if (!isNaN(d.getTime()) && d.getFullYear() > 2000) {
                                lastMod = d;
                            }
                        }

                        return {
                            url: `${baseUrl}/redewendung/${idiom.slug}`,
                            lastModified: lastMod,
                            changeFrequency: "monthly",
                            priority: 0.6,
                        };
                    });
            }
        } else {
            console.warn("Sitemap: Backend returned non-JSON response for idioms.");
        }
    }
  } catch {
    console.warn("Sitemap: Could not fetch idioms for sitemap, skipping dynamic routes.");
  }

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...blogRoutes,
    ...roadToB2Routes,
    ...roadToC1Routes,
    ...germanGrammarRoutes,
    ...idiomRoutes,
  ];
}
