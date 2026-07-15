import type { SiteSearchEntry } from "@/lib/site-search-types";

export type SiteSearchHit = SiteSearchEntry & { score: number };

function normalizeQuery(query: string) {
  return query.trim().toLowerCase();
}

function tokenize(query: string) {
  return normalizeQuery(query).split(/\s+/).filter(Boolean);
}

export function searchSiteIndex(
  entries: SiteSearchEntry[],
  query: string,
  limit = 24,
): SiteSearchHit[] {
  const normalized = normalizeQuery(query);
  if (normalized.length < 2) return [];

  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const hits = entries
    .map((entry) => {
      const title = entry.title.toLowerCase();
      const haystack = entry.searchText;
      let score = 0;

      if (title === normalized) score += 120;
      if (title.startsWith(normalized)) score += 60;
      if (haystack.includes(normalized)) score += 30;

      for (const token of tokens) {
        if (title === token) score += 40;
        else if (title.startsWith(token)) score += 18;
        else if (title.includes(token)) score += 12;

        if (haystack.includes(token)) score += 6;
      }

      return { ...entry, score };
    })
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  return hits.slice(0, limit);
}

export function groupSearchHits(hits: SiteSearchHit[]) {
  const groups = new Map<string, SiteSearchHit[]>();

  for (const hit of hits) {
    const bucket = groups.get(hit.type) ?? [];
    bucket.push(hit);
    groups.set(hit.type, bucket);
  }

  return groups;
}