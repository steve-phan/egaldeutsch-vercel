"use client";

import Image from "next/image";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export function DashboardHeader() {
  const { data: session } = useSession();
  const [hasNotifs, setHasNotifs] = useState(true);

  return (
    <header className="w-full max-w-5xl mx-auto px-6 py-10 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 relative rounded-full overflow-hidden border-2 border-white shadow-xl bg-slate-100">
          <Image 
            src={session?.user?.image || "/mascot.png"} 
            alt="Profile" 
            fill 
            className="object-contain" 
          />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">
             {session?.user?.name || "Guten Tag!"}
          </h1>
          <p className="text-sm font-bold text-slate-400">Student Dashboard</p>
        </div>
      </div>

      <button className="relative w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group hover:text-primary transition-all active:scale-95 border border-slate-50">
        <Bell className="w-6 h-6" />
        {hasNotifs && (
          <span className="absolute top-3 right-3 w-3 h-3 bg-primary border-2 border-white rounded-full animate-pulse" />
        )}
      </button>
    </header>
  );
}
