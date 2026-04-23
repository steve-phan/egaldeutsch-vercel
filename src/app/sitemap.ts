import { MetadataRoute } from "next";
import { CATEGORY_META, BACKEND_URL, API_ROUTES } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://egaldeutsch.com";

  // 1. Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/explore`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/feedback`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/redewendung`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  // 2. Quiz Category Routes (Dynamic from constants)
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_META.map((cat) => ({
    url: `${baseUrl}/quiz/${cat.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 3. Idiom Routes (Dynamic from API)
  let idiomRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${BACKEND_URL}${API_ROUTES.IDIOMS}`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000) // Don't hang the build
    });

    if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const idioms = await res.json();
            if (Array.isArray(idioms)) {
                idiomRoutes = idioms.map((idiom: any) => ({
                    url: `${baseUrl}/redewendung/${idiom.slug}`,
                    lastModified: new Date(idiom.updated_at || new Date()),
                    changeFrequency: "monthly",
                    priority: 0.6,
                }));
            }
        } else {
            console.warn("Sitemap: Backend returned non-JSON response for idioms.");
        }
    }
  } catch (error) {
    console.warn("Sitemap: Could not fetch idioms for sitemap, skipping dynamic routes.");
  }

  return [...staticRoutes, ...categoryRoutes, ...idiomRoutes];
}
