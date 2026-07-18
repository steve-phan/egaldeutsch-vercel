"use client";

import { useEffect, useState } from "react";
import { useQuizSession } from "@/hooks/use-quiz-session";
import { useLanguage } from "@/contexts/language-context";
import { QuizCategory } from "@/types/quiz";
import { ChevronLeft, MoreHorizontal, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { SessionSetup } from "@/components/quiz/session-setup";
import { QuestionProgress } from "@/components/quiz/question-progress";
import { ExplanationCard } from "@/components/quiz/explanation-card";
import { AppShell } from "@/components/layout/app-shell";
import { Section } from "@/components/shared/layout/section";

import { McqQuestion } from "@/components/quiz/mcq-question";
import { FillInBlank } from "@/components/quiz/fill-in-blank";
import { WordOrder } from "@/components/quiz/word-order";
import { MatchingPairs } from "@/components/quiz/matching-pairs";
import { ReadingComprehension } from "@/components/quiz/reading-comprehension";
import { Button } from "@/components/ui/button";

export function QuizClientView({ category }: { category: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

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
    config,
    estimatedLevel,
  } = useQuizSession();

  const [answerDraft, setAnswerDraft] = useState<{
    questionId: string;
    value: string;
  }>({ questionId: "", value: "" });

  // Handle retry and autoStart logic from URL
  useEffect(() => {
    const isRetry = searchParams.get("retry") === "true";
    const autoStart = searchParams.get("autoStart") === "true";
    const mode = searchParams.get("mode") as "test" | "practice" | null;

    if (status === "idle") {
      if (isRetry) {
        const lastResult = sessionStorage.getItem("lastSessionResult");
        if (lastResult) {
          try {
            const parsed = JSON.parse(lastResult);
            if (parsed.config && parsed.config.category === category) {
              startSession(parsed.config);
            }
          } catch (e) {
            console.error("Failed to parse last session for retry", e);
          }
        }
      } else if (autoStart) {
        startSession({
          category: category as QuizCategory,
          level: "mixed",
          totalQuestions: 30,
          mode: mode || "practice",
        });
      }
    }
  }, [searchParams, status, category, startSession]);

  useEffect(() => {
    if (status === "complete") {
      const summary = {
        category,
        total: questions.length,
        correct: answers.filter(a => a.isCorrect).length,
        answers: answers,
        config: config,
        estimatedLevel: estimatedLevel
      };
      sessionStorage.setItem("lastSessionResult", JSON.stringify(summary));
      router.push("/results");
    }
  }, [status, answers, category, questions.length, router, config, estimatedLevel]);

  if (status === "idle") {
    return (
      <AppShell showNav={true} showHeader={true} maxWidth="md">
        <Section spacing="sm">
          <SessionSetup category={category as QuizCategory} onStart={startSession} />
        </Section>
      </AppShell>
    );
  }

  const renderLoading = () => (
    <Section spacing="xl" className="flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
      <div className="text-6xl mb-6 scale-110">🦊</div>
      <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">{t("quiz_ui.assembling_mastery")}</p>
    </Section>
  );

  const renderError = () => (
    <Section spacing="lg" className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-sm mx-auto">
      <div className="text-6xl mb-6 grayscale opacity-30">🏜️</div>
      <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tighter italic">{t("quiz_ui.out_of_questions")}</h2>
      <p className="text-slate-400 font-bold text-sm mb-8">{t("quiz_ui.try_adjust_filter")}</p>
      <button onClick={() => router.push("/")} className="btn-orange btn-compact w-full shadow-premium">{t("quiz_ui.go_back")}</button>
    </Section>
  );

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const disabled = status === "review";
    const answerForCurrent = answers.find(a => a.questionId === currentQuestion.id);
    const currentAnswerDraft =
      answerDraft.questionId === currentQuestion.id ? answerDraft.value : "";
    const updateAnswerDraft = (value: string) => {
      setAnswerDraft({ questionId: currentQuestion.id, value });
    };

    return (
      <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Section spacing="none">
          <QuestionProgress
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            timeRemainingMs={timeRemainingMs}
          />
        </Section>

        <Section spacing="none" className="perspective-1000">
          <div className="glass-card-premium rounded-[2.5rem] overflow-hidden border border-white/50 shadow-premium">
            {currentQuestion.type === "multiple-choice" && (
              <McqQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                onAnswerChange={updateAnswerDraft}
                disabled={disabled}
              />
            )}
            {currentQuestion.type === "reading-comprehension" && (
              <ReadingComprehension
                key={currentQuestion.id}
                question={currentQuestion}
                onAnswerChange={updateAnswerDraft}
                disabled={disabled}
              />
            )}
            {currentQuestion.type === "fill-in-blank" && (
              <FillInBlank
                key={currentQuestion.id}
                question={currentQuestion}
                onAnswerChange={updateAnswerDraft}
                disabled={disabled}
              />
            )}
            {currentQuestion.type === "word-order" && (
              <WordOrder
                key={currentQuestion.id}
                question={currentQuestion}
                onAnswerChange={updateAnswerDraft}
                disabled={disabled}
              />
            )}
            {currentQuestion.type === "matching" && (
              <MatchingPairs
                key={currentQuestion.id}
                pairs={(currentQuestion.options || []).map((opt, i) => {
                  const [word, match] = opt.split("|");
                  return { id: i, word: word || opt, match: match || "???" };
                })}
                onComplete={() => {
                  updateAnswerDraft("MATCHED");
                  // For matching, we might want to auto-submit when done
                  setTimeout(() => submitAnswer("MATCHED"), 500);
                }}
              />
            )}

          </div>
        </Section>

        {/* Unified Submit Button (when in progress) */}
        {status === "in-progress" && (
          <Section spacing="none" className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Button
              onClick={() => submitAnswer(currentAnswerDraft)}
              disabled={!currentAnswerDraft.trim()}
              className="w-full h-14 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-premium hover:bg-primary transition-all active-bounce group mt-4 overflow-hidden relative disabled:opacity-30 disabled:grayscale disabled:pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10">
                {t("quiz_ui.check")}
              </span>
              <Sparkles className="w-5 h-5 relative z-10 animate-pulse" />
            </Button>

            {/* Hidden skip for stuck users - visible only if no answer selected for 5s? 
                Actually, let's just add a subtle skip button for practice mode if needed, 
                or just rely on the validation. Let's add a small 'Report/Skip' below. */}
            {!currentAnswerDraft.trim() && (
              <button
                onClick={nextQuestion}
                className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-primary transition-colors text-center"
              >
                {t("quiz_ui.skip_question")}
              </button>
            )}
          </Section>
        )}

        {status === "review" && (
          <Section spacing="none" className="space-y-6 animate-in zoom-in-95 duration-500">
            <Button
              onClick={nextQuestion}
              className="w-full h-14 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-premium hover:bg-primary transition-all active-bounce group mt-4 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10">
                {t("quiz_ui.next")}
              </span>
              <ChevronLeft className="w-5 h-5 relative z-10 rotate-180 group-hover:translate-x-1 transition-transform" />
            </Button>

            <ExplanationCard
              question={currentQuestion}
              isCorrect={lastAnswerEvaluated}
              userAnswer={answerForCurrent?.userAnswer || ""}
            />
          </Section>
        )}
      </div>
    );
  };

  return (
    <AppShell showNav={false} showHeader={true} maxWidth="md">
      <Section spacing="sm">
        <div className="w-full flex items-center justify-between px-1">
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
                {category === "mixed" || category.includes(",") ? "Mixed Practice" : category.replace("-", " ")}
              </h1>
              <div className="p-1 px-1.5 bg-slate-100/50 rounded-lg hover:bg-slate-200 transition-colors">
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </div>
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5 opacity-60">
              {currentIndex + 1} {t("quiz_ui.of")} {questions.length} • {t("quiz_ui.module_active")}
            </p>
          </div>

          <div className="w-10 h-10 bg-white/50 backdrop-blur-md rounded-xl flex items-center justify-center text-primary/40 shadow-premium border border-white/80">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </Section>

      <div className="w-full pb-12">
        {status === "loading" && renderLoading()}
        {status === "error" && renderError()}
        {(status === "in-progress" || status === "review") && renderQuestion()}
      </div>
    </AppShell>
  );
}
