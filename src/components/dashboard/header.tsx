"use client";

import Image from "next/image";
import { Settings, Bell, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function DashboardHeader() {
  const { data: session } = useSession();

  return (
    <header className="w-full max-w-5xl mx-auto px-6 pt-8 pb-4 flex justify-between items-center animate-in slide-in-from-top-4 duration-700">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 relative rounded-2xl overflow-hidden shadow-premium bg-white border-2 border-white ring-4 ring-slate-50">
          <Image 
            src={session?.user?.image || "/mascot.png"} 
            alt="Profile" 
            fill 
            sizes="48px"
            className="object-contain" 
          />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-tight italic">
             Moin, {session?.user?.name?.split(' ')[0] || "Explorer"}!
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1">
             <Sparkles className="w-2.5 h-2.5 text-primary" /> Mastery Level: A2
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
         <Link href="/notifications">
            <button className="w-10 h-10 bg-white shadow-premium rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90 border border-slate-50 relative group">
               <Bell className="w-5 h-5 group-hover:animate-ring" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white shadow-sm" />
            </button>
         </Link>

         <Link href="/profile">
            <button className="w-10 h-10 bg-white shadow-premium rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-95 border border-slate-50">
               <Settings className="w-5 h-5" />
            </button>
         </Link>
      </div>
    </header>
  );
}
