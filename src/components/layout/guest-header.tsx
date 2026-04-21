"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogIn, Sparkles, User, X } from "lucide-react";
import { Brand } from "../shared/brand";

import { useLanguage } from "@/contexts/language-context";

export function GuestHeader() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full pt-8 pb-4 flex justify-between items-center animate-in slide-in-from-top-4 duration-700 relative">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-8 h-8 md:w-10 md:h-10 relative rounded-xl overflow-hidden shadow-premium bg-white border border-white p-1.5 md:p-2">
          <Image 
            src="/mascot.png" 
            alt="EgalDeutsch Mascot" 
            fill 
            sizes="(max-width: 768px) 32px, 40px"
            className="object-contain" 
          />
        </div>
        <div>
          <Brand size="lg" as="h1" className="hidden xs:block" />
          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1">
             <Sparkles className="w-2.5 h-2.5 text-primary" /> {t("nav.guest")}
          </p>
        </div>
      </div>

      {/* Desktop Actions */}
      <div className="hidden sm:flex items-center gap-3">
         <Link href="/login">
            <button className="h-10 px-5 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:text-primary transition-colors">
               {t("nav.login")}
            </button>
         </Link>
         <Link href="/signup">
            <button className="btn-orange h-10 px-6 text-xs font-black flex items-center gap-2">
               {t("nav.join_us")} <LogIn className="w-3.5 h-3.5" />
            </button>
         </Link>
      </div>

      {/* Mobile Dropdown Trigger */}
      <div className="sm:hidden flex items-center gap-2">
         <button 
           onClick={() => setIsOpen(!isOpen)}
           className="w-10 h-10 bg-white shadow-premium rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all border border-slate-50 relative"
         >
           {isOpen ? <X className="w-5 h-5" /> : <User className="w-5 h-5" />}
         </button>
 
         {isOpen && (
           <div className="absolute top-full right-0 mt-3 w-48 bg-white/90 backdrop-blur-xl border border-white shadow-floating rounded-2xl p-2 z-50 animate-in zoom-in-95 fade-in duration-200 origin-top-right">
             <Link href="/login" onClick={() => setIsOpen(false)}>
               <div className="flex items-center gap-3 p-4 hover:bg-slate-50 rounded-xl transition-colors">
                 <LogIn className="w-4 h-4 text-slate-400" />
                 <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{t("nav.login")}</span>
               </div>
             </Link>
             <Link href="/signup" onClick={() => setIsOpen(false)}>
               <div className="flex items-center gap-3 p-4 bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors mt-1">
                 <LogIn className="w-4 h-4 text-primary" />
                 <span className="text-xs font-black text-primary uppercase tracking-widest">{t("nav.join_us")}</span>
               </div>
             </Link>
           </div>
         )}
      </div>
    </header>
  );
}
