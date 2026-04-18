"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-24 left-6 right-6 md:left-auto md:right-8 md:w-[400px] z-[100] animate-in slide-in-from-bottom-10 fade-in duration-700">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden group">
        {/* Subtle accent glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
        
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Cookie className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest italic">
              {language === "de" ? "Cookie-Hinweis" : language === "vi" ? "Thông báo Cookie" : "Cookie Notice"}
            </h3>
            <button 
              onClick={() => setShow(false)}
              className="ml-auto text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs font-bold text-slate-500 leading-relaxed">
            {language === "de" 
              ? "Wir verwenden nur technisch notwendige Cookies, um Ihre Anmeldung zu ermöglichen. Durch die Nutzung der Website stimmen Sie diesem zu." 
              : language === "vi"
              ? "Chúng tôi chỉ sử dụng Cookie kỹ thuật cần thiết để duy trì đăng nhập của bạn. Bằng cách sử dụng trang web, bạn đồng ý với điều này."
              : "We only use technically necessary cookies to enable your login. By using the website, you agree to this."
            }
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button 
              onClick={acceptAll}
              className="btn-orange h-10 px-6 text-[10px] font-black uppercase tracking-widest flex-1"
            >
              {language === "de" ? "Akzeptieren" : language === "vi" ? "Đồng ý" : "Accept All"}
            </button>
            <Link 
              href="/datenschutz"
              className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors px-2"
            >
              {language === "de" ? "Details" : language === "vi" ? "Chi tiết" : "Details"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
