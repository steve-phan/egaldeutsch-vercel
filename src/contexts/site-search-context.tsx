"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { SiteSearchEntry } from "@/lib/site-search-types";

type SiteSearchContextValue = {
  entries: SiteSearchEntry[];
  isOpen: boolean;
  openSearch: (initialQuery?: string) => void;
  closeSearch: () => void;
  initialQuery: string;
};

const SiteSearchContext = createContext<SiteSearchContextValue | null>(null);

export function SiteSearchProvider({
  children,
  entries,
}: {
  children: React.ReactNode;
  entries: SiteSearchEntry[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");

  const openSearch = useCallback((query = "") => {
    setInitialQuery(query);
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setInitialQuery("");
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isModifier = event.metaKey || event.ctrlKey;
      if (isModifier && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setInitialQuery("");
        setIsOpen((current) => !current);
        return;
      }

      if (event.key === "Escape") {
        setIsOpen(false);
        setInitialQuery("");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const value = useMemo(
    () => ({
      entries,
      isOpen,
      openSearch,
      closeSearch,
      initialQuery,
    }),
    [entries, isOpen, openSearch, closeSearch, initialQuery],
  );

  return (
    <SiteSearchContext.Provider value={value}>
      {children}
    </SiteSearchContext.Provider>
  );
}

export function useSiteSearch() {
  const context = useContext(SiteSearchContext);
  if (!context) {
    throw new Error("useSiteSearch must be used within SiteSearchProvider");
  }
  return context;
}