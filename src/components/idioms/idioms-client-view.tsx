"use client";

import React, { useState, useMemo } from "react";
import { Idiom } from "@/types/idiom";
import { IdiomCard } from "./idiom-card";
import { IdiomSearchBar } from "./idiom-search-bar";
import { AlertCircle } from "lucide-react";

interface IdiomsClientViewProps {
  initialIdioms: Idiom[];
}

export function IdiomsClientView({ initialIdioms }: IdiomsClientViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIdioms = useMemo(() => {
    if (searchQuery.length < 3) return initialIdioms;

    const query = searchQuery.toLowerCase();
    return initialIdioms.filter((idiom) => {
      return (
        idiom.title.toLowerCase().includes(query) ||
        idiom.meaning_en.toLowerCase().includes(query) ||
        idiom.meaning_vi.toLowerCase().includes(query) ||
        idiom.meaning_de.toLowerCase().includes(query) ||
        idiom.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [searchQuery, initialIdioms]);

  return (
    <div className="space-y-12">
      {/* Search Bar Section */}
      <div className="w-full animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
        <IdiomSearchBar idioms={initialIdioms} onSearch={setSearchQuery} />
      </div>

      {/* Grid Section */}
      {filteredIdioms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-700 delay-200">
          {filteredIdioms.map((idiom) => (
            <IdiomCard key={idiom.id} idiom={idiom} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 border border-slate-100 mb-6 drop-shadow-sm">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 italic">No idioms found</h2>
          <p className="text-slate-400 font-bold max-w-xs mx-auto">
            We couldn't find any idioms matching "{searchQuery}". Try a different keyword or check your spelling.
          </p>
          <button 
            onClick={() => setSearchQuery("")}
            className="mt-8 px-6 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Results Counter if searching */}
      {searchQuery.length >= 3 && filteredIdioms.length > 0 && (
        <div className="text-center">
            <span className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                Showing {filteredIdioms.length} results for "{searchQuery}"
            </span>
        </div>
      )}
    </div>
  );
}
