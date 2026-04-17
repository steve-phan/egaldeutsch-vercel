"use client";

import { useState, useEffect } from "react";
import { QuizQuestion, QuizOption } from "@/types/quiz";
import { useLanguage } from "@/contexts/language-context";
import { Volume2, Play, MousePointer2 } from "lucide-react";

interface McqQuestionProps {
  question: QuizQuestion;
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function McqQuestion({ question, onSubmit, disabled }: McqQuestionProps) {
  const { language } = useLanguage();
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    setSelected("");
  // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [question.id]);

  const getPrompt = () => {
    switch (language) {
      case "de": return question.prompt_de;
      case "vi": return question.prompt_vi;
      case "en":
      default: return question.prompt_en;
    }
  };

  const getOptionLabel = (opt: QuizOption) => {
    switch (language) {
      case "de": return opt.de;
      case "vi": return opt.vi;
      case "en":
      default: return opt.en;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Question Prompt Area */}
      <div className="w-full p-8 md:p-10 text-center relative border-b border-slate-100">
          <div className="absolute top-4 right-8 flex items-center gap-2 text-slate-300">
             <button className="p-2 hover:text-primary transition-colors"><Volume2 className="w-4 h-4" /></button>
             <button className="p-2 hover:text-primary transition-colors"><Play className="w-4 h-4" /></button>
          </div>

          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Prompt</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-2 italic tracking-tighter leading-tight">
             {getPrompt()}
          </h2>
          <p className="text-sm font-bold text-slate-400 mt-2">{question.category.toUpperCase()} Module</p>
      </div>

      {/* Answer Area */}
      <div className="w-full p-8 md:p-10 space-y-8 bg-slate-50/20">
         <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select the correct choice</h4>
            <MousePointer2 className="w-4 h-4 text-slate-200" />
         </div>
         
         <div className="grid grid-cols-1 gap-3">
            {question.options?.map((opt, idx) => {
               const isSelected = selected === opt.de;
               return (
                  <button
                    key={idx}
                    disabled={disabled}
                    onClick={() => setSelected(opt.de)}
                    className={`
                      w-full h-12 px-6 rounded-2xl font-bold flex items-center justify-between transition-all duration-300 transform
                      ${isSelected 
                         ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02] border-transparent" 
                         : "bg-white border border-slate-100 text-slate-500 hover:border-primary/30 hover:bg-slate-50 active:scale-98"}
                      ${disabled && "pointer-events-none"}
                    `}
                  >
                     <span className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${isSelected ? "bg-white/20 text-white" : "bg-slate-50 text-slate-400"}`}>
                           {String.fromCharCode(65 + idx)}
                        </span>
                        {getOptionLabel(opt)}
                     </span>
                     {isSelected && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                  </button>
               )
            })}
         </div>

         {!disabled && (
           <button 
             disabled={!selected || disabled} 
             onClick={() => onSubmit(selected)}
             className={`w-full btn-orange btn-compact flex items-center justify-center gap-2 ${!selected && "opacity-30 grayscale pointer-events-none"}`}
           >
              {language === "de" ? "Überprüfen" : language === "vi" ? "Kiểm tra" : "Submit Answer"}
           </button>
         )}
      </div>
    </div>
  );
}
