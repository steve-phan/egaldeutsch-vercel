"use client";

import { useRouter } from "next/navigation";
import { useAdminQuestions } from "@/hooks/use-admin-questions";
import { QuestionForm } from "@/components/admin/quiz/question-form";
import { AppShell } from "@/components/layout/app-shell";
import { ChevronLeft, Sparkles, PlusCircle } from "lucide-react";
import Link from "next/link";
import { QuizQuestion } from "@/types/quiz";

export default function NewQuestionPage() {
  const router = useRouter();
  const { createQuestion, loading, error } = useAdminQuestions();

  const handleSubmit = async (data: Partial<QuizQuestion>) => {
    const result = await createQuestion(data);
    if (result) {
      router.push("/admin");
    }
  };

  return (
    <AppShell showNav={true} maxWidth="lg">
      <div className="space-y-10">
         
         {/* Simple Navigation Header */}
         <div className="animate-in slide-in-from-top-4 duration-700">
            <Link href="/admin">
               <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-[0.2em] transition-colors mb-6 group">
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Console
               </button>
            </Link>
            
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                  <PlusCircle className="w-7 h-7" />
               </div>
               <div>
                  <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic leading-none">
                     New Mission
                  </h1>
                  <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-tight flex items-center gap-2">
                     <Sparkles className="w-3 h-3 text-amber-500" /> Building the Mastery Path
                  </p>
               </div>
            </div>
         </div>

         {error && (
            <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl text-rose-500 text-xs font-bold animate-in zoom-in-95">
               Error: {error}
            </div>
         )}

         <QuestionForm onSubmit={handleSubmit} isSubmitting={loading} />

      </div>
    </AppShell>
  );
}
