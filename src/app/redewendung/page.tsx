import { Idiom } from "@/types/idiom";
import { Metadata } from "next";
import { API_ROUTES, BACKEND_URL } from "@/lib/constants";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "Redewendung — German Idioms Directory",
  description:
    "Explore the colorful world of German idioms. Meanings, origins, and examples for learners of all levels.",
  openGraph: {
    title: "German Idioms Directory — EgalDeutsch",
    description: "Explore the colorful world of German idioms and mastery.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "German Idioms Directory on EgalDeutsch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "German Idioms Directory — EgalDeutsch",
    description: "Master German idioms and sound like a native.",
    images: ["/og-image.png"],
  },
};

import { IdiomsClientView } from "@/components/idioms/idioms-client-view";

async function getIdioms(): Promise<Idiom[]> {
  try {
    const res = await fetch(`${BACKEND_URL}${API_ROUTES.IDIOMS}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return [];

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Idioms Directory: Backend returned non-JSON response.");
      return [];
    }

    return res.json();
  } catch (error) {
    console.warn("Failed to fetch idioms:", error);
    return [];
  }
}

export default async function IdiomsDirectory() {
  const idioms = await getIdioms();

  return (
    <AppShell showNav={true} maxWidth="lg">
      <div className="space-y-12 pt-6 pb-20">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter italic">
            Redewendung
          </h1>
          <p className="text-slate-500 font-bold max-w-xl mx-auto">
            German is a colorful language. Master these idioms to sound more
            like a native speaker and understand the culture better.
          </p>
        </div>

        {/* Client View with Search & Grid */}
        <IdiomsClientView initialIdioms={idioms} />
      </div>
    </AppShell>
  );
}
