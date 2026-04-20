"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, BarChart3, Clock, Home, ArrowRight, Trophy, AlertCircle, Zap, Settings2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { AppShell } from "@/components/layout/app-shell";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/shared/layout/section";

import { QuizSessionConfig } from "@/types/quiz";

interface SessionSummary {
  category: string;
  total: number;
  correct: number;
  answers: Array<{
    questionId: string;
    isCorrect: boolean;
    userAnswer: string;
    timeSpentMs: number;
  }>;
  config?: QuizSessionConfig;
}

export default function ResultsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { status } = useSession();
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const isGuest = status === "unauthenticated";

  useEffect(() => {
    const data = sessionStorage.getItem("lastSessionResult");
    if (data) {
       try {
         setSummary(JSON.parse(data));
       } catch {
         router.push("/");
       }
    } else {
       router.push("/");
    }
  }, [router]);

  if (!summary) return null;

  const scorePct = Math.round((summary.correct / summary.total) * 100);
  const totalTime = summary.answers.reduce((acc, curr) => acc + curr.timeSpentMs, 0);
  const avgTimePerQ = Math.round((totalTime / summary.total) / 1000);

  const isExcellent = scorePct >= 80;
  const isGood = scorePct >= 50;

  const getMessage = () => {
    if (isExcellent) return language === "de" ? "Hervorragend!" : language === "vi" ? "Tuyệt đỉnh!" : "Outstanding!";
    if (isGood) return language === "de" ? "Gut gemacht!" : language === "vi" ? "Làm tốt lắm!" : "Well Done!";
    return language === "de" ? "Übung macht den Meister!" : language === "vi" ? "Cố gắng thêm nhé!" : "Keep Practicing!";
  };

  return (
    <AppShell showNav={true} maxWidth="md">
      <div className="w-full">
         <Section spacing="sm">
            {/* Mission Card */}
            <div className="w-full glass-card-premium rounded-[3rem] p-8 md:p-12 text-center relative overflow-hidden animate-in zoom-in-95 duration-700 border border-white/50 shadow-premium">
               {/* Decorative Background */}
               <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-20 ${isExcellent ? "bg-primary" : "bg-slate-400"}`} />
               
               <div className="relative z-10 flex flex-col items-center">
                  <div className="w-32 h-32 relative mb-8 animate-float-gentle">
                     <Image 
                       src="/mascot.png" 
                       alt="EgalDeutsch Mascot celebrating your mission completion" 
                       fill 
                       sizes="128px"
                       priority
                       className={`object-contain transition-all ${!isGood && "grayscale opacity-40"}`} 
                     />
                     {isExcellent && (
                        <div className="absolute -top-2 -right-2 w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-500/30 animate-bounce">
                           <Trophy className="w-6 h-6" />
                        </div>
                     )}
                  </div>

                  <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-2 italic tracking-tighter leading-none">
                     {summary.category.replace("-", " ")} Mission {getMessage()}
                  </h1>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-12">
                     Your performance summary is ready
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                     <StatPill 
                       icon={<BarChart3 className="w-4 h-4 text-primary" />} 
                       label="Precision" 
                       value={`${scorePct}%`} 
                     />
                     <StatPill 
                       icon={<div className="flex gap-0.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" /><XCircle className="w-3 h-3 text-rose-500" /></div>} 
                       label="Answered" 
                       value={`${summary.correct}/${summary.total}`} 
                     />
                     <StatPill 
                       icon={<Clock className="w-4 h-4 text-amber-500" />} 
                       label="Avg Speed" 
                       value={`${avgTimePerQ}s`} 
                       className="col-span-2 sm:col-span-1"
                     />
                  </div>
               </div>
            </div>
         </Section>

         {/* Guest Conversion Hook */}
         {isGuest && (
            <Section spacing="sm">
               <div className="w-full p-6 rounded-[2.5rem] bg-accent border border-accent/20 flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-1000 shadow-xl shadow-accent/10">
                  <div className="w-12 h-12 rounded-2xl bg-white/50 backdrop-blur-md shadow-sm flex items-center justify-center shrink-0">
                     <AlertCircle className="w-6 h-6 text-black" />
                  </div>
                  <div className="flex-1">
                     <p className="text-sm font-black text-black italic leading-tight uppercase tracking-tight">Progress Not Saved!</p>
                     <p className="text-[10px] font-bold text-black/50 uppercase tracking-tight mt-1">Sign up to keep your scores and earn badges.</p>
                  </div>
                  <Link href="/signup">
                     <button className="px-5 py-2.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/20 hover:bg-zinc-800 transition-colors active-bounce">
                        Join Now
                     </button>
                  </Link>
               </div>
            </Section>
         )}

         {/* Action Controls */}
         <Section spacing="md">
            <div className="flex flex-col gap-4 w-full">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => router.push(`/quiz/${summary.category}?retry=true`)}
                    className="h-16 btn-orange shadow-premium active-bounce flex items-center justify-center gap-3 transition-transform"
                  >
                     <Zap className="w-5 h-5 fill-current" />
                     <div className="flex flex-col items-start leading-none">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-70">New Quiz</span>
                        <span className="text-xs sm:text-sm font-black">{language === "de" ? "Nochmal versuchen" : "Try again"}</span>
                     </div>
                  </button>

                  <button 
                    onClick={() => router.push(`/quiz/${summary.category}`)}
                    className="h-16 bg-white border border-slate-100 rounded-2xl font-black text-slate-600 hover:border-primary/30 hover:bg-slate-50 shadow-premium transition-all flex items-center justify-center gap-3 active-bounce"
                  >
                     <Settings2 className="w-5 h-5 text-primary" />
                     <div className="flex flex-col items-start leading-none text-left">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Settings</span>
                        <span className="text-xs sm:text-sm">{language === "de" ? "Quiz-Einstellungen" : "Quiz Settings"}</span>
                     </div>
                  </button>
               </div>

               <button 
                 onClick={() => router.push("/")}
                 className="h-12 w-full bg-slate-50 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all flex items-center justify-center gap-2 active:scale-95"
               >
                  <Home className="w-3 h-3" /> Back to Dashboard
               </button>
            </div>
         </Section>
      </div>
    </AppShell>
  );
}

function StatPill({ icon, label, value, className }: { icon: React.ReactNode, label: string, value: string, className?: string }) {
  return (
    <div className={`bg-white/50 backdrop-blur-md rounded-3xl p-5 border border-white/60 shadow-premium flex flex-col items-center gap-2 hover:-translate-y-1 transition-all ${className}`}>
       <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner">
          {icon}
       </div>
       <div className="flex flex-col">
          <span className="text-xl font-black text-slate-800 tracking-tighter leading-none text-center">{value}</span>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 text-center">{label}</span>
       </div>
    </div>
  );
}
