"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, MessageSquare } from "lucide-react";
import { Idiom } from "@/types/idiom";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface IdiomSearchBarProps {
  idioms: Idiom[];
  onSearch: (query: string) => void;
}

export function IdiomSearchBar({ idioms, onSearch }: IdiomSearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Idiom[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    onSearch(query);

    if (query.length >= 2) {
      const filtered = idioms
        .filter((idiom) => {
          const searchContent = `${idiom.title} ${idiom.meaning_de} ${idiom.meaning_en} ${idiom.meaning_vi} ${idiom.tags?.join(" ")}`.toLowerCase();
          return searchContent.includes(query.toLowerCase());
        })
        .slice(0, 5);
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
    setSelectedIndex(-1);
  }, [query, idioms, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      router.push(`/redewendung/${suggestions[selectedIndex].slug}`);
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-40">
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(suggestions.length > 0)}
          onKeyDown={handleKeyDown}
          placeholder="Search idioms, meanings, or tags..."
          className="w-full h-16 pl-14 pr-12 bg-white/70 backdrop-blur-xl border border-slate-200 rounded-[2rem] shadow-premium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-slate-800 font-bold placeholder:text-slate-400 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-5 flex items-center text-slate-300 hover:text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 p-2 bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-floating animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
          <div className="px-4 py-2 mb-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suggestions</span>
          </div>
          <div className="space-y-1">
            {suggestions.map((idiom, index) => (
              <button
                key={idiom.id}
                onClick={() => router.push(`/redewendung/${idiom.slug}`)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl transition-all text-left group/item",
                  index === selectedIndex ? "bg-primary/5 translate-x-1" : "hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-xl overflow-hidden shrink-0">
                    {idiom.thumbnail && (idiom.thumbnail.startsWith("http") || idiom.thumbnail.startsWith("/")) ? (
                      <img src={idiom.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      idiom.thumbnail || "🇩🇪"
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 italic leading-none mb-1">{idiom.title}</h4>
                    <p className="text-[11px] font-bold text-slate-400 line-clamp-1 italic">{idiom.meaning_en}</p>
                  </div>
                </div>
                <ArrowRight className={cn(
                  "w-4 h-4 transition-all opacity-0 -translate-x-2",
                  index === selectedIndex ? "text-primary opacity-100 translate-x-0" : "text-slate-300"
                )} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
