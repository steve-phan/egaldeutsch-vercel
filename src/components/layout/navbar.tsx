"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Bell, Sparkles, LogIn } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

import { useNotifications } from "@/hooks/use-notifications";
import { Brand } from "../shared/brand";

import { useLanguage } from "@/contexts/language-context";

export function Navbar() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const { unreadCount } = useNotifications();
  const isGuest = status === "unauthenticated";
  const isLoading = status === "loading";

  const renderTitle = () => {
    if (isLoading) {
      return <Skeleton className="w-20 h-2.5" />
    }
    if (isGuest) {
      return (
        <>
          <Sparkles className="w-2.5 h-2.5 text-slate-300" /> {t("nav.mastery_awaits")}
        </>
      )
    }
    return (
      <>
        <Sparkles className="w-2.5 h-2.5 text-primary" /> {t("nav.mastery_level")}: {session?.user?.role === 'admin' ? 'Admin' : 'A2'}
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
              {t("nav.login")} <LogIn className="w-3.5 h-3.5" />
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
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white shadow-sm" />
            )}
          </button>
        </Link>

        <Link href="/profile" className="flex items-center gap-3 pl-3 border-l border-slate-100">
          <div className="hidden sm:block text-right">
            <p className="text-[11px] font-black text-slate-800 leading-tight">
              {session?.user?.name?.split(' ')[0]}
            </p>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
              {t("nav.view_profile")}
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
    <header className="w-full h-16 flex items-center justify-between px-2 md:px-16 bg-white/95 backdrop-blur-xl border-b border-slate-100/50 z-50 sticky top-0">
      <Link href="/" className="flex items-center gap-3 active:scale-95 transition-all">
        <div className="h-8 md:h-10 w-40 md:w-48 relative overflow-hidden">
          <Image
            src="/ed_logo.svg"
            alt="Egal Deutsch"
            fill
            className="object-contain"
            priority
          />
        </div>
      </Link>

      <div className="flex items-center gap-4 md:gap-8">

        {renderRightSide()}
      </div>
    </header>
  );
}
