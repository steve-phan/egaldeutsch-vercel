"use client";

import Image from "next/image";
import Link from "next/link";
import { LogIn, Sparkles } from "lucide-react";

export function GuestHeader() {
  return (
    <header className="w-full max-w-5xl mx-auto px-6 pt-8 pb-4 flex justify-between items-center animate-in slide-in-from-top-4 duration-700">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 relative rounded-xl overflow-hidden shadow-premium bg-white border border-white p-2">
          <Image 
            src="/mascot.png" 
            alt="EgalDeutsch Mascot" 
            fill 
            sizes="40px"
            className="object-contain" 
          />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-tight italic">
             EgalDeutsch
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1">
             <Sparkles className="w-2.5 h-2.5 text-primary" /> Guest Explorer
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
         <Link href="/login">
            <button className="h-10 px-5 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:text-primary transition-colors">
               Login
            </button>
         </Link>
         <Link href="/signup">
            <button className="btn-orange h-10 px-6 text-xs font-black flex items-center gap-2">
               Join Us <LogIn className="w-3.5 h-3.5" />
            </button>
         </Link>
      </div>
    </header>
  );
}
