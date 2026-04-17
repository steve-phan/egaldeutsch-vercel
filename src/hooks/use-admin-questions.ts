import { useState, useCallback } from "react";
import { QuizQuestion, LocalizedText, QuizOption } from "@/types/quiz";

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
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  const fetchQuestions = useCallback(async (category?: string, level?: string) => {
    setLoading(true);
    let url = "/api/admin/questions";
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
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createQuestion = async (question: Partial<QuizQuestion>) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(question)
      });
      if (!res.ok) throw new Error("Failed to create question");
      const data = await res.json();
      setQuestions((prev) => [...prev, data]);
      setError(null);
      return data;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async (id: string, question: Partial<QuizQuestion>) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/questions?id=${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(question)
      });
      if (!res.ok) throw new Error("Failed to update question");
      const data = await res.json();
      setQuestions((prev) => prev.map((q) => (q.id === id ? data : q)));
      setError(null);
      return data;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/questions?id=${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to delete question");
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      setError(null);
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { questions, loading, error, fetchQuestions, createQuestion, updateQuestion, deleteQuestion };
}
