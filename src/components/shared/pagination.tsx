"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPageItems(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages]);

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page >= 1 && page <= totalPages) pages.add(page);
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b);
  const items: Array<number | "ellipsis"> = [];

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];
    if (previousPage && page - previousPage > 1) {
      items.push("ellipsis");
    }
    items.push(page);
  });

  return items;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    onPageChange(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
    >
      <button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:border-primary/30 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
        Prev
      </button>

      {getPageItems(currentPage, totalPages).map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-10 min-w-10 items-center justify-center rounded-xl text-sm font-bold text-slate-400"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => goToPage(item)}
            aria-current={item === currentPage ? "page" : undefined}
            className={cn(
              "flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-black shadow-sm transition-colors",
              item === currentPage
                ? "border-primary bg-primary text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-primary/30 hover:text-primary",
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:border-primary/30 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
