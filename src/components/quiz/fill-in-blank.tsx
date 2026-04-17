import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/types/quiz";
import { useLanguage } from "@/contexts/language-context";

interface FillInBlankProps {
  question: QuizQuestion;
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function FillInBlank({ question, onSubmit, disabled }: FillInBlankProps) {
  const { language } = useLanguage();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset and focus when new question arrives
    setValue("");
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [question.id, disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
    }
  };

  const getPrompt = () => {
    switch (language) {
      case "de": return question.prompt_de;
      case "vi": return question.prompt_vi;
      case "en":
      default: return question.prompt_en;
    }
  };

  const promptStr = getPrompt();
  const parts = promptStr.split("___");
  
  // If the prompt doesn't have exactly one "___", we fallback to a safe rendering
  const isWellFormed = parts.length === 2;

  const btnLabel = language === "de" ? "Überprüfen" : language === "vi" ? "Kiểm tra" : "Check Answer";

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
      <div className="text-2xl font-medium text-slate-800 leading-relaxed mb-12 text-center max-w-2xl bg-white p-8 rounded-xl border-2 shadow-sm">
        {isWellFormed ? (
          <>
            <span>{parts[0]}</span>
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={disabled}
              className={`
                inline-block w-32 border-b-2 bg-transparent text-center font-bold text-indigo-700
                focus:outline-none transition-colors mx-2 align-baseline pb-1
                ${disabled ? "border-slate-200 text-slate-500" : "border-indigo-400 focus:border-indigo-600 focus:bg-indigo-50/50"}
              `}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            <span>{parts[1]}</span>
          </>
        ) : (
          <div>
            <p className="mb-4">{promptStr}</p>
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={disabled}
              className="px-4 py-2 border-2 border-indigo-200 rounded-lg text-center font-bold focus:border-indigo-500 focus:outline-none w-48"
            />
          </div>
        )}
      </div>

      <Button 
        type="submit"
        size="lg"
        disabled={!value.trim() || disabled} 
        className="w-full sm:w-64 h-14 text-lg bg-indigo-600 hover:bg-indigo-700"
      >
        {btnLabel}
        <span className="hidden sm:inline ml-2 text-indigo-300 font-normal text-sm">(Enter)</span>
      </Button>
    </form>
  );
}
