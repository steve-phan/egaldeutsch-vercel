"use client";

import { useState } from "react";
import { QuizQuestion } from "@/types/quiz";
import { useLanguage } from "@/contexts/language-context";
import { Edit3, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

interface FillInBlankProps {
   question: QuizQuestion;
   onAnswerChange: (answer: string) => void;
   disabled: boolean;
}

export function FillInBlank({ question, onAnswerChange, disabled }: FillInBlankProps) {
   const { t } = useLanguage();
   const [answer, setAnswer] = useState("");

   const handleChange = (val: string) => {
      setAnswer(val);
      onAnswerChange(val);
   };

   return (
      <div className="w-full flex flex-col items-center">
         {/* Header Prompt */}
         <div className="w-full p-6 md:p-8 text-center relative border-b border-slate-100">
            <div className="absolute top-4 right-8 text-primary animate-pulse opacity-20">
               <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 text-center">{t("quiz_ui.fill_blank_instruction")}</p>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-2 italic tracking-tighter leading-tight text-center">
               {question.prompt_de}
            </h2>
            <p className="text-sm text-slate-400 mt-2">{question.category.toUpperCase()} Mastery</p>
         </div>

         {/* Input Area */}
         <div className="w-full p-6 md:p-8 space-y-8 bg-slate-50/20">
            <div className="flex items-center justify-between">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("quiz_ui.type_answer")}</h4>
               <Edit3 className="w-4 h-4 text-slate-200" />
            </div>

            <div className="relative group">
               <input
                  type="text"
                  value={answer}
                  onChange={(e) => handleChange(e.target.value)}
                  disabled={disabled}
                  placeholder={t("quiz_ui.type_answer")}
                  className="w-full h-14 px-6 bg-white border-2 border-slate-100 rounded-2xl text-slate-800 placeholder:text-slate-200 outline-none focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 transition-all duration-300"
               />
            </div>

         </div>
      </div>
   );
}
