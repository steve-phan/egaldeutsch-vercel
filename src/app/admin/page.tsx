"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAdminQuestions } from "@/hooks/use-admin-questions";
import { useRouter } from "next/navigation";
import { Loader2, Plus, RefreshCw, BarChart3, Database, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionTable } from "@/components/admin/quiz/question-table";
import { AppShell } from "@/components/layout/app-shell";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { questions, loading, error, fetchQuestions, deleteQuestion } = useAdminQuestions();
  
  const [filterLevel, setFilterLevel] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");

  useEffect(() => {
    fetchQuestions(filterCategory, filterLevel);
  }, [fetchQuestions, filterCategory, filterLevel]);

  const stats = [
    { label: "Total Database", value: questions.length, icon: <Database className="w-4 h-4" />, color: "bg-indigo-500" },
    { label: "Active Modules", value: "14", icon: <Layers className="w-4 h-4" />, color: "bg-emerald-500" },
    { label: "Avg Mastery", value: "82%", icon: <Sparkles className="w-4 h-4" />, color: "bg-amber-500" },
  ];

  return (
    <AppShell showNav={true} maxWidth="2xl">
      <div className="space-y-10">
         
         {/* Premium Admin Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in slide-in-from-top-4 duration-700">
            <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                  <BarChart3 className="w-3 h-3" /> System Console
               </div>
               <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic leading-none">
                  Editorial Suite
               </h1>
               <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-tight">Curating the path to German mastery</p>
            </div>
            
            <div className="flex items-center gap-3">
               <button 
                 onClick={() => fetchQuestions(filterCategory, filterLevel)}
                 className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary shadow-premium border border-white transition-all active:rotate-180 duration-500"
               >
                 <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
               </button>
               <Link href="/admin/questions/new">
                 <button className="btn-orange h-12 px-6 text-sm font-black flex items-center gap-2">
                   <Plus className="w-4 h-4" /> New Question
                 </button>
               </Link>
            </div>
         </div>

         {/* Bento Stats */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-1000 delay-100">
            {stats.map((stat, i) => (
               <div key={i} className="glass-card-premium p-6 rounded-[2rem] flex items-center gap-5 hover:-translate-y-1 transition-all group">
                  <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
                     {stat.icon}
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                     <p className="text-2xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
                  </div>
               </div>
            ))}
         </div>

         {/* Editorial Management Area */}
         <div className="space-y-6 animate-in fade-in duration-1000 delay-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <h2 className="text-xl font-black text-slate-800 tracking-tighter italic">Mission Database</h2>
               
               <div className="flex items-center gap-3 w-full sm:w-auto">
                  <select 
                    value={filterLevel} 
                    onChange={e => setFilterLevel(e.target.value)}
                    className="h-10 px-4 rounded-xl border border-white bg-white/50 backdrop-blur-md shadow-premium text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
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
                    className="h-10 px-4 rounded-xl border border-white bg-white/50 backdrop-blur-md shadow-premium text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    <option value="artikel">Artikel</option>
                    <option value="kasus">Kasus</option>
                    <option value="verb-konjugation">Conjugation</option>
                  </select>
               </div>
            </div>

            {error && (
               <div className="p-5 bg-rose-50 border border-rose-100 rounded-3xl text-rose-500 text-xs font-bold animate-in zoom-in-95">
                  Error: {error}
               </div>
            )}

            <div className="w-full">
               {loading && questions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-20 bg-white/50 backdrop-blur-md rounded-[3rem] border border-white">
                     <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing records...</p>
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

      </div>
    </AppShell>
  );
}
