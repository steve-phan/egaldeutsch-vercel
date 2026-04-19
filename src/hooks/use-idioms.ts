import { useState, useCallback } from "react";
import { Idiom } from "@/types/idiom";
import { API_ROUTES } from "@/lib/constants";

interface UseIdiomsResult {
  idioms: Idiom[];
  randomIdiom: Idiom | null;
  loading: boolean;
  randomLoading: boolean;
  error: string | null;
  fetchAllIdioms: () => Promise<void>;
  fetchRandomIdiom: () => Promise<void>;
  getIdiomBySlug: (slug: string) => Promise<Idiom | null>;
}

export function useIdioms(): UseIdiomsResult {
  const [idioms, setIdioms] = useState<Idiom[]>([]);
  const [randomIdiom, setRandomIdiom] = useState<Idiom | null>(null);
  const [loading, setLoading] = useState(false);
  const [randomLoading, setRandomLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllIdioms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API_ROUTES.IDIOMS);
      if (!res.ok) throw new Error("Failed to load idioms");
      const data = await res.json();
      setIdioms(data);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRandomIdiom = useCallback(async () => {
    try {
      setRandomLoading(true);
      const res = await fetch(API_ROUTES.IDIOM_RANDOM);
      if (!res.ok) throw new Error("Failed to load random idiom");
      const data = await res.json();
      setRandomIdiom(data);
    } catch (e: unknown) {
      console.error("Random fetch error:", e);
    } finally {
      setRandomLoading(false);
    }
  }, []);

  const getIdiomBySlug = useCallback(async (slug: string): Promise<Idiom | null> => {
    try {
      const res = await fetch(`${API_ROUTES.IDIOM_DETAIL}${slug}`);
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }, []);

  return { 
    idioms, 
    randomIdiom,
    loading, 
    randomLoading,
    error, 
    fetchAllIdioms,
    fetchRandomIdiom,
    getIdiomBySlug,
  };
}
