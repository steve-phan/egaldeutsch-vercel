import { useState, useEffect } from "react";

export interface Lesson {
  id: string;
  title: string;
  description: string;
}

interface UseLessonsResult {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
}

export function useLessons(): UseLessonsResult {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch("/api/lessons");
        if (!res.ok) {
          throw new Error("Failed to fetch lessons");
        }
        const data = await res.json();
        setLessons(data);
      } catch (err) {
        console.error("Failed to fetch lessons:", err);
        setError("Failed to load lessons");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  return { lessons, loading, error };
}
