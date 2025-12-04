import { useState, useEffect, useCallback } from "react";
import { LessonDetail } from "@/types/lesson";

interface UseLessonResult {
  lesson: LessonDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLesson(id: string | string[] | undefined): UseLessonResult {
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (!id) {
      setLoading(false);
      return;
    }

    const lessonId = Array.isArray(id) ? id[0] : id;
    fetchLesson(lessonId);
  }, [id, fetchLesson]);

  const refetch = useCallback(() => {
    if (!id) return;
    const lessonId = Array.isArray(id) ? id[0] : id;
    fetchLesson(lessonId);
  }, [id, fetchLesson]);

  return { lesson, loading, error, refetch };
}
