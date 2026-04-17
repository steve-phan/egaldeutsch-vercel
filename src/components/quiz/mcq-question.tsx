import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/types/quiz";
import { useLanguage } from "@/contexts/language-context";

interface McqQuestionProps {
  question: QuizQuestion;
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function McqQuestion({ question, onSubmit, disabled }: McqQuestionProps) {
  const { language } = useLanguage();
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    // Reset selected answer when a new question loads
    setSelected("");
  }, [question.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      
      const optionsCount = question.options?.length || 4;
      
      // 1-4 shortcuts
      if (["1", "2", "3", "4"].includes(e.key)) {
        const index = parseInt(e.key) - 1;
        if (index < optionsCount && question.options) {
          setSelected(question.options[index].de); // Raw DB value is ALWAYS in .de for grading
        }
      }

      // Enter to submit
      if (e.key === "Enter" && selected) {
        onSubmit(selected);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, selected, question.options, onSubmit]);

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
    <div className="w-full">
      <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center" dangerouslySetInnerHTML={{ __html: getPrompt().replace(/___/g, '<span class="inline-block w-16 border-b-2 border-slate-300 mx-1 align-middle"></span>') }} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {question.options?.map((opt, idx) => {
          const isSelected = selected === opt.de;
          
          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => setSelected(opt.de)}
              className={`
                relative flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-200
                ${disabled ? "cursor-default" : "hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer"}
                ${isSelected 
                  ? "border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm" 
                  : "border-slate-200 bg-white text-slate-700"}
                ${disabled && !isSelected ? "opacity-50" : ""}
              `}
            >
              <span className="text-lg font-medium">{getOptionLabel(opt)}</span>
              
              {/* Keyboard hint */}
              {!disabled && (
                 <span className="flex items-center justify-center w-6 h-6 rounded bg-slate-100 text-slate-400 text-xs font-mono font-bold border border-slate-200 shadow-sm">
                   {idx + 1}
                 </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
         <Button 
           size="lg"
           className="w-full sm:w-64 h-14 text-lg bg-indigo-600 hover:bg-indigo-700" 
           disabled={!selected || disabled} 
           onClick={() => onSubmit(selected)}
         >
           {language === "de" ? "Überprüfen" : language === "vi" ? "Kiểm tra" : "Check Answer"}
           <span className="hidden sm:inline ml-2 text-indigo-300 font-normal text-sm">(Enter)</span>
         </Button>
      </div>
    </div>
  );
}
