import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";

export interface DashboardStats {
  total_lessons: number;
  completed_lessons: number;
  quizzes_passed: number;
  total_attempts: number;
  completion_rate: number;
}

export interface LessonProgress {
  id: string;
  lesson_id: string;
  lesson_title?: string;
  completed: boolean;
  quiz_passed: boolean;
  attempts: number;
  completed_at?: string;
}

interface UseDashboardResult {
  stats: DashboardStats | null;
  progress: LessonProgress[];
  loading: boolean;
  error: string | null;
}

export function useDashboard(): UseDashboardResult {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const statsRes = await fetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch progress
        const progressRes = await fetch("/api/progress", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setProgress(progressData);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  return { stats, progress, loading, error };
}
