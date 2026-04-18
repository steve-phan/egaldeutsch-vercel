"use client";

import { useEffect, useState } from "react";
import { useAdminQuestions } from "@/hooks/use-admin-questions";
import { RefreshCw, BarChart3, Database, Layers, Sparkles, Plus } from "lucide-react";
import { QuestionTable } from "@/components/admin/quiz/question-table";
import { AppShell } from "@/components/layout/app-shell";
import Link from "next/link";
import { PremiumCard } from "@/components/shared/premium-card";
import { StatCard } from "@/components/shared/stat-card";
import { VisualPageHeader } from "@/components/shared/visual-page-header";
import { Section } from "@/components/shared/layout/section";
import { CEFR_LEVELS, CATEGORY_META } from "@/lib/constants";

export default function AdminDashboardPage() {
  const { questions, loading, error, fetchQuestions, deleteQuestion } = useAdminQuestions();
  
  const [filterLevel, setFilterLevel] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");

  useEffect(() => {
    fetchQuestions(filterCategory, filterLevel);
  }, [fetchQuestions, filterCategory, filterLevel]);

  const stats = [
    { label: "Total Database", value: questions.length, icon: <Database className="w-5 h-5 focus:scale-110" />, color: "bg-indigo-500" },
    { label: "Active Modules", value: CATEGORY_META.length, icon: <Layers className="w-5 h-5" />, color: "bg-emerald-500" },
    { label: "Avg Mastery", value: "82%", icon: <Sparkles className="w-5 h-5" />, color: "bg-amber-500" },
  ];

  return (
    <AppShell showNav={true} maxWidth="2xl">
      <div className="w-full">
         
         {/* Premium Admin Header */}
         <Section spacing="sm">
            <VisualPageHeader
               title="Editorial Suite"
               subtitle="Curating the path to German mastery"
               icon={<BarChart3 className="w-6 h-6" />}
               iconColor="bg-slate-800"
            >
               <div className="flex items-center gap-3">
                  <button 
                    onClick={() => fetchQuestions(filterCategory, filterLevel)}
                    className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary shadow-premium border border-white transition-all active:rotate-180 duration-500"
                  >
                    <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                  </button>
                  <Link href="/admin/users">
                     <button className="h-12 px-6 rounded-2xl bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:border-primary/20 shadow-premium transition-all flex items-center gap-2">
                         <Database className="w-3.5 h-3.5" /> User Hub
                     </button>
                  </Link>
                  <Link href="/admin/questions/new">
                    <button className="btn-orange h-12 px-6 shadow-lg shadow-primary/20 active-bounce transition-all">
                      <Plus className="w-4 h-4" /> <span className="text-[10px] uppercase font-black tracking-widest ml-1">New Question</span>
                    </button>
                  </Link>
               </div>
            </VisualPageHeader>
         </Section>

         {/* Bento Stats */}
         <Section spacing="md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {stats.map((stat, i) => (
                  <StatCard 
                    key={i}
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                    delay={i * 100}
                  />
               ))}
            </div>
         </Section>

         {/* Editorial Management Area */}
         <Section spacing="md">
            <div className="space-y-6 animate-in fade-in duration-1000 delay-200">
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                     <h2 className="text-xl font-black text-slate-800 tracking-tighter italic">Mission Database</h2>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                     <select 
                       value={filterLevel} 
                       onChange={e => setFilterLevel(e.target.value)}
                       className="h-10 px-4 rounded-xl border border-white bg-white/50 backdrop-blur-md shadow-premium text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/5 outline-none transition-all cursor-pointer"
                     >
                       <option value="">All Levels</option>
                       {CEFR_LEVELS.map(lvl => (
                         <option key={lvl} value={lvl}>{lvl}</option>
                       ))}
                     </select>

                     <select 
                       value={filterCategory} 
                       onChange={e => setFilterCategory(e.target.value)}
                       className="h-10 px-4 rounded-xl border border-white bg-white/50 backdrop-blur-md shadow-premium text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/5 outline-none transition-all cursor-pointer"
                     >
                       <option value="">All Categories</option>
                       {CATEGORY_META.map(cat => (
                         <option key={cat.id} value={cat.id}>{cat.label.de}</option>
                       ))}
                     </select>
                  </div>
               </div>

               {error && (
                  <PremiumCard padding="md" className="bg-rose-50 border-rose-100 text-rose-500 animate-none rounded-2xl">
                     <p className="text-xs font-bold leading-none">Error synchronization: {error}</p>
                  </PremiumCard>
               )}

               <div className="w-full">
                  {loading && questions.length === 0 ? (
                     <div className="flex flex-col items-center justify-center p-20 bg-white/50 backdrop-blur-md rounded-[3rem] border border-white shadow-premium">
                        <RefreshCw className="w-10 h-10 animate-spin text-primary mb-4" />
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
         </Section>
      </div>
    </AppShell>
  );
}
