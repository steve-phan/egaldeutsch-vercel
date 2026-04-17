"use client";

import { useAdminQuestions } from "@/hooks/use-admin-questions";
import { useRouter } from "next/navigation";
import { QuestionForm } from "@/components/admin/quiz/question-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { QuizQuestion } from "@/types/quiz";
import { toast } from "sonner";

export default function NewQuestionPage() {
  const { createQuestion, loading } = useAdminQuestions();
  const router = useRouter();

  const handleSubmit = async (data: Partial<QuizQuestion>) => {
    const created = await createQuestion(data);
    if (created) {
       toast.success("Question created successfully!");
       router.push("/admin");
    } else {
       toast.error("Failed to create question. Check connection.");
    }
  };

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
               <h1 className="text-3xl font-bold text-slate-900">Create Question</h1>
               <p className="text-slate-500">Add a new grammatical rule or test to the database.</p>
            </div>
         </div>

         <QuestionForm onSubmit={handleSubmit} isSubmitting={loading} />
      </div>
    </main>
  );
}
