"use client";

import { useEffect, useState } from "react";
import { ExplanationQuizPlayer } from "@/components/explanation-quiz-player";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ExplanationQuiz } from "@/types/explanation-quiz";

export default function ExplanationQuizPage() {
  const [quizzes, setQuizzes] = useState<ExplanationQuiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("/api/explanation-quiz");
        if (!res.ok) throw new Error("Failed to fetch quizzes");
        const data = await res.json();
        setQuizzes(data || []);
        if (data && data.length > 0) {
          setSelectedQuizId(data[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading quizzes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">No quizzes available yet.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Erklär Quiz</h1>
        <p className="text-gray-600">
          Learn German through explanation-based quizzes. Understand not just
          the answer, but why!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quiz List */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold mb-4">Quizzes ({quizzes.length})</h3>
              <div className="space-y-2">
                {quizzes.map((quiz) => (
                  <Button
                    key={quiz.id}
                    onClick={() => setSelectedQuizId(quiz.id)}
                    variant={selectedQuizId === quiz.id ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto"
                  >
                    <div className="truncate">
                      <div className="font-semibold text-sm">
                        {quiz.title || quiz.question}
                      </div>
                      <div className="text-xs opacity-75">{quiz.category}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Player */}
        <div className="lg:col-span-3">
          {selectedQuiz && <ExplanationQuizPlayer quiz={selectedQuiz} />}
        </div>
      </div>
    </div>
  );
}
