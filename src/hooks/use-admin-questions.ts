import { useState, useCallback } from "react";
import { QuizQuestion } from "@/types/quiz";
import { API_ROUTES } from "@/lib/constants";
import { useSession } from "next-auth/react";

interface UseAdminQuestionsResult {
  questions: QuizQuestion[];
  loading: boolean;
  error: string | null;
  fetchQuestions: (category?: string, level?: string) => Promise<void>;
  createQuestion: (question: Partial<QuizQuestion>) => Promise<QuizQuestion | null>;
  updateQuestion: (id: string, question: Partial<QuizQuestion>) => Promise<QuizQuestion | null>;
  deleteQuestion: (id: string) => Promise<boolean>;
}

export function useAdminQuestions(): UseAdminQuestionsResult {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = () => {
    const token = (session?.user as any)?.accessToken;
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  const fetchQuestions = useCallback(async (category?: string, level?: string) => {
    setLoading(true);
    let url = API_ROUTES.ADMIN_QUESTIONS;
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (level) params.append("level", level);
    if (params.toString()) url += `?${params.toString()}`;

    try {
      const res = await fetch(url, { headers: getHeaders() });
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data = await res.json();
      setQuestions(data);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const createQuestion = async (question: Partial<QuizQuestion>) => {
    setLoading(true);
    try {
      const res = await fetch(API_ROUTES.ADMIN_QUESTIONS, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(question)
      });
      if (!res.ok) throw new Error("Failed to create question");
      const data = await res.json();
      setQuestions((prev) => [...prev, data]);
      setError(null);
      return data;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An unknown error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async (id: string, question: Partial<QuizQuestion>) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_ROUTES.ADMIN_QUESTIONS}?id=${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(question)
      });
      if (!res.ok) throw new Error("Failed to update question");
      const data = await res.json();
      setQuestions((prev) => prev.map((q) => (q.id === id ? data : q)));
      setError(null);
      return data;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An unknown error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_ROUTES.ADMIN_QUESTIONS}?id=${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to delete question");
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      setError(null);
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An unknown error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { questions, loading, error, fetchQuestions, createQuestion, updateQuestion, deleteQuestion };
}
