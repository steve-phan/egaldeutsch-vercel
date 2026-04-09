"use client";

import { useState, useCallback } from "react";
import type {
  ExplanationQuiz,
  CreateExplanationQuizRequest,
} from "@/types/explanation-quiz";

interface UseExplanationQuizAdminResult {
  quizzes: ExplanationQuiz[];
  loading: boolean;
  error: string | null;
  fetchQuizzes: () => Promise<void>;
  createQuiz: (data: CreateExplanationQuizRequest) => Promise<void>;
  updateQuiz: (id: string, data: Partial<ExplanationQuiz>) => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;
}

export function useExplanationQuizAdmin(): UseExplanationQuizAdminResult {
  const [quizzes, setQuizzes] = useState<ExplanationQuiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/explanation-quiz");
      if (!res.ok) throw new Error("Failed to fetch quizzes");
      const data = await res.json();
      setQuizzes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const createQuiz = useCallback(
    async (data: CreateExplanationQuizRequest) => {
      setError(null);
      try {
        const res = await fetch("/api/explanation-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create quiz");
        const newQuiz = await res.json();
        setQuizzes([newQuiz, ...quizzes]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        throw err;
      }
    },
    [quizzes],
  );

  const updateQuiz = useCallback(
    async (id: string, data: Partial<ExplanationQuiz>) => {
      setError(null);
      try {
        const res = await fetch(`/api/explanation-quiz?id=${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update quiz");
        const updated = await res.json();
        setQuizzes(quizzes.map((q) => (q.id === id ? updated : q)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        throw err;
      }
    },
    [quizzes],
  );

  const deleteQuiz = useCallback(
    async (id: string) => {
      setError(null);
      try {
        const res = await fetch(`/api/explanation-quiz?id=${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete quiz");
        setQuizzes(quizzes.filter((q) => q.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        throw err;
      }
    },
    [quizzes],
  );

  return {
    quizzes,
    loading,
    error,
    fetchQuizzes,
    createQuiz,
    updateQuiz,
    deleteQuiz,
  };
}
