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
  onAnswerChange: (answer: string) => void;
  disabled: boolean;
}

export function WordOrder({ question, onAnswerChange, disabled }: WordOrderProps) {
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

    let newOrderedIds: string[];
    if (isAvailable) {
      setWordPool(prev => prev.map(w => w.id === id ? { ...w, isUsed: true } : w));
      newOrderedIds = [...orderedIds, id];
    } else {
      setWordPool(prev => prev.map(w => w.id === id ? { ...w, isUsed: false } : w));
      newOrderedIds = orderedIds.filter(i => i !== id);
    }
    setOrderedIds(newOrderedIds);

    // Notify parent of the new construction
    const currentConstruction = newOrderedIds
      .map(oid => {
        // We look it up in the pool, but we need to be careful with state updates
        // To be safe, we calculate it from the previous pool + the current change
        const word = wordPool.find(w => w.id === oid);
        return word ? word.text : "";
      })
      .filter(t => t !== "")
      .join(" ");

    // Better way: recalculate ordered words from the upcoming state
    const draftWords = newOrderedIds
      .map(oid => wordPool.find(w => w.id === oid)?.text || "")
      .filter(Boolean)
      .join(" ");
    onAnswerChange(draftWords);
  };

  const reset = () => {
    if (disabled) return;
    setWordPool(prev => prev.map(w => ({ ...w, isUsed: false })));
    setOrderedIds([]);
    onAnswerChange("");
  };

  // Helper to get selected words in order
  const orderedWords = orderedIds
    .map(id => wordPool.find(w => w.id === id))
    .filter((w): w is WordItem => !!w);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header Prompt */}
      <div className="w-full p-6 md:p-8 text-center relative border-b border-slate-100">
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
        <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-2 italic tracking-tighter leading-tight">
          {question.prompt_de}
        </h2>
        <p className="text-sm text-slate-400 mt-2">Grammar Construction</p>
      </div>

      {/* interaction Area */}
      <div className="w-full p-6 md:p-8 space-y-10 bg-slate-50/20">
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
                className="min-h-[2.5rem] py-2 px-4 bg-primary text-white rounded-xl font-black text-sm shadow-premium shadow-primary/20 animate-in zoom-in-90 hover:scale-105 active:scale-95 transition-all text-center"
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
                className="min-h-[2.5rem] py-2 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 font-black text-sm text-transparent flex items-center justify-center select-none text-center"
              >
                {word.text}
              </div>

              {/* Actual Button */}
              {!word.isUsed && (
                <button
                  onClick={() => handleWordClick(word.id, true)}
                  disabled={disabled}
                  className="absolute inset-0 min-h-[2.5rem] py-2 px-4 bg-white border border-slate-100 rounded-xl font-black text-sm text-slate-500 shadow-premium hover:border-primary/40 hover:text-primary active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center text-center animate-in fade-in zoom-in-90 fill-mode-forwards"
                >
                  {word.text}
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
