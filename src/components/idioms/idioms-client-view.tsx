"use client";

import React, { useState, useMemo } from "react";
import { Idiom } from "@/types/idiom";
import { IdiomCard } from "./idiom-card";
import { IdiomSearchBar } from "./idiom-search-bar";
import { AlertCircle } from "lucide-react";
import { Pagination } from "@/components/shared/pagination";

interface IdiomsClientViewProps {
  initialIdioms: Idiom[];
}

const IDIOMS_PER_PAGE = 12;

import { useLanguage } from "@/contexts/language-context";

export function IdiomsClientView({ initialIdioms }: IdiomsClientViewProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(filteredIdioms.length / IDIOMS_PER_PAGE);
  const currentIdioms = filteredIdioms.slice(
    (currentPage - 1) * IDIOMS_PER_PAGE,
    currentPage * IDIOMS_PER_PAGE,
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

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
            onClick={() => setSearchQuery("")}
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

      {filteredIdioms.length > IDIOMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
