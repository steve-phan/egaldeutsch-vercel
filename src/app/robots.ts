import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/results/", // Results are user-specific and shouldn't be indexed
      ],
    },
    sitemap: "https://egaldeutsch.com/sitemap.xml",
  };
}
