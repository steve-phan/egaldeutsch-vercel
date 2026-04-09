"use client";

import { useState, useEffect } from "react";
import { useExplanationQuizAdmin } from "@/hooks/use-explanation-quiz-admin";
import { ExplanationQuizForm } from "./explanation-quiz-form";
import { ExplanationQuizList } from "./explanation-quiz-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ExplanationQuizAdmin() {
  const { quizzes, loading, error, fetchQuizzes, createQuiz, deleteQuiz } =
    useExplanationQuizAdmin();
  const [isCreating, setIsCreating] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleCreateQuiz = async (data: any) => {
    setIsCreating(true);
    try {
      await createQuiz(data);
      alert("Quiz created successfully!");
    } catch (err) {
      alert("Failed to create quiz. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    setIsDeletingId(id);
    try {
      await deleteQuiz(id);
    } catch (err) {
      alert("Failed to delete quiz");
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Explanation Quiz Admin</h1>
        <p className="text-gray-600 mt-2">
          Manage quiz questions and explanations
        </p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExplanationQuizForm
            onSubmit={handleCreateQuiz}
            isLoading={isCreating}
          />
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Quizzes:</span>
                  <span className="font-bold">{quizzes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-sm">
                    {loading ? "Loading..." : "Ready"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Quizzes</h2>
        <ExplanationQuizList
          quizzes={quizzes}
          onDelete={handleDeleteQuiz}
          isDeleting={isDeletingId}
        />
      </div>
    </div>
  );
}
