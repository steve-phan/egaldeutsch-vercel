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
    handleGoogleLogin,
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
          <h1 className="text-4xl font-display font-black text-slate-800 tracking-tight italic">
            Egal<span className="text-primary italic">Deutsch</span>
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

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 font-bold text-slate-300 tracking-widest">ODER</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-14 rounded-2xl border-slate-200 font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all text-slate-600"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Mit Google anmelden
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
