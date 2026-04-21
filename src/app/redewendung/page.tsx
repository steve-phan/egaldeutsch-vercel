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
import { cookies } from "next/headers";
import { de } from "@/i18n/de";
import { en } from "@/i18n/en";
import { vi } from "@/i18n/vi";

const translations = { de, en, vi };

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
  const cookieStore = await cookies();
  const lang = (cookieStore.get("language")?.value as "de" | "en" | "vi") || "en";
  const t = translations[lang];

  return (
    <AppShell showNav={true} maxWidth="lg">
      <div className="space-y-12 pt-6 pb-20">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter italic">
            {t.idioms.title}
          </h1>
          <p className="text-slate-500 font-bold max-w-xl mx-auto">
            {t.idioms.subtitle}
          </p>
        </div>

        {/* Client View with Search & Grid */}
        <IdiomsClientView initialIdioms={idioms} />
      </div>
    </AppShell>
  );
}
