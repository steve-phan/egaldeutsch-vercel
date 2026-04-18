import { MetadataRoute } from "next";
import { CATEGORY_META, BACKEND_URL, API_ROUTES } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.egaldeutsch.com";

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
        next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (res.ok) {
        const idioms = await res.json();
        idiomRoutes = idioms.map((idiom: any) => ({
            url: `${baseUrl}/redewendung/${idiom.slug}`,
            lastModified: new Date(idiom.updated_at || new Date()),
            changeFrequency: "monthly",
            priority: 0.6,
        }));
    }
  } catch (error) {
    console.error("Sitemap generation error (idioms):", error);
  }

  return [...staticRoutes, ...categoryRoutes, ...idiomRoutes];
}
