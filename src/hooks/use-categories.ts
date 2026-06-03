import { useState, useCallback, useEffect } from "react";
import { CategoryMeta } from "@/types/quiz";
import { API_ROUTES, CATEGORY_META, apiUrl } from "@/lib/constants";

interface UseCategoriesResult {
  stats: Record<string, Record<string, number>>;
  loading: boolean;
  error: string | null;
  getCategoriesByLevel: (level: string) => CategoryMeta[];
  getAllCategories: () => CategoryMeta[];
}

export function useCategories(initialStats?: Record<string, Record<string, number>>): UseCategoriesResult {
  const [stats, setStats] = useState<Record<string, Record<string, number>>>(initialStats || {});
  const [loading, setLoading] = useState(!initialStats);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl(API_ROUTES.QUIZ_CATEGORIES));
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      setStats(data);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch if we don't have initial stats from the server
    if (!initialStats || Object.keys(initialStats).length === 0) {
      fetchStats();
    }
  }, [fetchStats, initialStats]);

  const enrichMetaWithStats = (meta: CategoryMeta[]): CategoryMeta[] => {
    return meta.map(cat => {
      const catStats = stats[cat.id] || {};
      return {
        ...cat,
        question_counts: catStats
      };
    });
  };

  const getAllCategories = useCallback(() => {
    return enrichMetaWithStats(CATEGORY_META);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]);

  const getCategoriesByLevel = useCallback((level: string) => {
    if (level === "all") return getAllCategories();
    return enrichMetaWithStats(CATEGORY_META.filter(cat => cat.levels.includes(level as never)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats, getAllCategories]);

  return { stats, loading, error, getCategoriesByLevel, getAllCategories };
}
