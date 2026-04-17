"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, BarChart3, Clock, Home, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

// Local storage type mirror
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
  const [summary, setSummary] = useState<SessionSummary | null>(null);

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

  let message = "";
  if (scorePct >= 90) message = "Hervorragend!";
  else if (scorePct >= 75) message = "Sehr gut!";
  else if (scorePct >= 50) message = "Gut gemacht!";
  else message = "Übung macht den Meister!";

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 md:px-8">
      <div className="w-full max-w-3xl">
        
        {/* Score Header */}
        <Card className="border-none shadow-xl bg-white overflow-hidden mb-8">
           <div className={`h-4 ${scorePct >= 75 ? "bg-green-500" : scorePct >= 50 ? "bg-amber-400" : "bg-red-500"}`} />
           <CardContent className="p-8 text-center flex flex-col items-center">
             <div className="text-6xl mb-6">{scorePct >= 75 ? "🎉" : scorePct >= 50 ? "👍" : "💪"}</div>
             <h1 className="text-3xl font-bold text-slate-800 mb-2">{message}</h1>
             <p className="text-xl text-slate-600 mb-8 capitalize">
               You completed the <span className="font-bold text-indigo-600">{summary.category.replace("-", " ")}</span> quiz!
             </p>

             <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                <div className="bg-slate-50 rounded-xl p-4 border flex flex-col items-center">
                   <BarChart3 className="text-indigo-500 mb-2" />
                   <span className="text-2xl font-bold text-slate-800">{scorePct}%</span>
                   <span className="text-xs text-slate-500 uppercase font-semibold">Score</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border flex flex-col items-center">
                   <div className="flex gap-1 mb-2">
                     <CheckCircle2 className="text-green-500 w-5 h-5" />
                     <XCircle className="text-red-500 w-5 h-5" />
                   </div>
                   <span className="text-xl font-bold text-slate-800">{summary.correct}/{summary.total}</span>
                   <span className="text-xs text-slate-500 uppercase font-semibold">Correct</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border flex flex-col items-center">
                   <Clock className="text-amber-500 mb-2" />
                   <span className="text-xl font-bold text-slate-800">{avgTimePerQ}s</span>
                   <span className="text-xs text-slate-500 uppercase font-semibold">Avg / Q</span>
                </div>
             </div>
           </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
           <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white" onClick={() => router.push("/")}>
             <Home className="mr-2 w-5 h-5" /> Home
           </Button>
           <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700" onClick={() => router.push("/dashboard")}>
             Dashboard <ArrowRight className="ml-2 w-5 h-5" />
           </Button>
        </div>

      </div>
    </main>
  );
}
