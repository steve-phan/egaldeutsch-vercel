"use client";

import { QuizQuestion } from "@/types/quiz";
import { Volume2, Play, MousePointer2 } from "lucide-react";
import Image from "next/image";

interface QuestionPreviewProps {
  question: Partial<QuizQuestion>;
}

export function QuestionPreview({ question }: QuestionPreviewProps) {
  // Mock data for preview if missing
  const prompt = question.prompt_de || "Hier steht die Frage...";
  const category = question.category || "ARTIKEL";
  const options = question.options || [];

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-[2.5rem] shadow-floating border border-slate-100 flex flex-col scale-90 origin-top">
      {/* Header Profile Mirror */}
      <div className="p-4 flex items-center gap-3 border-b border-slate-50">
         <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            <Image src="/mascot.png" alt="Mascot" width={20} height={20} className="object-contain" />
         </div>
         <div className="flex-1">
            <div className="w-20 h-2 bg-slate-100 rounded-full mb-1" />
            <div className="w-12 h-1 bg-slate-50 rounded-full" />
         </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Question Area */}
        <div className="w-full p-6 text-center relative border-b border-slate-50">
            <div className="absolute top-2 right-4 flex items-center gap-2 text-slate-200">
               <Volume2 className="w-3 h-3" />
               <Play className="w-3 h-3" />
            </div>

            <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">Live Preview</p>
            <h2 className="text-xl font-black text-slate-800 mb-2 italic tracking-tighter leading-tight">
               {prompt.replace(/___/g, "______")}
            </h2>
            <p className="text-[10px] font-bold text-primary mt-2 uppercase tracking-widest">{category} Module</p>
        </div>

        {/* Answer Area */}
        <div className="w-full p-6 space-y-6 bg-slate-50/10">
           <div className="flex items-center justify-between">
              <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Select your answer</h4>
              <MousePointer2 className="w-3 h-3 text-slate-200" />
           </div>
           
           <div className="grid grid-cols-1 gap-2">
              {options.map((opt, idx) => (
                <div
                  key={idx}
                  className="w-full h-10 px-4 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">
                     {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-xs font-bold text-slate-500 truncate">{opt|| "..."}</span>
                </div>
              ))}
           </div>

           <button disabled className="w-full h-10 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] opacity-30">
              Submit Answer
           </button>
        </div>
      </div>
      
      {/* Simulation Banner */}
      <div className="bg-primary p-2 text-center">
         <p className="text-[8px] font-black text-white uppercase tracking-widest">Learner View Simulation</p>
      </div>
    </div>
  );
}
