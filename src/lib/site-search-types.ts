export type SiteSearchType =
  | "grammar"
  | "road-to-b2"
  | "road-to-c1"
  | "blog"
  | "quiz"
  | "page";

export type SiteSearchEntry = {
  id: string;
  title: string;
  description: string;
  href: string;
  type: SiteSearchType;
  level?: string;
  badge?: string;
  /** Precomputed lowercase haystack for client-side matching. */
  searchText: string;
};

export const SITE_SEARCH_TYPE_LABELS: Record<SiteSearchType, string> = {
  grammar: "Grammatik",
  "road-to-b2": "Road to B2",
  "road-to-c1": "Road to C1",
  blog: "Blog",
  quiz: "Quiz",
  page: "Seiten",
};

export const SITE_SEARCH_TYPE_ORDER: SiteSearchType[] = [
  "page",
  "grammar",
  "road-to-b2",
  "road-to-c1",
  "quiz",
  "blog",
];