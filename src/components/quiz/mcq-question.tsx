"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/types/quiz";
import { useLanguage } from "@/contexts/language-context";
import { Volume2, Play, ChevronLeft, ChevronRight, Mic } from "lucide-react";

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
  }, [question.id]);

  const getPrompt = () => {
    switch (language) {
      case "de": return question.prompt_de;
      case "vi": return question.prompt_vi;
      case "en":
      default: return question.prompt_en;
    }
  };

  const getOptionLabel = (opt: any) => {
    switch (language) {
      case "de": return opt.de;
      case "vi": return opt.vi;
      case "en":
      default: return opt.en;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Audio Playback Controls from Prototype */}
      <div className="w-full bg-white rounded-t-[3rem] p-10 flex flex-col items-center text-center shadow-lg mb-0">
          <h2 className="text-3xl font-black text-slate-800 mb-2">{question.category.toUpperCase()}</h2>
          <p className="text-slate-500 font-bold mb-8">{getPrompt()}</p>
          
          <div className="flex items-center gap-6 mb-8">
             <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
                <ChevronLeft className="w-5 h-5" />
             </button>
             <button className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/30">
                <Mic className="w-10 h-10" />
             </button>
             <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
                <ChevronRight className="w-5 h-5" />
             </button>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
             <Volume2 className="w-5 h-5" />
             <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-primary" />
             </div>
             <Play className="w-5 h-5" />
          </div>
      </div>

      {/* Answer Area */}
      <div className="w-full bg-slate-50/50 p-10 rounded-b-[3rem] border-x border-b border-slate-100">
         <h4 className="text-xl font-black text-slate-800 mb-8">What&apos;s choice questions?</h4>
         
         <div className="flex flex-col gap-4 mb-10">
            {question.options?.map((opt, idx) => {
               const isSelected = selected === opt.de;
               return (
                  <button
                    key={idx}
                    disabled={disabled}
                    onClick={() => setSelected(opt.de)}
                    className="flex items-center gap-4 group"
                  >
                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "border-primary bg-primary scale-110" : "border-slate-300 bg-white group-hover:border-primary/50"}`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                     </div>
                     <span className={`text-lg font-bold transition-colors ${isSelected ? "text-slate-800" : "text-slate-400 group-hover:text-slate-600"}`}>
                        {getOptionLabel(opt)}
                     </span>
                  </button>
               )
            })}
         </div>

         {!disabled && (
           <Button 
             size="lg"
             className="w-full h-16 text-xl font-black btn-orange" 
             disabled={!selected || disabled} 
             onClick={() => onSubmit(selected)}
           >
             {language === "de" ? "Überprüfen" : language === "vi" ? "Kiểm tra" : "Submit Answer"}
           </Button>
         )}
      </div>
    </div>
  );
}
