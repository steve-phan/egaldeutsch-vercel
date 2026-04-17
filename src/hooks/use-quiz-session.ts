import { useState, useCallback, useRef, useEffect } from "react";
import { QuizQuestion, QuizSessionConfig } from "@/types/quiz";
import { API_ROUTES } from "@/lib/constants";

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
  status: "idle" | "loading" | "setup" | "in-progress" | "review" | "complete" | "error";
  answers: AnswerRecord[];
  timeRemainingMs: number 
  lastAnswerEvaluated: boolean  
  // Actions
  startSession: (config: QuizSessionConfig) => Promise<void>;
  submitAnswer: (answer: string) => void;
  nextQuestion: () => void;
  finishSession: () => Promise<void>;
  reset: () => void;
}

export function useQuizSession(): UseQuizSessionResult {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState<UseQuizSessionResult["status"]>("idle");
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [timeRemainingMs, setTimeRemainingMs] = useState<number>(0);
  const [lastAnswerEvaluated, setLastAnswerEvaluated] = useState<boolean>(false);
  
  // Refs for tracking time internally
  const questionStartTime = useRef<number>(0);
  const configuration = useRef<QuizSessionConfig | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };

  const currentQuestion = questions[currentIndex] || null;

  // Handles time tracking per question
  useEffect(() => {
    if (status === "in-progress" && currentQuestion) {
      questionStartTime.current = Date.now();
      
      const config = configuration.current;
      if (config?.timePerQuestion) {
        setTimeRemainingMs(config.timePerQuestion * 1000);
        
        timerInterval.current = setInterval(() => {
          setTimeRemainingMs((prev) => {
            if (prev === 0) return 0;
            if (prev <= 100) {
              clearInterval(timerInterval.current!);
              // Auto-submit empty answer on timeout
              // We need to use slightly indirect logic here since submitAnswer depends on current state
              return 0;
            }
            return prev - 100;
          });
        }, 100);
      } else {
        setTimeRemainingMs(0);
      }
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [status, currentIndex, currentQuestion]);

  // Effect to handle auto-submission when timer hits 0
  useEffect(() => {
    // Only auto-submit if a time limit was actually configured AND it hit 0
    if (configuration.current?.timePerQuestion && timeRemainingMs === 0 && status === "in-progress") {
       // Using an empty string for timeout
       evaluateAndRecordAnswer("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemainingMs, status]);


  const startSession = async (config: QuizSessionConfig) => {
    // Clear everything IMMEDIATELY to prevent state leakage
    setStatus("loading");
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setLastAnswerEvaluated(false);
    configuration.current = config;
    
    try {
      const levelParam = config.level === "mixed" ? "" : `&level=${config.level}`;
      const res = await fetch(`${API_ROUTES.QUIZ_QUESTIONS}?category=${config.category}${levelParam}&limit=${config.totalQuestions}`);
      
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

  const evaluateAndRecordAnswer = useCallback((userAnswer: string) => {
    if (!currentQuestion || status !== "in-progress") return;
    
    clearTimer(); // Stop the countdown
    
    const timeSpent = Date.now() - questionStartTime.current;
    
    // Evaluate correctness based on question type
    const isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.correct_answer.toLowerCase().trim();
    
    setAnswers(prev => {
      // Prevent duplicate records for the same question
      if (prev.some(a => a.questionId === currentQuestion.id)) return prev;
      
      return [...prev, {
        questionId: currentQuestion.id,
        isCorrect,
        userAnswer,
        timeSpentMs: timeSpent
      }];
    });
    
    setLastAnswerEvaluated(isCorrect);
    setStatus("review");
  }, [currentQuestion, status]);

  const submitAnswer = useCallback((answer: string) => {
     evaluateAndRecordAnswer(answer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, status]);

  const nextQuestion = useCallback(() => {
    if (status !== "review") return;
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setLastAnswerEvaluated(false);
      setStatus("in-progress");
    } else {
      finishSession();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, currentIndex, questions.length]);

  const finishSession = async () => {
    setStatus("loading");
    
    const correctCount = answers.filter(a => a.isCorrect).length;
    const score = (correctCount / questions.length) * 100;
    
    try {
      if (configuration.current) {
          const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
          
          if (token) {
            await fetch(API_ROUTES.QUIZ_SUBMIT, {
              method: "POST",
              headers: { 
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                  category: configuration.current.category,
                  level: configuration.current.level,
                  score,
                  total_q: questions.length,
                  correct_q: correctCount
              })
            });
          }
      }
      setStatus("complete");
    } catch {
       // Even if submission fails, show user their local results
       setStatus("complete");
    }
  };

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
  };
}
