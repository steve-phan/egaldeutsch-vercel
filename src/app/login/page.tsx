"use client";

import Link from "next/link";
import { useLogin } from "@/hooks/use-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function LoginPage() {
  const {
    email,
    password,
    error,
    isLoading,
    setEmail,
    setPassword,
    handleSubmit,
  } = useLogin();

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-background">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* Mascot & Branding */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative w-48 h-48 mb-4 drop-shadow-2xl animate-float">
            <Image 
              src="/mascot.png" 
              alt="EgalDeutsch Mascot" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl font-display font-black text-slate-800 tracking-tight">
            egal<span className="text-primary">deutsch</span>
          </h1>
        </div>

        {/* Login Form */}
        <div className="w-full glass-card p-8 rounded-[2rem]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 focus:ring-primary/20 transition-all px-6 text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 focus:ring-primary/20 transition-all px-6 text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            {error && <p className="text-sm text-destructive font-bold text-center">{error}</p>}

            <Button type="submit" className="w-full h-14 text-xl font-bold btn-orange" disabled={isLoading}>
              {isLoading ? "Loging in..." : "Log in"}
            </Button>
          </form>

          <div className="mt-8 flex flex-col items-center space-y-4">
            <Link href="/forgot-password" title="Forgot Password" className="text-sm font-bold text-slate-400 hover:text-primary transition-colors">
              Forgot password?
            </Link>
            
            <div className="w-full pt-6 border-t border-slate-100 text-center">
              <p className="text-sm font-bold text-slate-400">
                Neu hier?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Kostenlos anmelden
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
