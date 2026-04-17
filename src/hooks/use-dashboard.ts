import { useState, useEffect, useCallback } from "react";

export interface DashboardStats {
  total_sessions: number;
  total_questions: number;
  total_correct: number;
  accuracy: number;
  category_averages: Record<string, number>;
}

interface UseDashboardResult {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const emptyStats: DashboardStats = {
  total_sessions: 0,
  total_questions: 0,
  total_correct: 0,
  accuracy: 0,
  category_averages: {},
};

export function useDashboard(): UseDashboardResult {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setStats(emptyStats);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      const data = await res.json();
      setStats(data);
    } catch {
      setError("Failed to load dashboard stats");
      setStats(emptyStats);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
