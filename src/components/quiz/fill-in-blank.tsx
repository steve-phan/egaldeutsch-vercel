"use client";

import { useState, useEffect } from "react";
import { QuizQuestion } from "@/types/quiz";
import { useLanguage } from "@/contexts/language-context";
import { Edit3, Sparkles } from "lucide-react";

interface FillInBlankProps {
  question: QuizQuestion;
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function FillInBlank({ question, onSubmit, disabled }: FillInBlankProps) {
  const { language } = useLanguage();
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    setAnswer("");
  }, [question.id]);

  const getPrompt = () => {
    switch (language) {
      case "de": return question.prompt_de;
      case "vi": return question.prompt_vi;
      case "en":
      default: return question.prompt_en;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header Prompt */}
      <div className="w-full p-8 md:p-10 text-center relative border-b border-slate-100">
          <div className="absolute top-4 right-8 text-primary animate-pulse opacity-20">
             <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 text-center">Fill in the missing part</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-2 italic tracking-tighter leading-tight text-center">
             {getPrompt()}
          </h2>
          <p className="text-sm font-bold text-slate-400 mt-2">{question.category.toUpperCase()} Mastery</p>
      </div>

      {/* Input Area */}
      <div className="w-full p-8 md:p-10 space-y-8 bg-slate-50/20">
         <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type your answer</h4>
            <Edit3 className="w-4 h-4 text-slate-200" />
         </div>
         
         <div className="relative group">
            <input
               type="text"
               value={answer}
               onChange={(e) => setAnswer(e.target.value)}
               disabled={disabled}
               placeholder="Enter response..."
               className="w-full h-14 px-6 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-800 placeholder:text-slate-200 outline-none focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 transition-all duration-300"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-200 uppercase letter tracking-tighter group-focus-within:text-primary/30 transition-colors">
               Focus Mode
            </div>
         </div>

         {!disabled && (
           <button 
             disabled={!answer.trim() || disabled} 
             onClick={() => onSubmit(answer)}
             className={`w-full btn-orange btn-compact flex items-center justify-center gap-2 ${!answer.trim() && "opacity-30 grayscale pointer-events-none"}`}
           >
              {language === "de" ? "Überprüfen" : language === "vi" ? "Kiểm tra" : "Submit Answer"}
           </button>
         )}
      </div>
    </div>
  );
}
