"use client";

import Image from "next/image";
import Link from "next/link";
import { useResetPassword } from "@/hooks/use-reset-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/shared/layout/card";
import { Lock, Loader2, ChevronLeft, AlertCircle, ShieldCheck } from "lucide-react";

function ResetPasswordForm() {
  const { 
    password, setPassword, 
    confirmPassword, setConfirmPassword, 
    loading, error, success, 
    handleSubmit, hasToken 
  } = useResetPassword();

  if (!hasToken) {
    return (
      <Card padding="lg" glass className="w-full shadow-premium border-white/60 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight italic">Link Ungültig</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed px-4">
            Dieser Reset-Link ist leider abgelaufen oder wurde bereits verwendet.
          </p>
        </div>
        <Button asChild className="w-full h-16 rounded-2xl font-black bg-slate-800 hover:bg-slate-900 text-white shadow-premium active-bounce">
          <Link href="/login">Zurück zum Login</Link>
        </Button>
      </Card>
    );
  }

  return (
    <Card padding="lg" glass className="w-full shadow-premium border-white/60 bg-white/40 backdrop-blur-2xl rounded-[2.5rem]">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter italic leading-tight">
            Passwort <span className="text-primary not-italic">Neu setzen</span>
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tight mt-2">
            Wähle ein sicheres, neues Passwort
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="pass" className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest block">
                Neues Passwort
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <Input
                  id="pass"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || success}
                  className="h-16 pl-12 rounded-2xl border-slate-100 bg-white/50 shadow-sm focus:ring-primary/20 transition-all font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirm" className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest block">
                Passwort bestätigen
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-primary transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading || success}
                  className="h-16 pl-12 rounded-2xl border-slate-100 bg-white/50 shadow-sm focus:ring-primary/20 transition-all font-bold text-slate-800"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 text-[10px] font-black uppercase tracking-tight text-center animate-in shake duration-300">
              {error}
            </div>
          )}

          {success ? (
            <div className="space-y-6 animate-in zoom-in-95 duration-500 py-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                 <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="p-6 rounded-[2rem] bg-emerald-50/50 border border-emerald-100 text-emerald-700 font-bold text-center text-sm">
                Passwort erfolgreich geändert! Du wirst zum Login weitergeleitet...
              </div>
            </div>
          ) : (
            <Button 
              type="submit" 
              className="w-full h-16 rounded-2xl text-base font-black btn-orange shadow-premium active-bounce group" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Passwort speichern <ChevronLeft className="w-4 h-4 rotate-180" />
                </span>
              )}
            </Button>
          )}
        </form>
      </div>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <AppShell showNav={false} maxWidth="sm">
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        
        {/* Animated Mascot / Branding */}
        <div className="relative group mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-2xl group-hover:bg-primary/30 transition-all duration-500 animate-pulse" />
          <div className="relative w-32 h-32 md:w-36 md:h-36 animate-float">
            <Image
              src="/mascot.png"
              alt="EgalDeutsch Mascot"
              fill
              sizes="(max-width: 768px) 128px, 144px"
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>

        <p className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          EgalDeutsch &copy; 2026 • Premium Learning
        </p>
      </div>
    </AppShell>
  );
}
