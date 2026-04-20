"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

import { Brand } from "../shared/brand";

export function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="w-full mt-auto py-20 border-t border-slate-100 bg-white relative z-10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Logo / Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Brand size="lg" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Lerne Deutsch, egal wie.
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-10">
            {[
              { href: "/impressum", label: "Impressum" },
              { href: "/datenschutz", label: "Datenschutz" },
              { href: "mailto:help@egaldeutsch.com", label: language === "de" ? "Kontakt" : language === "vi" ? "Liên hệ" : "Contact" }
            ].map((link) => (
              <Link 
                key={link.label}
                href={link.href} 
                className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-[0.2em] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.15em]">
            © {new Date().getFullYear()} EgalDeutsch
          </div>
        </div>
      </div>
    </footer>
  );
}
