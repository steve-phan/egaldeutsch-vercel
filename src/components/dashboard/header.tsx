"use client";

import Image from "next/image";
import { Settings, Bell, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function DashboardHeader() {
  const { data: session } = useSession();

  return (
    <header className="w-full pt-8 pb-2 flex justify-between items-center animate-in slide-in-from-top-4 duration-700">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-10 h-10 md:w-12 md:h-12 relative rounded-xl md:rounded-2xl overflow-hidden shadow-premium bg-white border-2 border-white ring-4 ring-slate-50">
          <Image
            src={"/ed_logo.svg"}
            alt={session?.user?.name ? `${session.user.name}'s profile picture` : "User profile picture"}
            fill
            sizes="(max-width: 768px) 40px, 48px"
            className="object-contain hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div>
          <div className="text-lg md:text-xl font-black text-slate-800 tracking-tighter leading-tight italic hidden xs:block">
            Moin, {session?.user?.name?.split(' ')[0] || "Explorer"}!
          </div>
          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-primary" /> Mastery: A2
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/notifications">
          <button className="w-10 h-10 bg-white shadow-premium rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all active-bounce border border-slate-50 relative group">
            <Bell className="w-5 h-5 group-hover:animate-ring" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white shadow-sm" />
          </button>
        </Link>

        <Link href="/profile">
          <button className="w-10 h-10 bg-white shadow-premium rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all active-bounce border border-slate-50">
            <Settings className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </header>
  );
}
