"use client";

import Image from "next/image";
import { Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function DashboardHeader() {
  const { data: session } = useSession();

  return (
    <header className="w-full max-w-5xl mx-auto px-6 pt-8 pb-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 relative rounded-xl overflow-hidden shadow-premium bg-white border border-white">
          <Image 
            src={session?.user?.image || "/icon.png"} 
            alt="Profile" 
            fill 
            sizes="40px"
            className="object-contain" 
          />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-tight italic">
             Moin, {session?.user?.name?.split(' ')[0] || "Student"}!
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Learning Level: A2</p>
        </div>
      </div>

      <Link href="/profile">
        <button className="w-9 h-9 bg-white/50 backdrop-blur-md rounded-xl flex items-center justify-center shadow-premium text-slate-400 hover:text-primary transition-all active:scale-95 border border-white/80">
          <Settings className="w-4 h-4" />
        </button>
      </Link>
    </header>
  );
}
