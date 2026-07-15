import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchPageClient } from "@/components/search/search-page-client";

const BASE_METADATA: Metadata = {
  title: "Search German Grammar, Chapters & Quizzes",
  description:
    "Search EgalDeutsch for grammar chapters, books, blog posts and interactive quizzes from A1 to C2.",
  alternates: {
    canonical: "/search",
  },
};

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q?.trim();

  if (!query) {
    return BASE_METADATA;
  }

  return {
    ...BASE_METADATA,
    title: `Search: ${query}`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageClient />
    </Suspense>
  );
}