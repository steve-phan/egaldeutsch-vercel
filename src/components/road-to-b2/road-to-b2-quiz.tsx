"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import type { RoadToB2Quiz } from "@/lib/road-to-b2-quizzes";
import { cn } from "@/lib/utils";

type Props = {
  quiz: RoadToB2Quiz;
};

export function RoadToB2Quiz({ quiz }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () =>
      quiz.questions.reduce(
        (total, question, index) =>
          answers[index] === question.answerIndex ? total + 1 : total,
        0,
      ),
    [answers, quiz.questions],
  );

  const isComplete = Object.keys(answers).length === quiz.questions.length;

  return (
    <section className="mt-8 rounded-[2rem] border border-primary/10 bg-white p-5 shadow-premium sm:p-7">
      <div className="mb-6">
        <span className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
          Interaktives Quiz
        </span>
        <h2 className="text-2xl font-black tracking-tight text-slate-950">
          {quiz.title}
        </h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
          {quiz.description}
        </p>
      </div>

      <div className="space-y-5">
        {quiz.questions.map((question, questionIndex) => {
          const selectedAnswer = answers[questionIndex];
          const isCorrect = selectedAnswer === question.answerIndex;

          return (
            <div
              key={question.question}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <p className="mb-4 text-base font-black leading-snug text-slate-900">
                {questionIndex + 1}. {question.question}
              </p>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selectedAnswer === optionIndex;
                  const isAnswer = question.answerIndex === optionIndex;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        if (!submitted) {
                          setAnswers((current) => ({
                            ...current,
                            [questionIndex]: optionIndex,
                          }));
                        }
                      }}
                      className={cn(
                        "flex w-full items-start justify-between gap-3 rounded-xl border bg-white px-4 py-3 text-left text-sm font-bold leading-6 transition-all",
                        !submitted &&
                          isSelected &&
                          "border-primary bg-primary/5 text-primary",
                        !submitted &&
                          !isSelected &&
                          "border-slate-100 text-slate-700 hover:border-primary/30",
                        submitted &&
                          isAnswer &&
                          "border-emerald-200 bg-emerald-50 text-emerald-800",
                        submitted &&
                          isSelected &&
                          !isAnswer &&
                          "border-red-200 bg-red-50 text-red-700",
                        submitted &&
                          !isSelected &&
                          !isAnswer &&
                          "border-slate-100 text-slate-500",
                      )}
                    >
                      <span>{option}</span>
                      {submitted && isAnswer && (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                      )}
                      {submitted && isSelected && !isAnswer && (
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div
                  className={cn(
                    "mt-3 rounded-xl px-4 py-3 text-sm font-semibold leading-6",
                    isCorrect
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-amber-50 text-amber-800",
                  )}
                >
                  {question.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm font-black text-slate-600">
          {submitted
            ? `Score: ${score}/${quiz.questions.length}`
            : `${Object.keys(answers).length}/${quiz.questions.length} beantwortet`}
        </div>
        <div className="flex gap-2">
          {submitted && (
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
              }}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-600"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry
            </button>
          )}
          <button
            type="button"
            disabled={!isComplete}
            onClick={() => setSubmitted(true)}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-sm transition-all disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Check answers
          </button>
        </div>
      </div>
    </section>
  );
}
