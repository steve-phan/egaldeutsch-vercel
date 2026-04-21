import { useState, useCallback, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { QuizQuestion, QuizSessionConfig } from "@/types/quiz";
import { API_ROUTES } from "@/lib/constants";
import { useAudio } from "@/hooks/use-audio";

export interface AnswerRecord {
  questionId: string;
  isCorrect: boolean;
  userAnswer: string;
  timeSpentMs: number;
}

interface UseQuizSessionResult {
  // State
  questions: QuizQuestion[];
  currentIndex: number;
  currentQuestion: QuizQuestion | null;
  status:
    | "idle"
    | "loading"
    | "setup"
    | "in-progress"
    | "review"
    | "complete"
    | "error";
  answers: AnswerRecord[];
  timeRemainingMs: number;
  lastAnswerEvaluated: boolean;
  config: QuizSessionConfig | null;
  // Actions
  startSession: (config: QuizSessionConfig) => Promise<void>;
  submitAnswer: (answer: string) => void;
  nextQuestion: () => void;
  finishSession: () => Promise<void>;
  reset: () => void;
}

export function useQuizSession(): UseQuizSessionResult {
  const { data: session } = useSession();
  const { playCorrect, playWrong, playFinish } = useAudio();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState<UseQuizSessionResult["status"]>("idle");
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [timeRemainingMs, setTimeRemainingMs] = useState<number>(0);
  const [lastAnswerEvaluated, setLastAnswerEvaluated] =
    useState<boolean>(false);

  // Refs for tracking time internally
  const questionStartTime = useRef<number>(0);
  const configuration = useRef<QuizSessionConfig | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  }, []);

  const currentQuestion = questions[currentIndex] || null;

  const startSession = async (config: QuizSessionConfig) => {
    // Clear everything IMMEDIATELY to prevent state leakage
    setStatus("loading");
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setLastAnswerEvaluated(false);
    setTimeRemainingMs(0);
    configuration.current = config;

    try {
      const levelParam =
        config.level === "mixed" ? "" : `&level=${config.level}`;
      const res = await fetch(
        `${API_ROUTES.QUIZ_QUESTIONS}?category=${config.category}${levelParam}&limit=${config.totalQuestions}`,
      );

      if (!res.ok) throw new Error("Failed to fetch questions");

      const data: QuizQuestion[] = await res.json();

      if (data.length === 0) {
        setStatus("error");
        return;
      }

      setQuestions(data);
      setCurrentIndex(0);
      setAnswers([]);
      setLastAnswerEvaluated(false);
      setStatus("in-progress");
    } catch {
      setStatus("error");
    }
  };

  const finishSession = useCallback(async () => {
    // Prevent multiple submissions if already loading or complete
    if (status === "loading" || status === "complete") return;

    setStatus("loading");

    const correctCount = answers.filter((a) => a.isCorrect).length;
    const score =
      questions.length > 0 ? (correctCount / questions.length) * 100 : 0;

    try {
      if (configuration.current) {
        const token = session?.user?.accessToken;

        if (token) {
          const response = await fetch(API_ROUTES.QUIZ_SUBMIT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              category: configuration.current.category,
              level: configuration.current.level,
              score,
              total_q: questions.length,
              correct_q: correctCount,
              question_ids: questions.map((q) => q.id),
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              "Failed to submit quiz session:",
              response.status,
              errorText,
            );
          }
        }
      }

      setStatus("complete");
      playFinish();
    } catch {
      setStatus("complete");
    }
  }, [status, answers, questions, session?.user?.accessToken, playFinish]);

  const evaluateAndRecordAnswer = useCallback(
    (userAnswer: string) => {
      if (!currentQuestion || status !== "in-progress") return;

      clearTimer(); // Stop the countdown

      const timeSpent = Date.now() - questionStartTime.current;

      // Evaluate correctness based on question type
      const isCorrect =
        userAnswer.toLowerCase().trim() ===
        currentQuestion.correct_answer.toLowerCase().trim();

      setAnswers((prev) => {
        // Prevent duplicate records for the same question
        if (prev.some((a) => a.questionId === currentQuestion.id)) return prev;

        return [
          ...prev,
          {
            questionId: currentQuestion.id,
            isCorrect,
            userAnswer,
            timeSpentMs: timeSpent,
          },
        ];
      });

      if (isCorrect) {
        playCorrect();
      } else {
        playWrong();
      }

      setLastAnswerEvaluated(isCorrect);
      setStatus("review");
    },
    [currentQuestion, status, clearTimer, playCorrect, playWrong],
  );

  const submitAnswer = useCallback(
    (answer: string) => {
      if (typeof answer === "string" && answer.length > 0) {
        evaluateAndRecordAnswer(answer);
      }
    },
    [evaluateAndRecordAnswer],
  );

  const nextQuestion = useCallback(() => {
    if (status !== "review") return;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setLastAnswerEvaluated(false);
      setStatus("in-progress");
    } else {
      finishSession();
    }
  }, [status, currentIndex, questions.length, finishSession]);

  // Handles time tracking per question
  useEffect(() => {
    if (status === "in-progress" && currentQuestion) {
      questionStartTime.current = Date.now();

      const config = configuration.current;
      const limitMs = config?.timePerQuestion
        ? config.timePerQuestion * 1000
        : null;

      if (limitMs !== null) {
        setTimeRemainingMs(limitMs);

        timerInterval.current = setInterval(() => {
          setTimeRemainingMs((prev) => {
            if (prev === null || prev <= 0) return 0;
            const next = prev - 100;
            return next <= 0 ? 0 : next;
          });
        }, 100);
      } else {
        // ZEN mode - count UP
        setTimeRemainingMs(0);
        timerInterval.current = setInterval(() => {
          setTimeRemainingMs((prev) => (prev ?? 0) + 100);
        }, 100);
      }
    } else {
      clearTimer();
      // Don't reset timeRemainingMs to null here, we might want to see the final time in review
    }

    return () => clearTimer();
  }, [status, currentIndex, currentQuestion, clearTimer]);

  // Effect to handle auto-submission when timer hits 0
  useEffect(() => {
    const isTimed = !!configuration.current?.timePerQuestion;
    if (isTimed && timeRemainingMs === 0 && status === "in-progress") {
      evaluateAndRecordAnswer("");
    }
  }, [timeRemainingMs, status, evaluateAndRecordAnswer]);

  const reset = () => {
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setLastAnswerEvaluated(false);
    configuration.current = null;
    clearTimer();
    setStatus("idle");
  };

  return {
    questions,
    currentIndex,
    currentQuestion,
    status,
    answers,
    timeRemainingMs,
    lastAnswerEvaluated,
    startSession,
    submitAnswer,
    nextQuestion,
    finishSession,
    reset,
    config: configuration.current,
  };
}
