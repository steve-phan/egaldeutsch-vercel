"use client";

import { useState } from "react";
import { QuizQuestion } from "@/types/quiz";
import { useLanguage } from "@/contexts/language-context";
import { ListOrdered, RotateCcw } from "lucide-react";

interface WordOrderProps {
  question: QuizQuestion;
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function WordOrder({ question, onSubmit, disabled }: WordOrderProps) {
  const { language } = useLanguage();
  const [availableWords, setAvailableWords] = useState<string[]>(() => {
    if (question.options && question.options.length > 0) {
      return [...question.options].sort(() => Math.random() - 0.5);
    } else if (question.correct_answer) {
      return question.correct_answer.split(/\s+/).sort(() => Math.random() - 0.5);
    }
    return [];
  });
  const [orderedWords, setOrderedWords] = useState<string[]>([]);



  const handleWordClick = (word: string, isAvailable: boolean) => {
    if (disabled) return;
    
    if (isAvailable) {
      setAvailableWords(availableWords.filter(w => w !== word));
      setOrderedWords([...orderedWords, word]);
    } else {
      setOrderedWords(orderedWords.filter(w => w !== word));
      setAvailableWords([...availableWords, word]);
    }
  };

  const reset = () => {
    if (disabled) return;
    if (question.options) {
      setAvailableWords([...question.options].sort(() => Math.random() - 0.5));
      setOrderedWords([]);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header Prompt */}
      <div className="w-full p-8 md:p-10 text-center relative border-b border-slate-100">
          <div className="absolute top-4 right-8">
             <button 
               onClick={reset} 
               disabled={disabled}
               className="p-2 text-slate-300 hover:text-primary transition-all active:rotate-180 duration-500 disabled:opacity-30"
             >
                <RotateCcw className="w-4 h-4" />
             </button>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Reorder the sentence</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-2 italic tracking-tighter leading-tight">
             {question.prompt_de}
          </h2>
          <p className="text-sm font-bold text-slate-400 mt-2">Grammar Construction</p>
      </div>

      {/* interaction Area */}
      <div className="w-full p-8 md:p-10 space-y-10 bg-slate-50/20">
         {/* Build Area */}
         <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Your Construction</h4>
               <ListOrdered className="w-4 h-4 text-slate-200" />
            </div>
            <div className="min-h-[80px] w-full p-4 bg-white/50 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-wrap gap-2 items-center content-center transition-colors">
               {orderedWords.map((word, i) => (
                  <button
                    key={`${word}-${i}`}
                    onClick={() => handleWordClick(word, false)}
                    disabled={disabled}
                    className="h-10 px-4 bg-primary text-white rounded-full font-black text-sm shadow-premium shadow-primary/20 animate-in zoom-in-90 hover:scale-105 active:scale-95 transition-all"
                  >
                     {word}
                  </button>
               ))}
               {!orderedWords.length && <p className="text-slate-200 font-bold text-sm w-full text-center">Tap words to build your answer...</p>}
            </div>
         </div>

         {/* Selection Area */}
         <div className="flex flex-wrap gap-2 justify-center">
            {availableWords.map((word, i) => (
               <button
                 key={`${word}-${i}`}
                 onClick={() => handleWordClick(word, true)}
                 disabled={disabled}
                 className="h-10 px-4 bg-white border border-slate-100 rounded-full font-black text-sm text-slate-500 shadow-premium hover:border-primary/40 hover:text-primary active:scale-95 transition-all disabled:opacity-30"
               >
                  {word}
               </button>
            ))}
         </div>

         {!disabled && (
           <button 
             disabled={!orderedWords.length || disabled} 
             onClick={() => onSubmit(orderedWords.join(" "))}
             className={`w-full btn-orange btn-compact flex items-center justify-center gap-2 ${!orderedWords.length && "opacity-30 grayscale pointer-events-none"}`}
           >
              {language === "de" ? "Überprüfen" : language === "vi" ? "Kiểm tra" : "Submit Answer"}
           </button>
         )}
      </div>
    </div>
  );
}
