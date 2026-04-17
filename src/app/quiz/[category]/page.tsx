"use client";

import { use, useEffect } from "react";
import { useQuizSession } from "@/hooks/use-quiz-session";
import { useLanguage } from "@/contexts/language-context";
import { QuizCategory } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { SessionSetup } from "@/components/quiz/session-setup";
import { QuestionProgress } from "@/components/quiz/question-progress";
import { ExplanationCard } from "@/components/quiz/explanation-card";

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

  // If session completes, pass data to results page
  useEffect(() => {
    if (status === "complete") {
       // Ideally we'd pass this via state management or an ID, but for the MVP 
       // we can safely stash it in sessionStorage and redirect
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


  // ────────────────────────────────────────────────────────────────────────
  // Render Helpers
  // ────────────────────────────────────────────────────────────────────────

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
       <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
       <p className="text-slate-500 text-lg">Preparing your quiz...</p>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
       <div className="text-6xl mb-6">🏜️</div>
       <h2 className="text-2xl font-bold text-slate-800 mb-2">No Questions Found</h2>
       <p className="text-slate-500 mb-8">We couldn&apos;t load any questions for this configuration. Try adjusting your level or category.</p>
       <Button onClick={() => window.location.reload()}>Go Back</Button>
    </div>
  );

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const disabled = status === "review";
    const answerForCurrent = answers.find(a => a.questionId === currentQuestion.id);

    return (
      <div className="w-full animate-in fade-in slide-in-from-right-8 duration-500">
        {/* Progress & Timer */}
        <QuestionProgress 
          currentIndex={currentIndex} 
          totalQuestions={questions.length} 
          timeRemainingMs={timeRemainingMs} 
          // Re-calculate the expected ms based on total configured if we had it exposed
          // For MVP, just pass down the tracking
        />

        {/* Question Interactive Component */}
        <div className="w-full mb-8">
           {currentQuestion.type === "multiple-choice" && (
             <McqQuestion question={currentQuestion} onSubmit={submitAnswer} disabled={disabled} />
           )}
           {currentQuestion.type === "fill-in-blank" && (
             <FillInBlank question={currentQuestion} onSubmit={submitAnswer} disabled={disabled} />
           )}
           {currentQuestion.type === "word-order" && (
             <WordOrder question={currentQuestion} onSubmit={submitAnswer} disabled={disabled} />
           )}
           {/* Fallback */}
           {!["multiple-choice", "fill-in-blank", "word-order"].includes(currentQuestion.type) && (
              <div className="p-8 text-center bg-amber-50 rounded-lg border border-amber-200">
                 Unsupported question type: {currentQuestion.type}
              </div>
           )}
        </div>

        {/* Review Stage: Explanation & Next Button */}
        {status === "review" && (
          <div className="w-full">
            <ExplanationCard 
               question={currentQuestion} 
               isCorrect={lastAnswerEvaluated}
               userAnswer={answerForCurrent?.userAnswer || ""}
               language={language}
            />

            <div className="mt-8 flex justify-end">
               <Button 
                 size="lg" 
                 onClick={nextQuestion}
                 className="px-12 text-lg h-14"
               >
                 {language === "de" ? "Weiter" : language === "vi" ? "Tiếp theo" : "Next Question"}
               </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ────────────────────────────────────────────────────────────────────────
  // Main Return
  // ────────────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center pt-16 px-4 md:px-8 pb-32">
      {/* Dynamic Header */}
      <div className="w-full max-w-4xl mb-12 flex justify-between items-center">
         <h1 className="text-3xl font-bold text-slate-800 capitalize">
            {category.replace("-", " ")}
         </h1>
         <Button variant="ghost" onClick={() => router.push("/")} className="text-slate-500 hover:text-slate-800">
           {language === "de" ? "Abbrechen" : language === "vi" ? "Hủy" : "Cancel Session"}
         </Button>
      </div>

      <div className="w-full max-w-4xl">
        {status === "idle" && <SessionSetup category={category as QuizCategory} onStart={startSession} />}
        {status === "loading" && renderLoading()}
        {status === "error" && renderError()}
        {(status === "in-progress" || status === "review") && renderQuestion()}
      </div>
    </main>
  );
}
