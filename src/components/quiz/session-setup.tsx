"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Settings2, Clock, Hash, Zap } from "lucide-react";
import { QuizSessionConfig, CEFRLevel, QuizCategory } from "@/types/quiz";

interface SessionSetupProps {
  category: QuizCategory;
  onStart: (config: QuizSessionConfig) => void;
}

export function SessionSetup({ category, onStart }: SessionSetupProps) {
  const [level, setLevel] = useState<CEFRLevel | "mixed">("mixed");
  const [totalQuestions, setTotalQuestions] = useState<number>(10);
  const [timeLimit, setTimeLimit] = useState<number | undefined>(undefined); // seconds

  const handleStart = () => {
    onStart({
      category,
      level,
      totalQuestions,
      timePerQuestion: timeLimit,
    });
  };

  return (
    <Card className="w-full max-w-2xl border-none shadow-xl bg-white/80 backdrop-blur-sm">
      <CardContent className="p-8 md:p-12">
         <div className="flex items-center gap-3 mb-2">
            <Settings2 className="w-6 h-6 text-indigo-500" />
            <h2 className="text-2xl font-bold text-slate-800">Auf geht&apos;s!</h2>
         </div>
         <p className="text-slate-500 mb-8">Customize your quiz session to match your goals.</p>

         <div className="space-y-8">
            {/* Level Selection */}
            <div>
               <label className="text-sm font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-2 mb-3">
                 <Zap className="w-4 h-4" /> CEFR Level
               </label>
               <div className="grid grid-cols-5 gap-2">
                  {["mixed", "A1", "A2", "B1", "B2"].map(l => (
                     <button
                       key={l}
                       onClick={() => setLevel(l as CEFRLevel | "mixed")}
                       className={`py-3 px-2 rounded-xl border-2 font-bold transition-all
                         ${level === l 
                            ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm" 
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
                     >
                       {l === "mixed" ? "Mix" : l}
                     </button>
                  ))}
               </div>
            </div>

            {/* Total Questions */}
            <div>
               <label className="text-sm font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-2 mb-3">
                 <Hash className="w-4 h-4" /> Questions
               </label>
               <div className="grid grid-cols-3 gap-3">
                  {[5, 10, 20].map(n => (
                     <button
                       key={n}
                       onClick={() => setTotalQuestions(n)}
                       className={`py-3 px-4 rounded-xl border-2 font-bold text-lg transition-all
                         ${totalQuestions === n 
                            ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm" 
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
                     >
                       {n}
                     </button>
                  ))}
               </div>
            </div>

            {/* Timer Selection */}
            <div>
               <label className="text-sm font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-2 mb-3">
                 <Clock className="w-4 h-4" /> Timer (Per Question)
               </label>
               <div className="grid grid-cols-3 gap-3">
                  <button
                     onClick={() => setTimeLimit(undefined)}
                     className={`py-3 px-4 rounded-xl border-2 font-bold transition-all
                       ${timeLimit === undefined 
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm" 
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
                  >
                     Off
                  </button>
                  <button
                     onClick={() => setTimeLimit(30)}
                     className={`py-3 px-4 rounded-xl border-2 font-bold transition-all
                       ${timeLimit === 30 
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm" 
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
                  >
                     30s
                  </button>
                  <button
                     onClick={() => setTimeLimit(60)}
                     className={`py-3 px-4 rounded-xl border-2 font-bold transition-all
                       ${timeLimit === 60 
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm" 
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
                  >
                     60s
                  </button>
               </div>
            </div>
         </div>

         <div className="mt-12">
            <Button 
               size="lg" 
               className="w-full h-14 bg-accent hover:bg-yellow-500 text-accent-foreground font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
               onClick={handleStart}
            >
               Start Quiz <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
         </div>
      </CardContent>
    </Card>
  );
}
