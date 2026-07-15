"use client";

import { Search } from "lucide-react";
import { useSiteSearch } from "@/contexts/site-search-context";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  showShortcut?: boolean;
};

export function GlobalSearchTrigger({ className, showShortcut = true }: Props) {
  const { openSearch } = useSiteSearch();

  return (
    <button
      type="button"
      onClick={() => openSearch()}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-slate-100 bg-white/70 text-slate-500 shadow-sm transition-colors hover:border-primary/20 hover:text-primary",
        className,
      )}
      aria-label="Globale Suche öffnen"
    >
      <Search className="h-4 w-4 shrink-0" />
      <span className="hidden text-xs font-bold text-slate-400 lg:inline">
        Suchen …
      </span>
      {showShortcut && (
        <kbd className="hidden rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-slate-400 md:inline">
          ⌘K
        </kbd>
      )}
    </button>
  );
}