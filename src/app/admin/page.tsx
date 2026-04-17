"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAdminQuestions } from "@/hooks/use-admin-questions";
import { useRouter } from "next/navigation";
import { Loader2, Plus, RefreshCw, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionTable } from "@/components/admin/quiz/question-table";
import Link from "next/link";
import { CEFRLevel } from "@/types/quiz";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const user = session?.user;
  
  // Note: For local development, auth check is removed to allow direct testing

  const { questions, loading, error, fetchQuestions, deleteQuestion } = useAdminQuestions();
  
  const [filterLevel, setFilterLevel] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");

  useEffect(() => {
    fetchQuestions(filterCategory, filterLevel);
  }, [fetchQuestions, filterCategory, filterLevel]);


  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
         
         {/* Settings Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div>
               <h1 className="text-3xl font-bold text-slate-900 mb-1">Quiz Administrator</h1>
               <p className="text-slate-500 text-sm">Manage the grammar question database (A1-B2).</p>
            </div>
            <div className="flex gap-4">
               <Button variant="outline" onClick={() => fetchQuestions(filterCategory, filterLevel)}>
                 <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin text-indigo-500" : ""}`} />
                 Refresh
               </Button>
               <Link href="/admin/questions/new">
                 <Button className="bg-indigo-600 hover:bg-indigo-700">
                   <Plus className="w-4 h-4 mr-2" />
                   New Question
                 </Button>
               </Link>
            </div>
         </div>

         {/* Stats Bar */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
               <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total DB Size</p>
                  <p className="text-3xl font-bold text-slate-800">{questions.length}</p>
               </div>
               <BarChart className="w-8 h-8 text-indigo-200" />
            </div>
            {/* Can add more dynamic stats later */}
         </div>

         {/* Database Viewer */}
         <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4 items-center">
               <select 
                 value={filterLevel} 
                 onChange={e => setFilterLevel(e.target.value)}
                 className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
               >
                 <option value="">All Levels</option>
                 <option value="A1">A1</option>
                 <option value="A2">A2</option>
                 <option value="B1">B1</option>
                 <option value="B2">B2</option>
               </select>

               <select 
                 value={filterCategory} 
                 onChange={e => setFilterCategory(e.target.value)}
                 className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
               >
                 <option value="">All Categories</option>
                 <option value="artikel">Artikel</option>
                 <option value="kasus">Kasus</option>
                 <option value="verb-konjugation">Verb Conjugation</option>
                 {/* Expand as needed */}
               </select>
            </div>

            {error && (
               <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl">
                  {error}
                  {error.includes("Forbidden") && <span className="ml-2 font-semibold border-l-2 pl-2 border-red-300">You must be logged in as an admin role to view this data.</span>}
               </div>
            )}

            {loading && questions.length === 0 ? (
               <div className="flex justify-center p-12 bg-white rounded-2xl border border-slate-200">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
               </div>
            ) : (
               <QuestionTable 
                  questions={questions} 
                  onDelete={deleteQuestion} 
                  isDeleting={loading} 
               />
            )}
         </div>

      </div>
    </main>
  );
}
