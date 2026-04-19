"use client";

import Image from "next/image";
import { useResetPassword } from "@/hooks/use-reset-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Suspense } from "react";

function ResetPasswordForm() {
  const { 
    password, setPassword, 
    confirmPassword, setConfirmPassword, 
    loading, error, success, 
    handleSubmit, hasToken 
  } = useResetPassword();

  if (!hasToken) {
    return (
      <div className="text-center p-8 glass-card rounded-[2rem]">
        <h2 className="text-2xl font-black text-slate-800 mb-4">Ungültiger Link</h2>
        <p className="text-slate-500 font-bold mb-8">Dieser Reset-Link ist ungültig oder abgelaufen.</p>
        <Button onClick={() => window.location.href = "/login"}>Zurück zum Login</Button>
      </div>
    );
  }

  return (
    <div className="w-full glass-card p-10 md:p-12 rounded-[3.5rem] shadow-2xl bg-white/70 backdrop-blur-xl border border-white">
      <div className="mb-10 text-center">
         <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">Passwort zurücksetzen</h1>
         <p className="text-slate-500 font-bold">Wähle ein neues, sicheres Passwort.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="pass" className="text-sm font-black text-slate-400 ml-1 uppercase tracking-wider">Neues Passwort</Label>
          <Input
            id="pass"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading || success}
            className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-lg font-bold"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm" className="text-sm font-black text-slate-400 ml-1 uppercase tracking-wider">Passwort bestätigen</Label>
          <Input
            id="confirm"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading || success}
            className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-lg font-bold"
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm font-bold">
            {error}
          </div>
        )}

        {success ? (
           <div className="p-6 rounded-[2rem] bg-green-50 border border-green-100 text-green-700 font-bold text-center">
              ✅ Passwort erfolgreich geändert! Du wirst zum Login weitergeleitet...
           </div>
        ) : (
          <Button type="submit" className="w-full h-16 text-xl font-black btn-orange mt-4" disabled={loading}>
            {loading ? "Wird gespeichert..." : "Passwort speichern"}
          </Button>
        )}
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-background">
      <div className="w-full max-w-xl flex flex-col items-center">
        <div className="relative w-40 h-40 mb-6 animate-float">
          <Image 
            src="/mascot.png" 
            alt="EgalDeutsch Mascot - Securing your account" 
            fill 
            className="object-contain" 
          />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
