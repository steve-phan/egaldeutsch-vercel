"use client";

import { useState } from "react";
import { QuizQuestion } from "@/types/quiz";
import { useLanguage } from "@/contexts/language-context";
import { ListOrdered, RotateCcw } from "lucide-react";

interface WordItem {
  id: string;
  text: string;
  isUsed: boolean;
}

interface WordOrderProps {
  question: QuizQuestion;
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function WordOrder({ question, onSubmit, disabled }: WordOrderProps) {
  const { language } = useLanguage();

  // The static pool of words that never changes its layout order
  const [wordPool, setWordPool] = useState<WordItem[]>(() => {
    let source: string[] = [];
    if (question.options && question.options.length > 0) {
      source = [...question.options];
    } else if (question.correct_answer) {
      source = question.correct_answer.split(/\s+/);
    }

    return source
      .sort(() => Math.random() - 0.5)
      .map((text, index) => ({
        id: `word-${index}-${Math.random().toString(36).substr(2, 9)}`,
        text,
        isUsed: false
      }));
  });

  // Track the order in which IDs were selected
  const [orderedIds, setOrderedIds] = useState<string[]>([]);

  const handleWordClick = (id: string, isAvailable: boolean) => {
    if (disabled) return;

    if (isAvailable) {
      setWordPool(prev => prev.map(w => w.id === id ? { ...w, isUsed: true } : w));
      setOrderedIds(prev => [...prev, id]);
    } else {
      setWordPool(prev => prev.map(w => w.id === id ? { ...w, isUsed: false } : w));
      setOrderedIds(prev => prev.filter(i => i !== id));
    }
  };

  const reset = () => {
    if (disabled) return;
    setWordPool(prev => prev.map(w => ({ ...w, isUsed: false })));
    setOrderedIds([]);
  };

  // Helper to get selected words in order
  const orderedWords = orderedIds
    .map(id => wordPool.find(w => w.id === id))
    .filter((w): w is WordItem => !!w);

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
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 italic tracking-tighter leading-tight">
          {question.prompt_de}
        </h2>
        <p className="text-sm text-slate-400 mt-2">Grammar Construction</p>
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
                key={word.id}
                onClick={() => handleWordClick(word.id, false)}
                disabled={disabled}
                className="h-10 px-4 bg-primary text-white rounded-full font-black text-sm shadow-premium shadow-primary/20 animate-in zoom-in-90 hover:scale-105 active:scale-95 transition-all"
              >
                {word.text}
              </button>
            ))}
            {!orderedWords.length && <p className="text-slate-200 font-bold text-sm w-full text-center">Tap words to build your answer...</p>}
          </div>
        </div>

        {/* Selection Area */}
        <div className="flex flex-wrap gap-2 justify-center">
          {wordPool.map((word) => (
            <div key={word.id} className="relative">
              {/* Visible placeholder to indicate an empty slot */}
              <div 
                className="h-10 px-4 rounded-full border border-dashed border-slate-200 bg-slate-50/50 font-black text-sm text-transparent flex items-center select-none"
              >
                {word.text}
              </div>

              {/* Actual Button */}
              {!word.isUsed && (
                <button
                  onClick={() => handleWordClick(word.id, true)}
                  disabled={disabled}
                  className="absolute inset-0 h-10 px-4 bg-white border border-slate-100 rounded-full font-black text-sm text-slate-500 shadow-premium hover:border-primary/40 hover:text-primary active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center animate-in fade-in zoom-in-90 fill-mode-forwards"
                >
                  {word.text}
                </button>
              )}
            </div>
          ))}
        </div>

        {!disabled && (
          <button
            disabled={!orderedWords.length || disabled}
            onClick={() => onSubmit(orderedWords.map(w => w.text).join(" "))}
            className={`w-full btn-orange btn-compact flex items-center justify-center gap-2 ${!orderedWords.length && "opacity-30 grayscale pointer-events-none"}`}
          >
            {language === "de" ? "Überprüfen" : language === "vi" ? "Kiểm tra" : "Submit Answer"}
          </button>
        )}
      </div>
    </div>
  );
}
