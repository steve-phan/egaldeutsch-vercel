"use client";

import Link from "next/link";
import Image from "next/image";
import { useSignup } from "@/hooks/use-signup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const {
    name,
    email,
    password,
    error,
    isLoading,
    setName,
    setEmail,
    setPassword,
    handleSubmit,
  } = useSignup();

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-background">
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Mascot Header */}
        <div className="relative w-48 h-48 mb-6 animate-float">
          <Image
            src="/mascot.png"
            alt="EgalDeutsch Mascot"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Signup Card */}
        <div className="w-full glass-card p-10 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden bg-white/70 backdrop-blur-xl border border-white">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">Konto erstellen</h1>
            <p className="text-slate-500 font-bold">Start your German learning journey today!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-black text-slate-400 ml-1 uppercase tracking-wider">Dein Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-lg font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-black text-slate-400 ml-1 uppercase tracking-wider">E-Mail Adresse</Label>
              <Input
                id="email"
                type="email"
                placeholder="beispiel@mail.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-lg font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" title="Passwort" className="text-sm font-black text-slate-400 ml-1 uppercase tracking-wider">Passwort</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-lg font-bold"
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-16 text-xl font-black btn-orange mt-4" disabled={isLoading}>
              {isLoading ? "Wird erstellt..." : "Kostenlos registrieren"}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center">
            <p className="text-slate-400 font-bold mb-4">Bereits ein Konto?</p>
            <Link href="/login">
              <Button variant="outline" className="h-12 px-8 rounded-2xl border-slate-200 font-black text-slate-600 hover:bg-slate-50 transition-all">
                Zum Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Brand */}
        <p className="mt-12 text-slate-400 font-black tracking-widest uppercase text-xs">
          © {new Date().getFullYear()} EgalDeutsch • Learn German with Ease
        </p>
      </div>
    </main>
  );
}
