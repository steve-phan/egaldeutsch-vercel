"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Bell, Sparkles, LogIn } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export function Navbar() {
  const { data: session, status } = useSession();
  const isGuest = status === "unauthenticated";
  const isLoading = status === "loading";

  const renderTitle = () => {
    if (isLoading) {
      return <Skeleton className="w-20 h-2.5" />
    }
    if (isGuest) {
      return (
        <>
          <Sparkles className="w-2.5 h-2.5 text-slate-300" /> Mastery Awaits
        </>
      )
    }
    return (
      <>
        <Sparkles className="w-2.5 h-2.5 text-primary" /> Mastery: {session?.user?.role === 'admin' ? 'Admin' : 'A2'}
      </>
    )
  }


  const renderRightSide = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="w-10 h-10" />
          <Skeleton className="w-10 h-10" />
        </div>
      )
    }
    if (isGuest) {
      return (
        <div className="flex items-center gap-2">
          <Link href="/login">
            <button className="btn-orange h-10 px-5 text-xs font-black flex items-center gap-2">
              Login <LogIn className="w-3.5 h-3.5" />
            </button>
          </Link>
          {/* <Link href="/signup">
            <button className="btn-orange h-10 px-5 text-xs font-black flex items-center gap-2">
              Join <span className="hidden sm:inline">Us</span> <LogIn className="w-3.5 h-3.5" />
            </button>
          </Link> */}
        </div>
      )
    }
    return (
      <div className="flex items-center gap-2">
        <Link href="/notifications">
          <button className="w-10 h-10 bg-white/50 shadow-sm rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90 border border-slate-100 relative group">
            <Bell className="w-5 h-5 group-hover:animate-ring" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white shadow-sm" />
          </button>
        </Link>

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
              src={session?.user?.image || "/mascot.png"}
              alt="Profile"
              fill
              sizes="40px"
              className="object-contain"
            />
          </div>
        </Link>
      </div>
    )
  }

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
          <div className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1">
            {renderTitle()}
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-2 md:gap-4">
        {renderRightSide()}
      </div>
    </header>
  );
}
