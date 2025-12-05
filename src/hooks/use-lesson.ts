import { useState, useEffect, useCallback } from "react";
import { LessonDetail } from "@/types/lesson";

interface UseLessonResult {
  lesson: LessonDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook for fetching and managing lesson data.
 * @param id - Lesson ID. Accepts string, string array (uses first element), or undefined.
 *             When undefined, the hook will not fetch and will set loading to false.
 * @returns Object containing lesson data, loading state, error state, and refetch function.
 */
export function useLesson(id: string | string[] | undefined): UseLessonResult {
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Normalize ID to string - handles Next.js dynamic route params which can be string or string[]
  const normalizedId = Array.isArray(id) ? id[0] : id;

  const fetchLesson = useCallback(async (lessonId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/lesson?id=${lessonId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch lesson");
      }
      const data = await res.json();
      setLesson(data);
    } catch (err) {
      console.error("Failed to fetch lesson:", err);
      setError("Failed to load lesson");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!normalizedId) {
      setLoading(false);
      return;
    }

    fetchLesson(normalizedId);
  }, [normalizedId, fetchLesson]);

  const refetch = useCallback(() => {
    if (!normalizedId) return;
    fetchLesson(normalizedId);
  }, [normalizedId, fetchLesson]);

  return { lesson, loading, error, refetch };
}
