"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

export function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="w-full mt-auto py-12 border-t border-slate-100 bg-white/50 backdrop-blur-sm relative z-10">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo / Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-2xl font-black text-slate-800 tracking-tighter italic">
              Egal<span className="text-primary italic">Deutsch</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Lerne Deutsch, egal wie.
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-8">
            <Link 
              href="/impressum" 
              className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors"
            >
              Impressum
            </Link>
            <Link 
              href="/datenschutz" 
              className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors"
            >
              Datenschutz
            </Link>
            <a 
              href="mailto:help@egaldeutsch.com" 
              className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors"
            >
              {language === "de" ? "Kontakt" : language === "vi" ? "Liên hệ" : "Contact"}
            </a>
          </div>

          {/* Copyright */}
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            © {new Date().getFullYear()} EgalDeutsch
          </div>
        </div>
      </div>
    </footer>
  );
}
