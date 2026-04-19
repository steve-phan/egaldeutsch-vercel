"use client";

import Image from "next/image";
import { Award } from "lucide-react";
import { Session } from "next-auth";

interface MasteryHeroProps {
  session: Session | null;
  currentLevel: string;
}

export function MasteryHero({ session, currentLevel }: MasteryHeroProps) {
  return (
    <section className="flex flex-col items-center text-center space-y-4 pt-4">
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-2xl group-hover:bg-primary/30 transition-all duration-500" />
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-[2rem] overflow-hidden shadow-premium bg-white border-4 border-white p-1">
          <Image
            src={session?.user?.image || "/mascot.png"}
            alt="Profile Avatar"
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-white shadow-premium-sm rounded-xl p-2 border border-slate-50 text-primary">
          <Award className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-display font-black text-slate-800 tracking-tighter italic">
          {session?.user?.name?.split(' ')[0]} <span className="text-primary tracking-normal not-italic font-black text-xl align-top ml-1">MASTER</span>
        </h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          {session?.user?.role === 'admin' ? 'Elite Administrator' : `Mastery: ${currentLevel}`}
        </p>
      </div>
    </section>
  );
}
