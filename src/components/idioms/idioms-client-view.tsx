"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Idiom } from "@/types/idiom";
import { IdiomCard } from "./idiom-card";
import { IdiomSearchBar } from "./idiom-search-bar";
import { AlertCircle } from "lucide-react";

interface IdiomsClientViewProps {
  initialIdioms: Idiom[];
}

const IDIOMS_PER_PAGE = 12;

import { useLanguage } from "@/contexts/language-context";

export function IdiomsClientView({ initialIdioms }: IdiomsClientViewProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(IDIOMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const filteredIdioms = useMemo(() => {
    if (searchQuery.length < 3) return initialIdioms;

    const query = searchQuery.toLowerCase();
    return initialIdioms.filter((idiom) => {
      return (
        idiom.title.toLowerCase().includes(query) ||
        idiom.meaning_en.toLowerCase().includes(query) ||
        idiom.meaning_vi.toLowerCase().includes(query) ||
        idiom.meaning_de.toLowerCase().includes(query) ||
        idiom.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [searchQuery, initialIdioms]);

  const currentIdioms = filteredIdioms.slice(0, visibleCount);
  const hasMoreIdioms = visibleCount < filteredIdioms.length;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setVisibleCount(IDIOMS_PER_PAGE);
  };

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !hasMoreIdioms) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) =>
            Math.min(count + IDIOMS_PER_PAGE, filteredIdioms.length),
          );
        }
      },
      { rootMargin: "360px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredIdioms.length, hasMoreIdioms]);

  return (
    <div className="space-y-12">
      {/* Search Bar Section */}
      <div className="w-full animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
        <IdiomSearchBar idioms={initialIdioms} onSearch={handleSearch} />
      </div>

      {/* Grid Section */}
      {filteredIdioms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-700 delay-200">
          {currentIdioms.map((idiom) => (
            <IdiomCard key={idiom.id} idiom={idiom} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 border border-slate-100 mb-6 drop-shadow-sm">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 italic">{t("idioms.no_results")}</h2>
          <p className="text-slate-400 font-bold max-w-xs mx-auto">
            {t("idioms.no_results_desc").replace("{query}", searchQuery)}
          </p>
          <button
            onClick={() => handleSearch("")}
            className="mt-8 px-6 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
          >
            {t("idioms.clear_search")}
          </button>
        </div>
      )}

      {/* Results Counter if searching */}
      {searchQuery.length >= 3 && filteredIdioms.length > 0 && (
        <div className="text-center">
          <span className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
            {t("idioms.results_count")
              .replace("{count}", filteredIdioms.length.toString())
              .replace("{query}", searchQuery)}
          </span>
        </div>
      )}

      {hasMoreIdioms && (
        <div ref={loadMoreRef} className="flex justify-center">
          <span className="rounded-full border border-slate-100 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-premium">
            Loading more idioms…
          </span>
        </div>
      )}
    </div>
  );
}
