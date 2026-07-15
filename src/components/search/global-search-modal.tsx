"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Brain,
  FileText,
  GraduationCap,
  LayoutGrid,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useSiteSearch } from "@/contexts/site-search-context";
import {
  SITE_SEARCH_TYPE_LABELS,
  SITE_SEARCH_TYPE_ORDER,
  type SiteSearchType,
} from "@/lib/site-search-types";
import { searchSiteIndex, type SiteSearchHit } from "@/lib/site-search-query";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<SiteSearchType, React.ComponentType<{ className?: string }>> = {
  grammar: Brain,
  "road-to-b2": GraduationCap,
  "road-to-c1": BookOpen,
  blog: FileText,
  quiz: Sparkles,
  page: LayoutGrid,
};

function flattenHits(hits: SiteSearchHit[]) {
  const groups = new Map<SiteSearchType, SiteSearchHit[]>();

  for (const hit of hits) {
    const bucket = groups.get(hit.type) ?? [];
    bucket.push(hit);
    groups.set(hit.type, bucket);
  }

  const ordered: SiteSearchHit[] = [];
  for (const type of SITE_SEARCH_TYPE_ORDER) {
    const bucket = groups.get(type);
    if (bucket) ordered.push(...bucket);
  }

  return ordered;
}

export function GlobalSearchModal() {
  const router = useRouter();
  const { entries, isOpen, closeSearch, initialQuery } = useSiteSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const hits = useMemo(
    () => searchSiteIndex(entries, query, 20),
    [entries, query],
  );
  const flatHits = useMemo(() => flattenHits(hits), [hits]);

  useEffect(() => {
    if (!isOpen) return;
    setQuery(initialQuery);
    setActiveIndex(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [isOpen, initialQuery]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || flatHits.length === 0) return;
    const active = listRef.current?.querySelector<HTMLElement>(
      `[data-search-index="${activeIndex}"]`,
    );
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, flatHits.length, isOpen]);

  if (!isOpen) return null;

  function navigateTo(hit: SiteSearchHit) {
    closeSearch();
    router.push(hit.href);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        flatHits.length === 0 ? 0 : (current + 1) % flatHits.length,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        flatHits.length === 0
          ? 0
          : (current - 1 + flatHits.length) % flatHits.length,
      );
      return;
    }

    if (event.key === "Enter" && flatHits[activeIndex]) {
      event.preventDefault();
      navigateTo(flatHits[activeIndex]);
    }
  }

  const groupedTypes = SITE_SEARCH_TYPE_ORDER.filter((type) =>
    hits.some((hit) => hit.type === type),
  );

  let runningIndex = 0;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center px-3 pt-[10vh] sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Globale Suche"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
        onClick={closeSearch}
        aria-label="Suche schließen"
      />

      <div className="relative flex max-h-[min(78vh,42rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-floating">
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Grammatik, Kapitel, Quiz, Blog …"
            className="min-w-0 flex-1 bg-transparent text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={closeSearch}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
            aria-label="Schließen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto px-2 py-2 sm:px-3">
          {query.trim().length < 2 ? (
            <div className="px-3 py-8 text-center">
              <p className="text-sm font-bold text-slate-500">
                Tippe mindestens 2 Zeichen — z. B.{" "}
                <span className="text-primary">Dativ</span>,{" "}
                <span className="text-primary">Konjunktiv</span>,{" "}
                <span className="text-primary">B2</span>
              </p>
              <p className="mt-2 text-xs font-semibold text-slate-400">
                ↑↓ navigieren · Enter öffnen · Esc schließen
              </p>
            </div>
          ) : hits.length === 0 ? (
            <div className="px-3 py-10 text-center">
              <p className="text-sm font-black text-slate-700">Keine Treffer</p>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                Versuche einen kürzeren Begriff oder ein anderes Thema.
              </p>
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                onClick={closeSearch}
                className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary"
              >
                Auf Suchseite anzeigen
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            groupedTypes.map((type) => {
              const typeHits = hits.filter((hit) => hit.type === type);
              const Icon = TYPE_ICONS[type];

              return (
                <div key={type} className="mb-2">
                  <p className="sticky top-0 z-10 flex items-center gap-2 bg-white/95 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 backdrop-blur-sm">
                    <Icon className="h-3.5 w-3.5" />
                    {SITE_SEARCH_TYPE_LABELS[type]}
                  </p>
                  <ul>
                    {typeHits.map((hit) => {
                      const itemIndex = runningIndex;
                      runningIndex += 1;
                      const isActive = itemIndex === activeIndex;

                      return (
                        <li key={hit.id}>
                          <button
                            type="button"
                            data-search-index={itemIndex}
                            onMouseEnter={() => setActiveIndex(itemIndex)}
                            onClick={() => navigateTo(hit)}
                            className={cn(
                              "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors",
                              isActive
                                ? "bg-primary/10 ring-1 ring-primary/20"
                                : "hover:bg-slate-50",
                            )}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-black leading-snug text-slate-900">
                                  {hit.title}
                                </span>
                                {hit.badge && (
                                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    {hit.badge}
                                  </span>
                                )}
                                {hit.level && (
                                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary">
                                    {hit.level}
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-500">
                                {hit.description}
                              </p>
                            </div>
                            <ArrowRight
                              className={cn(
                                "mt-1 h-4 w-4 shrink-0",
                                isActive ? "text-primary" : "text-slate-300",
                              )}
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          )}
        </div>

        {query.trim().length >= 2 && hits.length > 0 && (
          <div className="border-t border-slate-100 px-4 py-3 sm:px-5">
            <Link
              href={`/search?q=${encodeURIComponent(query.trim())}`}
              onClick={closeSearch}
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 transition-colors hover:text-primary"
            >
              Alle Ergebnisse auf der Suchseite
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}