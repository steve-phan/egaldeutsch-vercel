"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MessageSquareHeart, Sparkles, User, Activity, GraduationCap } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: "Home", href: "/", active: pathname === "/" },
    { icon: <Activity className="w-5 h-5" />, label: "Estimate", href: "/estimate", active: pathname === "/estimate" },
    { icon: <GraduationCap className="w-5 h-5" />, label: "Practice", href: "/practice", active: pathname === "/practice" },
    { icon: <Sparkles className="w-5 h-5" />, label: "Idioms", href: "/redewendung", active: pathname === "/redewendung" },
    { icon: <MessageSquareHeart className="w-5 h-5" />, label: "Feedback", href: "/feedback", active: pathname === "/feedback" },
    { icon: <User className="w-5 h-5" />, label: "Profile", href: "/profile", active: pathname === "/profile" },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 duration-700">
      <div className="glass-navigation rounded-[2rem] px-3 sm:px-4 py-3 flex items-center gap-1 sm:gap-4 shadow-floating">
        {navItems.map((item, idx) => {


          return (
            <Link key={idx} href={item.href}>
              <div
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 relative group active:scale-90
                  ${item.active ? "text-primary scale-110" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"}
                `}
              >
                {item.icon}
                {item.active && (
                  <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
                )}
                {/* Tooltip on Desktop */}
                <span className="absolute -top-10 scale-0 group-hover:scale-100 bg-slate-800 text-white text-[10px] font-black px-2 py-1 rounded transition-transform pointer-events-none uppercase tracking-widest">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
