"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { GlobalSearchTrigger } from "@/components/search/global-search-trigger";
import { useSiteSearch } from "@/contexts/site-search-context";
import {
  SITE_SEARCH_TYPE_LABELS,
  SITE_SEARCH_TYPE_ORDER,
  type SiteSearchType,
} from "@/lib/site-search-types";
import { searchSiteIndex } from "@/lib/site-search-query";
import { cn } from "@/lib/utils";

export function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { entries } = useSiteSearch();
  const paramQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(paramQuery);

  useEffect(() => {
    setQuery(paramQuery);
  }, [paramQuery]);

  useEffect(() => {
    const trimmed = query.trim();
    const nextUrl =
      trimmed.length >= 2
        ? `/search?q=${encodeURIComponent(trimmed)}`
        : "/search";
    router.replace(nextUrl, { scroll: false });
  }, [query, router]);

  const hits = useMemo(
    () => searchSiteIndex(entries, query, 60),
    [entries, query],
  );

  const groupedTypes = SITE_SEARCH_TYPE_ORDER.filter((type) =>
    hits.some((hit) => hit.type === type),
  );

  return (
    <AppShell showNav maxWidth="lg">
      <div className="pb-24 pt-6 sm:pt-10">
        <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-premium sm:rounded-[3rem] sm:p-8">
          <p className="text-xs font-black uppercase tracking-widest text-primary">
            Globale Suche
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Finde Grammatik, Kapitel & Quizzes
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
            Durchsuche Grammatik-Kapitel, Bücher, Blog-Artikel und Quiz-Module
            an einem Ort.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="z. B. Dativ, Passiv, Konjunktiv …"
                className="min-w-0 flex-1 bg-transparent text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                autoFocus={Boolean(paramQuery)}
              />
            </div>
            <GlobalSearchTrigger
              showShortcut
              className="h-12 justify-center px-4 py-3"
            />
          </div>
        </section>

        <section className="mt-8">
          {query.trim().length < 2 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white/70 p-8 text-center">
              <p className="text-sm font-semibold text-slate-500">
                Gib mindestens 2 Zeichen ein, um Ergebnisse zu sehen.
              </p>
            </div>
          ) : hits.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-100 bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-black text-slate-800">Keine Treffer</p>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                Für „{query}“ wurde nichts gefunden. Probiere Synonyme oder
                kürzere Begriffe.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm font-bold text-slate-500">
                {hits.length} Ergebnis{hits.length === 1 ? "" : "se"} für „
                {query}“
              </p>

              {groupedTypes.map((type: SiteSearchType) => {
                const typeHits = hits.filter((hit) => hit.type === type);

                return (
                  <div
                    key={type}
                    className="rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-6"
                  >
                    <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">
                      {SITE_SEARCH_TYPE_LABELS[type]}
                    </h2>
                    <ul className="space-y-2">
                      {typeHits.map((hit) => (
                        <li key={hit.id}>
                          <Link
                            href={hit.href}
                            className={cn(
                              "group flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-primary/20 hover:bg-primary/5",
                            )}
                          >
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-base font-black text-slate-900 group-hover:text-primary">
                                  {hit.title}
                                </span>
                                {hit.badge && (
                                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
                                    {hit.badge}
                                  </span>
                                )}
                                {hit.level && (
                                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary">
                                    {hit.level}
                                  </span>
                                )}
                              </div>
                              <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-slate-500">
                                {hit.description}
                              </p>
                            </div>
                            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-primary" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}