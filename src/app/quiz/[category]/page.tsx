"use client";

import { use, useEffect } from "react";
import { useQuizSession } from "@/hooks/use-quiz-session";
import { useLanguage } from "@/contexts/language-context";
import { QuizCategory } from "@/types/quiz";
import { Loader2, ChevronLeft, MoreHorizontal } from "lucide-react";
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

  if (status === "idle") {
     return <SessionSetup category={category as QuizCategory} onStart={startSession} />;
  }

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
       <div className="text-6xl mb-6">🦊</div>
       <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Preparing your path...</p>
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
               className="w-full btn-orange h-12 text-sm font-black flex items-center justify-center gap-2"
             >
               {language === "de" ? "Weiter" : language === "vi" ? "Tiếp theo" : "Next Question"}
               <MoreHorizontal className="w-4 h-4 ml-2" />
             </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center px-6 pb-20 pt-8">
      {/* Immersive Header */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-8">
         <button 
           onClick={() => router.push("/")} 
           className="w-10 h-10 bg-white/50 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-400 shadow-premium border border-white/80 transition-all active:scale-90"
         >
            <ChevronLeft className="w-5 h-5" />
         </button>
         <div className="text-center">
            <h1 className="text-md font-black text-slate-800 tracking-tighter italic capitalize">
               {category.replace("-", " ")}
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentIndex + 1} of {questions.length}</p>
         </div>
         <button className="w-10 h-10 bg-white/50 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-400 shadow-premium border border-white/80 transition-all active:scale-90">
            <MoreHorizontal className="w-5 h-5" />
         </button>
      </div>

      <div className="w-full max-w-2xl">
        {status === "loading" && renderLoading()}
        {status === "error" && renderError()}
        {(status === "in-progress" || status === "review") && renderQuestion()}
      </div>
    </main>
  );
}
