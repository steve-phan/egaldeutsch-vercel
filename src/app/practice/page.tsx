"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Section } from "@/components/shared/layout/section";
import { Card } from "@/components/shared/layout/card";
import { useRouter } from "next/navigation";
import { Settings2, BookOpen, GraduationCap, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";

export default function PracticeLandingPage() {
  const router = useRouter();

  return (
    <AppShell showNav={true} maxWidth="lg">
      <Section spacing="md">
        <div className="flex flex-col md:flex-row gap-8 items-start">
           {/* Left Info Column */}
           <div className="w-full md:w-1/3 flex flex-col gap-6">
              <Card padding="lg" radius="3xl" className="bg-primary/5 border-primary/10">
                 <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/20">
                    <GraduationCap className="w-6 h-6" />
                 </div>
                 <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic leading-none mb-4">
                    Targeted Practice
                 </h1>
                 <p className="text-sm font-bold text-slate-500 leading-relaxed mb-6">
                    Focus on specific grammar rules and CEFR levels to eliminate your weak spots and master German faster.
                 </p>
                 <div className="space-y-4">
                    <Feature small icon={<BookOpen className="w-3 h-3" />} text="Choose any grammar module" />
                    <Feature small icon={<Settings2 className="w-3 h-3" />} text="Select your target level (A1-B2)" />
                    <Feature small icon={<Sparkles className="w-3 h-3" />} text="Personalized 30-question sets" />
                 </div>
              </Card>

              <div className="hidden md:block relative w-full h-64 animate-float-gentle">
                 <Image src="/mascot.png" alt="Mascot" fill className="object-contain opacity-40 grayscale" />
              </div>
           </div>

           {/* Right Category Column */}
           <div className="w-full md:w-2/3">
              <Section spacing="none">
                 <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest text-[10px]">Step 1: Choose your Focus</h2>
                    <div className="h-[1px] flex-1 bg-slate-100" />
                 </div>
                 
                 <div className="bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-premium">
                    <p className="p-8 text-center text-slate-400 font-bold italic">
                       Pick a module from the dashboard lessons below to configure your custom practice session.
                    </p>
                    <button 
                      onClick={() => {
                        router.push("/");
                        setTimeout(() => {
                           document.getElementById('lessons-section')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary transition-all active:scale-95"
                    >
                       Browse All Modules <ChevronRight className="w-5 h-5" />
                    </button>
                 </div>
              </Section>
           </div>
        </div>
      </Section>
    </AppShell>
  );
}

function Feature({ icon, text, small = false }: { icon: React.ReactNode, text: string, small?: boolean }) {
  return (
    <div className="flex items-center gap-3">
       <div className={`rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-100 shrink-0 ${small ? 'w-6 h-6' : 'w-8 h-8'}`}>
          {icon}
       </div>
       <span className={`${small ? 'text-[10px]' : 'text-xs'} font-black text-slate-600 uppercase tracking-tight`}>{text}</span>
    </div>
  );
}
