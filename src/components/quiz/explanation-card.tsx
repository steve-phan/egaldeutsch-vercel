"use client";

import { QuizQuestion } from "@/types/quiz";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import Image from "next/image";

interface ExplanationCardProps {
   question: QuizQuestion;
   isCorrect: boolean;
   userAnswer: string;
   language?: "en" | "de" | "vi";
}

export function ExplanationCard({
   question,
   isCorrect,
   language = "en"
}: ExplanationCardProps) {

   const getFeedbackHeader = () => {
      if (isCorrect) {
         switch (language) {
            case "de": return "Super!";
            case "vi": return "Tuyệt vời!";
            default: return "Awesome!";
         }
      } else {
         switch (language) {
            case "de": return "Fast!";
            case "vi": return "Gần đúng!";
            default: return "Not quite!";
         }
      }
   };

   const getExplanationText = () => {
      switch (language) {
         case "de": return question.explanation_de;
         case "vi": return question.explanation_vi;
         default: return question.explanation_en;
      }
   };

   return (
      <div className={`
      relative w-full rounded-[2.5rem] p-6 md:p-8 overflow-hidden border-2 transition-all duration-700
      ${isCorrect
            ? "bg-emerald-50/50 border-emerald-100 shadow-xl shadow-emerald-500/10"
            : "bg-rose-50/50 border-rose-100 shadow-xl shadow-rose-500/10"}
    `}>
         {/* Dynamic Background Accent */}
         <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -mr-20 -mt-20 opacity-20 ${isCorrect ? "bg-emerald-400" : "bg-rose-400"}`} />

         <div className="flex items-start justify-between relative z-10 gap-6">
            <div className="flex-1 space-y-6">
               <div className="flex items-center gap-3">
                  {isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-rose-500" />}
                  <h3 className={`text-xl font-black italic tracking-tighter ${isCorrect ? "text-emerald-600" : "text-rose-600"}`}>
                     {getFeedbackHeader()}
                  </h3>
               </div>

               {!isCorrect && (
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correct Answer</p>
                     <h3 className="text-lg font-semibold italic text-primary-600">{question.correct_answer}</h3>
                  </div>
               )}

               <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-400">
                     <Lightbulb className="w-4 h-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Grammar Hint</span>
                  </div>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed bg-white/40 p-5 rounded-2xl border border-white/60 shadow-sm">
                     {getExplanationText()}
                  </p>
               </div>
            </div>

            {/* Mascot Feedback fox */}
            <div className="hidden sm:flex flex-col items-center shrink-0">
               <div className="w-24 h-24 relative mb-2 animate-float-gentle">
                  <Image
                     src="/mascot.png"
                     alt="Feedback Fox"
                     fill
                     sizes="96px"
                     className={`object-contain transition-all ${isCorrect ? "brightness-105" : "grayscale opacity-50"}`}
                  />
               </div>
               <div className="glass-pill px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter text-slate-400 border-white/80">
                  {isCorrect ? "Proud of you!" : "Keep going!"}
               </div>
            </div>
         </div>
      </div>
   );
}
