"use client";

import { use, useEffect } from "react";
import { useQuizSession } from "@/hooks/use-quiz-session";
import { useLanguage } from "@/contexts/language-context";
import { QuizCategory } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, MoreVertical } from "lucide-react";
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


  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
       <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
       <p className="text-slate-500 font-bold">Preparing your quiz...</p>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
       <div className="text-6xl mb-6">🏜️</div>
       <h2 className="text-2xl font-black text-slate-800 mb-2">No Questions Found</h2>
       <p className="text-slate-500 mb-8 font-bold">Try adjusting your level or category.</p>
       <Button onClick={() => window.location.reload()} className="btn-orange h-14 px-8">Go Back</Button>
    </div>
  );

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const disabled = status === "review";
    const answerForCurrent = answers.find(a => a.questionId === currentQuestion.id);

    return (
      <div className="w-full animate-in fade-in slide-in-from-right-8 duration-500 max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-6">
          <QuestionProgress 
            currentIndex={currentIndex} 
            totalQuestions={questions.length} 
            timeRemainingMs={timeRemainingMs} 
          />
        </div>

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
        </div>

        {/* Review Stage: Next Button */}
        {status === "review" && (
          <div className="w-full flex flex-col items-center gap-6">
             <ExplanationCard 
                question={currentQuestion} 
                isCorrect={lastAnswerEvaluated}
                userAnswer={answerForCurrent?.userAnswer || ""}
                language={language}
             />
             <Button 
               size="lg" 
               onClick={nextQuestion}
               className="w-full h-16 text-xl font-black btn-orange"
             >
               {language === "de" ? "Weiter" : language === "vi" ? "Tiếp theo" : "Next Question"}
             </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center pt-8 px-6 pb-32">
      {/* Top Header from Prototype */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-10">
         <button onClick={() => router.push("/")} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm">
            <ChevronLeft className="w-6 h-6" />
         </button>
         <h1 className="text-xl font-black text-slate-800 capitalize">
            {category.replace("-", " ")}
         </h1>
         <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm">
            <MoreVertical className="w-6 h-6" />
         </button>
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
