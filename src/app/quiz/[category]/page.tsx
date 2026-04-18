"use client";

import { use, useEffect } from "react";
import { useQuizSession } from "@/hooks/use-quiz-session";
import { useLanguage } from "@/contexts/language-context";
import { QuizCategory } from "@/types/quiz";
import { ChevronLeft, MoreHorizontal, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { SessionSetup } from "@/components/quiz/session-setup";
import { QuestionProgress } from "@/components/quiz/question-progress";
import { ExplanationCard } from "@/components/quiz/explanation-card";
import { AppShell } from "@/components/layout/app-shell";

import { McqQuestion } from "@/components/quiz/mcq-question";
import { FillInBlank } from "@/components/quiz/fill-in-blank";
import { WordOrder } from "@/components/quiz/word-order";

export default function QuizOrchestrator({ params }: { params: Promise<{ category: string }> }) {
  const router = useRouter();
  const { language } = useLanguage();
  const { category } = use(params);

  const {
    questions,
    currentIndex,
    currentQuestion,
    status,
    timeRemainingMs,
    lastAnswerEvaluated,
    answers,
    startSession,
    submitAnswer,
    nextQuestion,
  } = useQuizSession();

  useEffect(() => {
    if (status === "complete") {
      const summary = {
        category,
        total: questions.length,
        correct: answers.filter(a => a.isCorrect).length,
        answers: answers
      };
      sessionStorage.setItem("lastSessionResult", JSON.stringify(summary));
      router.push("/results");
    }
  }, [status, answers, category, questions.length, router]);

  if (status === "idle") {
    return (
      <AppShell showNav={true} showHeader={true} maxWidth="md">
        <div className="pt-6">
          <SessionSetup category={category as QuizCategory} onStart={startSession} />
        </div>
      </AppShell>
    );
  }

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
      <div className="text-6xl mb-6 scale-110">🦊</div>
      <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Assembling your mastery...</p>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-sm mx-auto px-6">
      <div className="text-6xl mb-6 grayscale opacity-30">🏜️</div>
      <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tighter italic">Out of Questions</h2>
      <p className="text-slate-400 font-bold text-sm mb-8">Try adjusting your level or picking another category.</p>
      <button onClick={() => router.push("/")} className="btn-orange btn-compact w-full">Go Back</button>
    </div>
  );

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const disabled = status === "review";
    const answerForCurrent = answers.find(a => a.questionId === currentQuestion.id);

    return (
      <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Progress & Meta */}
        <div className="w-full">
          <QuestionProgress
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            timeRemainingMs={timeRemainingMs}
          />
        </div>

        {/* Question Interactive Card */}
        <div className="w-full perspective-1000">
          <div className="glass-card-premium rounded-[2.5rem] overflow-hidden">
            {currentQuestion.type === "multiple-choice" && (
              <McqQuestion question={currentQuestion} onSubmit={submitAnswer} disabled={disabled} />
            )}
            {currentQuestion.type === "fill-in-blank" && (
              <FillInBlank question={currentQuestion} onSubmit={submitAnswer} disabled={disabled} />
            )}
            {currentQuestion.type === "word-order" && (
              <WordOrder question={currentQuestion} onSubmit={submitAnswer} disabled={disabled} />
            )}
          </div>
        </div>

        {/* Review Stage: Next Button & Feedback Layer */}
        {status === "review" && (
          <div className="w-full space-y-6 animate-in zoom-in-95 duration-500">
            <ExplanationCard
              question={currentQuestion}
              isCorrect={lastAnswerEvaluated}
              userAnswer={answerForCurrent?.userAnswer || ""}
              language={language}
            />
            <button
              onClick={nextQuestion}
              className="w-full h-14 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-premium hover:bg-primary transition-all active:scale-[0.98] group mt-4 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10">
                {language === "de" ? "Nächste Frage" : language === "vi" ? "Câu tiếp theo" : "Next Question"}
              </span>
              <ChevronLeft className="w-5 h-5 relative z-10 rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <AppShell showNav={false} showHeader={true} maxWidth="md">
      {/* Immersive Responsive Header */}
      <div className="w-full flex items-center justify-between mb-8 px-2 pt-4">
        <button
          onClick={() => router.push("/")}
          className="w-10 h-10 bg-white shadow-premium rounded-xl flex items-center justify-center text-slate-400 hover:text-primary border border-slate-50 transition-all active:scale-90"
          title="Go Home"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <h1 className="text-[15px] font-black text-slate-800 tracking-tighter italic capitalize leading-none">
              {category.replace("-", " ")}
            </h1>
            <div className="p-1 px-1.5 bg-slate-100/50 rounded-lg hover:bg-slate-200 transition-colors">
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5 opacity-60">
            {currentIndex + 1} of {questions.length} • Module Active
          </p>
        </div>

        <div className="w-10 h-10 bg-white/50 backdrop-blur-md rounded-xl flex items-center justify-center text-primary/40 shadow-premium border border-white/80">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <div className="w-full">
        {status === "loading" && renderLoading()}
        {status === "error" && renderError()}
        {(status === "in-progress" || status === "review") && renderQuestion()}
      </div>
    </AppShell>
  );
}
