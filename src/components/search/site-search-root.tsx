"use client";

import { GlobalSearchModal } from "@/components/search/global-search-modal";
import { SiteSearchProvider } from "@/contexts/site-search-context";
import type { SiteSearchEntry } from "@/lib/site-search-types";

export function SiteSearchRoot({
  children,
  entries,
}: {
  children: React.ReactNode;
  entries: SiteSearchEntry[];
}) {
  return (
    <SiteSearchProvider entries={entries}>
      {children}
      <GlobalSearchModal />
    </SiteSearchProvider>
  );
}