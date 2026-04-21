"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Section } from "@/components/shared/layout/section";
import { Card } from "@/components/shared/layout/card";
import { useRouter } from "next/navigation";
import { Zap, Target, BarChart, ChevronRight, Activity } from "lucide-react";
import Image from "next/image";

export default function EstimatePage() {
  const router = useRouter();

  const handleStart = () => {
    // Redirect to the quiz orchestrator with autoStart parameters
    router.push("/quiz/mixed?mode=test&autoStart=true");
  };

  return (
    <AppShell showNav={true} maxWidth="md">
      <Section spacing="md">
        <Card padding="none" glow className="overflow-hidden border-2 border-primary/20 animate-in zoom-in-95 duration-700">
          <div className="bg-primary/5 p-8 md:p-12 text-center relative">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <BarChart className="w-24 h-24" />
             </div>
             
             <div className="flex flex-col items-center gap-6">
                <div className="w-24 h-24 relative animate-float-gentle">
                   <Image src="/mascot.png" alt="Fox Mascot" fill className="object-contain" />
                </div>
                
                <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter italic leading-none">
                  Estimate Your Level
                </h1>
                <p className="text-slate-400 font-bold max-w-sm">
                  Our algorithm will assess your German proficiency across all grammar modules in just 30 questions.
                </p>
             </div>
          </div>

          <div className="p-8 md:p-12 space-y-8 bg-white">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeatureItem 
                  icon={<Zap className="text-orange-500" />} 
                  title="30 Balanced Questions" 
                  desc="Covering A1, A2, B1, and B2 levels."
                />
                <FeatureItem 
                  icon={<Target className="text-primary" />} 
                  title="Mixed Categories" 
                  desc="Assessment spans all grammar subjects."
                />
                <FeatureItem 
                  icon={<BarChart className="text-blue-500" />} 
                  title="Instant Result" 
                  desc="Get your estimated CEFR level immediately."
                />
                <FeatureItem 
                  icon={<Activity className="text-emerald-500" />} 
                  title="Personalized Path" 
                  desc="We'll suggest where to focus after."
                />
             </div>

             <div className="pt-8 border-t border-slate-100">
                <button 
                  onClick={handleStart}
                  className="w-full btn-orange h-16 md:h-20 text-lg md:text-2xl font-black shadow-premium active-bounce group"
                >
                  Start Assessment <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
                </button>
                <p className="text-center mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   Est. Time: 10-15 Minutes • No Account Required
                </p>
             </div>
          </div>
        </Card>
      </Section>
    </AppShell>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all hover:bg-white hover:shadow-sm">
       <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
          {icon}
       </div>
       <div>
          <h3 className="font-black text-slate-800 text-sm">{title}</h3>
          <p className="text-xs font-bold text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}
