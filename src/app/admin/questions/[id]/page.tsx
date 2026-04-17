"use client";

import { useEffect, useState, use } from "react";
import { useAdminQuestions } from "@/hooks/use-admin-questions";
import { useRouter } from "next/navigation";
import { QuestionForm } from "@/components/admin/quiz/question-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { QuizQuestion } from "@/types/quiz";
import { toast } from "sonner";

export default function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { questions, fetchQuestions, updateQuestion, loading } = useAdminQuestions();
  const router = useRouter();
  const [targetQuestion, setTargetQuestion] = useState<QuizQuestion | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // We fetch all questions and find ours. Ideally in production we'd do a GET /api/admin/questions/:id
  useEffect(() => {
    const init = async () => {
      await fetchQuestions();
      setIsInitializing(false);
    };
    init();
  }, [fetchQuestions]);

  useEffect(() => {
    if (!isInitializing) {
      const matched = questions.find(q => q.id === id);
      setTargetQuestion(matched || null);
    }
  }, [isInitializing, questions, id]);

  const handleSubmit = async (data: Partial<QuizQuestion>) => {
    const updated = await updateQuestion(id, data);
    if (updated) {
       toast.success("Question updated successfully!");
       router.push("/admin");
    } else {
       toast.error("Failed to update question.");
    }
  };

  if (isInitializing) {
     return (
       <div className="flex justify-center items-center min-h-screen bg-slate-50">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
       </div>
     );
  }

  if (!targetQuestion) {
     return (
       <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 p-4">
          <h2 className="text-2xl font-bold mb-4">Question Not Found</h2>
          <Button onClick={() => router.push("/admin")}>Back to Dashboard</Button>
       </div>
     );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
         <div className="flex items-center gap-4">
            <Link href="/admin">
               <Button variant="outline" size="icon" className="rounded-full shadow-sm">
                  <ChevronLeft className="w-5 h-5" />
               </Button>
            </Link>
            <div>
               <h1 className="text-3xl font-bold text-slate-900">Edit Question</h1>
               <p className="text-slate-500 font-mono text-sm">{id}</p>
            </div>
         </div>

         <QuestionForm 
           initialData={targetQuestion} 
           onSubmit={handleSubmit} 
           isSubmitting={loading} 
         />
      </div>
    </main>
  );
}
