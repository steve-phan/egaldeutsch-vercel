"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAdminQuestions } from "@/hooks/use-admin-questions";
import { QuestionForm } from "@/components/admin/quiz/question-form";
import { AppShell } from "@/components/layout/app-shell";
import { ChevronLeft, Sparkles, FileEdit, Loader2 } from "lucide-react";
import Link from "next/link";
import { QuizQuestion } from "@/types/quiz";

export default function EditQuestionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { questions, updateQuestion, loading, error, fetchQuestions } = useAdminQuestions();
  const [initialData, setInitialData] = useState<QuizQuestion | null>(null);

  useEffect(() => {
    // Fetch specifically if not already in state, or to ensure fresh data
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    if (questions.length > 0 && id) {
      const q = questions.find(q => q.id === id);
      if (q) setInitialData(q);
    }
  }, [questions, id]);

  const handleSubmit = async (data: Partial<QuizQuestion>) => {
    if (typeof id !== "string") return;
    const result = await updateQuestion(id, data);
    if (result) {
      router.push("/admin");
    }
  };

  return (
    <AppShell showNav={true} maxWidth="lg">
      <div className="space-y-10">
         
         {/* Navigation Header */}
         <div className="animate-in slide-in-from-top-4 duration-700">
            <Link href="/admin">
               <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-[0.2em] transition-colors mb-6 group">
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Console
               </button>
            </Link>
            
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                  <FileEdit className="w-7 h-7" />
               </div>
               <div>
                  <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic leading-none">
                     Refine Mission
                  </h1>
                  <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-tight flex items-center gap-2">
                     <Sparkles className="w-3 h-3 text-amber-500" /> Question ID: {id}
                  </p>
               </div>
            </div>
         </div>

         {error && (
            <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl text-rose-500 text-xs font-bold animate-in zoom-in-95">
               Error: {error}
            </div>
         )}

         {!initialData && !error ? (
            <div className="flex flex-col items-center justify-center p-20 bg-white/50 backdrop-blur-md rounded-[3rem] border border-white">
               <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Records...</p>
            </div>
         ) : initialData ? (
            <QuestionForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={loading} />
         ) : null}

      </div>
    </AppShell>
  );
}
