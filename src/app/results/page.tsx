"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, BarChart3, Clock, Home, ArrowRight, Trophy, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { AppShell } from "@/components/layout/app-shell";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

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
      <div className="w-full flex flex-col items-center">
        
        {/* Mission Card */}
        <div className="w-full glass-card-premium rounded-[3rem] p-10 text-center relative overflow-hidden mb-6 animate-in zoom-in-95 duration-700">
           {/* Decorative Background */}
           <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-20 ${isExcellent ? "bg-primary" : "bg-slate-400"}`} />
           
           <div className="relative z-10 flex flex-col items-center">
              <div className="w-32 h-32 relative mb-6 animate-float-gentle">
                 <Image 
                   src="/mascot.png" 
                   alt="Mission Mascot" 
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
                 {getMessage()}
              </h1>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-10">
                 Mission: {summary.category.replace("-", " ")} Complete
              </p>

              <div className="grid grid-cols-3 gap-4 w-full">
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
                 />
              </div>
           </div>
        </div>

        {/* Guest Conversion Hook */}
        {isGuest && (
           <div className="w-full p-6 rounded-[2rem] bg-indigo-50 border border-indigo-100 mb-8 flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-1000">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                 <AlertCircle className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="flex-1">
                 <p className="text-sm font-black text-slate-800 italic leading-tight">Progress Not Saved!</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">Sign up for free to keep your scores and earn badges.</p>
              </div>
              <Link href="/signup">
                 <button className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-colors">
                    Join Now
                 </button>
              </Link>
           </div>
        )}

        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
           <button 
             onClick={() => router.push("/")}
             className="h-12 bg-white border border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:border-slate-200 shadow-premium transition-all flex items-center justify-center gap-2"
           >
              <Home className="w-4 h-4" /> Home
           </button>
           <button 
             onClick={() => router.push("/")}
             className="btn-orange btn-compact flex items-center justify-center gap-2"
           >
              Try Another <ArrowRight className="w-4 h-4" />
           </button>
        </div>

      </div>
    </AppShell>
  );
}

function StatPill({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-white/50 backdrop-blur-md rounded-3xl p-5 border border-white/60 shadow-premium flex flex-col items-center gap-2 hover:-translate-y-1 transition-all">
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
