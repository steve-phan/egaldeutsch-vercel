"use client";

import Link from "next/link";
import Image from "next/image";
import { useForgotPassword } from "@/hooks/use-forgot-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const { email, setEmail, loading, error, success, handleSubmit } = useForgotPassword();

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-background">
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Mascot */}
        <div className="relative w-40 h-40 mb-6 animate-float">
          <Image 
            src="/mascot.png" 
            alt="EgalDeutsch Mascot - Password recovery support" 
            fill 
            className="object-contain" 
          />
        </div>

        {/* Card */}
        <div className="w-full glass-card p-10 md:p-12 rounded-[3.5rem] shadow-2xl bg-white/70 backdrop-blur-xl border border-white">
          <div className="mb-10">
             <Link href="/login" className="inline-flex items-center text-slate-400 font-bold hover:text-primary transition-colors mb-6">
                <ChevronLeft className="w-5 h-5 mr-1" />
                Zurück zum Login
             </Link>
             <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">Passwort vergessen?</h1>
             <p className="text-slate-500 font-bold">Gib deine E-Mail ein, um einen Reset-Link zu erhalten.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-black text-slate-400 ml-1 uppercase tracking-wider">E-Mail Adresse</Label>
              <Input
                id="email"
                type="email"
                placeholder="beispiel@mail.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || !!success}
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-lg font-bold"
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm font-bold">
                {error}
              </div>
            )}

            {success ? (
               <div className="p-6 rounded-[2rem] bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-center animate-in zoom-in-95 duration-500">
                  ✅ {success}
               </div>
            ) : (
              <Button type="submit" className="w-full h-16 text-xl font-black btn-orange mt-4" disabled={loading}>
                {loading ? "Wird gesendet..." : "Link anfordern"}
              </Button>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
