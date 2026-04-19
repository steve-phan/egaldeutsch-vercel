"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-2xl flex flex-col items-center text-center z-10">
        {/* Lost Mascot Visual */}
        <div className="relative w-64 h-64 mb-12 drop-shadow-[0_25px_25px_rgba(0,0,0,0.15)] animate-float">
          <Image 
            src="/mascot.png" 
            alt="EgalDeutsch Mascot looking lost and confused on a 404 page" 
            fill 
            className="object-contain"
            priority
          />
          {/* Confused Question Marks */}
          <div className="absolute top-0 -right-4 text-6xl font-black text-primary/20 rotate-12 animate-bounce">?</div>
          <div className="absolute -top-8 left-4 text-4xl font-black text-secondary/20 -rotate-12 animate-bounce" style={{ animationDelay: '0.5s' }}>?</div>
        </div>

        {/* Error Content */}
        <div className="space-y-6 mb-12">
          <div className="text-8xl font-display font-black text-slate-200 tracking-tighter leading-none mb-2">
            404
          </div>
          <h1 className="text-4xl font-display font-black text-slate-800 tracking-tight">
            Oh nein! Seite nicht gefunden.
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
            It seems you've wandered into a grammar-free zone. Even our mascot is confused!
          </p>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button 
            asChild
            className="flex-1 h-14 text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-95 group"
          >
            <Link href="/">
              <Home className="mr-2 w-5 h-5 transition-transform group-hover:-translate-y-1" />
              Go Back Home
            </Link>
          </Button>
          
          <Button 
            variant="outline"
            asChild
            className="flex-1 h-14 text-lg font-bold rounded-2xl border-2 border-slate-200 hover:bg-slate-50 transition-all text-slate-600 active:scale-95"
          >
            <Link href="/explore">
              <Search className="mr-2 w-5 h-5" />
              Explore Topics
            </Link>
          </Button>
        </div>

        {/* Help Links */}
        <div className="mt-16 pt-8 border-t border-slate-100 w-full max-w-sm flex justify-center gap-8">
          <Link href="/lessons" className="text-sm font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
            Lessons
          </Link>
          <Link href="/quiz/general" className="text-sm font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
            Quizzes
          </Link>
          <Link href="/profile" className="text-sm font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
            My Profile
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
