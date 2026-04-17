import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/types/quiz";
import { useLanguage } from "@/contexts/language-context";

interface WordOrderProps {
  question: QuizQuestion;
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function WordOrder({ question, onSubmit, disabled }: WordOrderProps) {
  const { language } = useLanguage();
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  useEffect(() => {
    // Break the correct answer into words, and shuffle them
    const words = question.correct_answer.split(" ").filter(w => w.length > 0);
    // Simple deterministic shuffle purely for the test UI to ensure they actually move
    const shuffled = [...words].sort((a, b) => a.localeCompare(b) - 0.5); 
    setAvailableWords(shuffled);
    setSelectedWords([]);
  }, [question.id, question.correct_answer]);

  const handleSelect = (word: string, idx: number) => {
    if (disabled) return;
    setAvailableWords(prev => prev.filter((_, i) => i !== idx));
    setSelectedWords(prev => [...prev, word]);
  };

  const handleUnselect = (word: string, idx: number) => {
    if (disabled) return;
    setSelectedWords(prev => prev.filter((_, i) => i !== idx));
    setAvailableWords(prev => [...prev, word]);
  };

  const currentSentence = selectedWords.join(" ");

  const getPrompt = () => {
    switch (language) {
      case "de": return question.prompt_de;
      case "vi": return question.prompt_vi;
      case "en":
      default: return question.prompt_en;
    }
  };

  const btnLabel = language === "de" ? "Überprüfen" : language === "vi" ? "Kiểm tra" : "Check Answer";

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      <h3 className="text-xl font-semibold text-slate-600 mb-8 text-center">{getPrompt()}</h3>
      
      {/* Target Area (Selected Words) */}
      <div className="w-full min-h-[80px] p-4 bg-slate-50 border-2 border-dashed border-slate-300 flex flex-wrap gap-2 items-center rounded-xl mb-8">
        {selectedWords.length === 0 && (
           <span className="text-slate-400 font-medium italic select-none">
             Click words below to build the sentence...
           </span>
        )}
        {selectedWords.map((word, idx) => (
          <button
            key={`sel-${idx}`}
            onClick={() => handleUnselect(word, idx)}
            disabled={disabled}
            className={`
              px-4 py-2 bg-white border-2 border-indigo-200 text-indigo-900 font-bold rounded-lg shadow-sm
              transition-transform hover:-translate-y-1 hover:shadow-md hover:border-indigo-400
              ${disabled ? "cursor-default opacity-90" : "cursor-pointer"}
            `}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Source Area (Available Words) */}
      <div className="w-full p-6 bg-white border border-slate-200 shadow-sm flex flex-wrap justify-center gap-3 rounded-xl mb-12">
        {availableWords.map((word, idx) => (
          <button
            key={`avail-${idx}`}
            onClick={() => handleSelect(word, idx)}
            disabled={disabled}
            className={`
              px-4 py-2 bg-slate-100 border-2 border-slate-200 text-slate-700 font-medium rounded-lg
              transition-all hover:bg-slate-200 hover:border-slate-300 active:scale-95
              ${disabled ? "cursor-default opacity-50" : "cursor-pointer"}
            `}
          >
            {word}
          </button>
        ))}
        {availableWords.length === 0 && (
          <span className="text-slate-400 italic text-sm">All words used</span>
        )}
      </div>

      <Button 
        size="lg"
        disabled={availableWords.length > 0 || disabled} // Must use all words
        className="w-full sm:w-64 h-14 text-lg bg-indigo-600 hover:bg-indigo-700"
        onClick={() => onSubmit(currentSentence)}
      >
        {btnLabel}
      </Button>
    </div>
  );
}
