import { useState, useEffect } from "react";
import { LessonDetail } from "@/types/lesson";

export function useLesson(id: string | string[] | undefined) {
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const lessonId = Array.isArray(id) ? id[0] : id;

    setLoading(true);
    fetch(`/api/lesson?id=${lessonId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch lesson");
        return res.json();
      })
      .then((data) => {
        setLesson(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch lesson:", err);
        setError("Failed to load lesson");
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { lesson, loading, error };
}
