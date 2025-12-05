import { useState, useCallback } from "react";

interface UseQuizResult {
  selectedAnswer: string;
  feedback: string | null;
  isChecking: boolean;
  setSelectedAnswer: (answer: string) => void;
  checkAnswer: (lessonId: string) => Promise<void>;
  resetQuiz: () => void;
}

export function useQuiz(): UseQuizResult {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkAnswer = useCallback(async (lessonId: string) => {
    if (!selectedAnswer) return;
    
    setIsChecking(true);
    try {
      const res = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson_id: lessonId,
          answer: selectedAnswer,
        }),
      });
      const data = await res.json();
      setFeedback(data.message);
    } catch (err) {
      console.error("Failed to check answer:", err);
      setFeedback("Unable to verify your answer. Please check your connection and try again.");
    } finally {
      setIsChecking(false);
    }
  }, [selectedAnswer]);

  const resetQuiz = useCallback(() => {
    setSelectedAnswer("");
    setFeedback(null);
  }, []);

  return {
    selectedAnswer,
    feedback,
    isChecking,
    setSelectedAnswer,
    checkAnswer,
    resetQuiz,
  };
}
