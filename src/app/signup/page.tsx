"use client";

import Link from "next/link";
import Image from "next/image";
import { useSignup } from "@/hooks/use-signup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Languages } from "lucide-react";
import { Section } from "@/components/shared/layout/section";
import { PageContainer } from "@/components/shared/layout/page-container";
import { AppShell } from "@/components/layout/app-shell";

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
        language,
        setLanguage,
        handleSubmit,
        handleGoogleLogin,
    } = useSignup();

    const languages = [
        { code: "en", name: "English", flag: "🇺🇸" },
        { code: "de", name: "Deutsch", flag: "🇩🇪" },
        { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    ] as const;

    return (
        <AppShell >
            {/* Premium Background Accents */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] translate-y-1/2" />
            </div>

            <PageContainer maxWidth="sm" className="relative z-10">
                <Section spacing="md">
                    <div className="w-full flex flex-col items-center">
                        <div className="mb-10 flex flex-col items-center text-center">
                            <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 tracking-tighter italic leading-none">
                                EgalDeutsch <span className="text-primary">Konto</span>
                            </h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">Start your German language mastery today</p>
                        </div>

                        {/* Signup Card */}
                        <div className="w-full glass-card-premium p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/50 shadow-premium">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="name" className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Dein Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="h-14 rounded-2xl bg-white/50 border-slate-100 focus:ring-primary/20 transition-all px-4 text-base shadow-sm"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">E-Mail Adresse</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="beispiel@mail.de"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="h-14 rounded-2xl bg-white/50 border-slate-100 focus:ring-primary/20 transition-all px-4 text-base shadow-sm"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="password" title="Passwort" className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Passwort</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="h-14 rounded-2xl bg-white/50 border-slate-100 focus:ring-primary/20 transition-all px-4 text-base  shadow-sm"
                                    />
                                </div>

                                {/* Language Selection */}
                                <div className="space-y-3 pt-2">
                                    <Label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest flex items-center gap-2">
                                        <Languages className="w-4 h-4 text-slate-300" /> Bevorzugte Sprache
                                    </Label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                type="button"
                                                onClick={() => setLanguage(lang.code)}
                                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all group relative overflow-hidden ${language === lang.code
                                                    ? "border-primary bg-primary/5 shadow-inner"
                                                    : "border-slate-50 bg-white/50 hover:border-slate-200"
                                                    }`}
                                            >
                                                <span className="text-xl mb-1 group-hover:scale-110 transition-transform z-10">{lang.flag}</span>
                                                <span className={`text-[9px] font-black uppercase tracking-tighter z-10 ${language === lang.code ? "text-primary" : "text-slate-500"
                                                    }`}>
                                                    {lang.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400/60 ml-1 italic tracking-tight">Anleitungen & Erklärungen werden in dieser Sprache angezeigt.</p>
                                </div>

                                {error && (
                                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 text-[11px] font-black uppercase text-center tracking-tight animate-in shake-in-1">
                                        {error}
                                    </div>
                                )}

                                <Button type="submit" className="w-full h-16 text-base font-black btn-orange mt-4 shadow-premium active-bounce" disabled={isLoading}>
                                    {isLoading ? "Wird erstellt..." : "Kostenlos registrieren"}
                                </Button>

                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-100"></div>
                                    </div>
                                    <div className="relative flex justify-center text-[10px] font-black uppercase">
                                        <span className="bg-white/80 backdrop-blur-sm px-4 text-slate-300 tracking-[0.2em]">ODER</span>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-14 rounded-2xl border-slate-100 bg-white font-bold flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-200 transition-all text-slate-700 shadow-premium-sm active-bounce"
                                    onClick={handleGoogleLogin}
                                    disabled={isLoading}
                                >
                                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    <span className="tracking-tight">Anmelden mit Google</span>
                                </Button>
                            </form>

                            <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col items-center">
                                <p className="text-slate-400 font-bold mb-4 text-xs">Bereits ein Konto?</p>
                                <Link href="/login">
                                    <Button variant="outline" className="h-12 px-8 rounded-2xl border-slate-100 bg-white/50 font-black text-slate-600 hover:bg-white hover:border-primary/20 transition-all shadow-sm active-bounce text-[10px] uppercase tracking-widest">
                                        Zum Login
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Section>
            </PageContainer>
        </AppShell>
    );
}
