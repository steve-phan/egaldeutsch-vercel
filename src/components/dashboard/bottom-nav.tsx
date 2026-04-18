"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Search, Bell, User, MessageSquareHeart, LogIn } from "lucide-react";
import Image from "next/image";

export function BottomNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isGuest = status === "unauthenticated";

  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: "Home", href: "/", active: pathname === "/" },
    { icon: <Search className="w-5 h-5" />, label: "Explore", href: "/explore", active: pathname === "/explore" },
    { icon: null, label: "Hub", href: "/", isHub: true },
    { icon: <MessageSquareHeart className="w-5 h-5" />, label: "Feedback", href: "/feedback", active: pathname === "/feedback" },
    { 
       icon: isGuest ? <LogIn className="w-5 h-5" /> : <User className="w-5 h-5" />, 
       label: isGuest ? "Join" : "Profile", 
       href: isGuest ? "/signup" : "/profile", 
       active: pathname === "/profile" || pathname === "/signup" 
    },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 duration-700">
      <div className="glass-navigation rounded-[2rem] px-3 sm:px-4 py-3 flex items-center gap-1 sm:gap-4 shadow-floating">
        {navItems.map((item, idx) => {
          if (item.isHub) {
            return (
              <Link key={idx} href="/">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center -mt-9 shadow-lg shadow-primary/40 border-4 border-[#F8FAFC] active:scale-95 transition-all cursor-pointer relative group overflow-hidden">
                   <div className="absolute inset-0 bg-white/20 animate-pulse" />
                   <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />
                   <Image 
                     src="/mascot.png" 
                     alt="Home" 
                     width={32} 
                     height={32} 
                     className="object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" 
                   />
                </div>
              </Link>
            );
          }

          return (
            <Link key={idx} href={item.href}>
              <div
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 relative group
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
