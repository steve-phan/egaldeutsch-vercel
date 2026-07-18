"use client";

import { useState } from "react";
import { BookOpenText, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface ReadingComprehensionProps {
  question: QuizQuestion;
  onAnswerChange: (answer: string) => void;
  disabled: boolean;
}

export function ReadingComprehension({
  question,
  onAnswerChange,
  disabled,
}: ReadingComprehensionProps) {
  const [selected, setSelected] = useState("");

  const handleSelect = (option: string) => {
    setSelected(option);
    onAnswerChange(option);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full border-b border-slate-100 bg-white p-5 md:p-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
              C1 Leseverstehen
            </p>
            <h2 className="mt-2 text-2xl font-black italic leading-tight tracking-tighter text-slate-900">
              {question.passage_title || "Lesetext"}
            </h2>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpenText className="h-6 w-6" />
          </div>
        </div>

        <div className="max-h-[42vh] overflow-y-auto rounded-[2rem] border border-slate-100 bg-slate-50/80 p-5 shadow-inner">
          <p className="whitespace-pre-line text-left text-base font-semibold leading-8 text-slate-700">
            {question.passage_de}
          </p>
        </div>
      </div>

      <div className="w-full space-y-6 bg-slate-50/20 p-5 md:p-8">
        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
            Frage zum Text
          </p>
          <h3 className="text-lg font-black leading-snug tracking-tight text-slate-900 md:text-xl">
            {question.prompt_de}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Wähle die beste Antwort
          </h4>
          <MousePointer2 className="h-4 w-4 text-slate-200" />
        </div>

        <div className="grid grid-cols-1 gap-3">
          {question.options?.map((option, index) => {
            const isSelected = selected === option;

            return (
              <Button
                key={option}
                disabled={disabled}
                onClick={() => handleSelect(option)}
                className={cn(
                  "min-h-14 w-full justify-between rounded-2xl px-5 py-4 text-left font-bold leading-6 transition-all duration-300 active-bounce",
                  isSelected
                    ? "scale-[1.01] border-transparent bg-primary text-white shadow-lg shadow-primary/20"
                    : "border border-slate-100 bg-white text-slate-600 hover:border-primary/30 hover:bg-slate-50",
                  disabled && "pointer-events-none",
                )}
              >
                <span className="flex min-w-0 items-start gap-4">
                  <span
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black",
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-slate-50 text-slate-400",
                    )}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="whitespace-normal">{option}</span>
                </span>
                {isSelected && (
                  <span className="ml-3 h-2 w-2 shrink-0 rounded-full bg-white" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
