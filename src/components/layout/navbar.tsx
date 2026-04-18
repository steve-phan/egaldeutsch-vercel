"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Bell, Settings, Sparkles, LogIn, User } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();
  const isGuest = status === "unauthenticated";

  return (
    <header className="w-full h-20 flex items-center justify-between px-6 bg-white/70 backdrop-blur-xl border-b border-white z-50 sticky top-0">
      <Link href="/" className="flex items-center gap-2 md:gap-3 group active:scale-95 transition-all">
        <div className="w-9 h-9 md:w-10 md:h-10 relative rounded-xl overflow-hidden shadow-premium bg-white border border-white p-1.5 md:p-2 group-hover:rotate-6 transition-transform">
          <Image 
            src="/mascot.png" 
            alt="EgalDeutsch Mascot" 
            fill 
            sizes="(max-width: 768px) 36px, 40px"
            className="object-contain" 
            priority
          />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-black text-slate-800 tracking-tighter leading-tight italic">
             EgalDeutsch
          </h1>
          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1">
             {isGuest ? (
               <>
                 <Sparkles className="w-2.5 h-2.5 text-slate-300" /> Mastery Awaits
               </>
             ) : (
               <>
                 <Sparkles className="w-2.5 h-2.5 text-primary" /> Mastery: { (session?.user as any)?.role === 'admin' ? 'Admin' : 'A2' }
               </>
             )}
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-2 md:gap-4">
        {status === "loading" ? (
          <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse" />
        ) : isGuest ? (
          <>
            <Link href="/login" className="hidden xs:block">
              <button className="h-10 px-4 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:text-primary transition-colors">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="btn-orange h-10 px-5 text-xs font-black flex items-center gap-2">
                Join <span className="hidden sm:inline">Us</span> <LogIn className="w-3.5 h-3.5" />
              </button>
            </Link>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mr-2">
              <Link href="/notifications">
                <button className="w-10 h-10 bg-white/50 shadow-sm rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90 border border-slate-100 relative group">
                  <Bell className="w-5 h-5 group-hover:animate-ring" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white shadow-sm" />
                </button>
              </Link>

              <Link href="/profile">
                <button className="w-10 h-10 bg-white/50 shadow-sm rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-95 border border-slate-100">
                  <Settings className="w-5 h-5" />
                </button>
              </Link>
            </div>

            <Link href="/profile" className="flex items-center gap-3 pl-3 border-l border-slate-100">
              <div className="hidden sm:block text-right">
                <p className="text-[11px] font-black text-slate-800 leading-tight">
                  {session?.user?.name?.split(' ')[0]}
                </p>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  View Profile
                </p>
              </div>
              <div className="w-10 h-10 relative rounded-xl overflow-hidden shadow-premium bg-white border border-slate-100 p-0.5">
                <Image 
                  src={(session?.user as any)?.image || "/mascot.png"} 
                  alt="Profile" 
                  fill 
                  className="object-contain" 
                />
              </div>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
