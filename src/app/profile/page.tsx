"use client";

import { useProfile } from "@/hooks/use-profile";
import { useDashboard } from "@/hooks/use-dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOut } from "next-auth/react";
import { AppShell } from "@/components/layout/app-shell";
import { User, Shield, LogOut, Loader2, Award, Zap, TrendingUp, Target, Languages } from "lucide-react";
import { Section } from "@/components/shared/layout/section";
import { VisualPageHeader } from "@/components/shared/visual-page-header";
import { Card } from "@/components/shared/layout/card";

export default function ProfilePage() {
  const {
    name, setName, email, setEmail, language, setLanguage,
    loading: profileLoading, saving, error, success, handleSubmit
  } = useProfile();

  const { stats, loading: statsLoading } = useDashboard();

  const loading = profileLoading || statsLoading;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  ];

  // Calculate a visual progress percentage based on accuracy
  const accuracyProgress = stats?.accuracy || 0;

  return (
    <AppShell showNav={true} maxWidth="lg">
      <Section spacing="sm">
        <VisualPageHeader
          title="Mein Profil"
          subtitle="Manage your Mastery Account & Progress"
          icon={<User className="w-6 h-6" />}
        />
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20 px-4 md:px-0">
        {/* Left Column: Identity & Master Score */}
        <div className="lg:col-span-4 space-y-8 animate-in slide-in-from-left-4 duration-700">
          {/* Mastery Card */}
          <Card hover glass padding="lg" className="text-center bg-gradient-to-br from-white to-slate-50 border-white/60 shadow-premium">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary shadow-inner">
              <Award className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter italic mb-1">Mastery Score</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Learning Level</p>

            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-[10px] font-black inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                    Level A2
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black inline-block text-primary">
                    {Math.round(accuracyProgress)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-100">
                <div style={{ width: `${accuracyProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-1000"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 mt-4">
              <div className="text-center">
                <p className="text-lg font-black text-slate-800 leading-none">{stats?.total_sessions || 0}</p>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Sessions</p>
              </div>
              <div className="text-center border-l border-slate-100">
                <p className="text-lg font-black text-slate-800 leading-none">{stats?.total_questions || 0}</p>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Learned</p>
              </div>
            </div>
          </Card>

          {/* Quick Stats Mini Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card padding="md" className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-800 leading-none">{Math.round(stats?.accuracy || 0)}%</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Accuracy</p>
              </div>
            </Card>
            <Card padding="md" className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-800 leading-none">{stats?.total_correct || 0}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Correct</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column: Settings Form */}
        <div className="lg:col-span-8 space-y-8 animate-in slide-in-from-bottom-4 duration-700 delay-150">
          <Card padding="lg" glass>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight italic">Personal Information</h3>
                  <p className="text-xs font-bold text-slate-400 tracking-tight">Update your public identity</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest flex items-center gap-2">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-14 rounded-2xl border-slate-100 bg-white/50 shadow-sm focus:ring-primary/20 transition-all px-6 font-bold text-slate-800"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest flex items-center gap-2">
                      E-Mail Address
                    </Label>
                    <Input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 shadow-sm transition-all px-6 font-bold text-slate-400 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest flex items-center gap-2 mb-3">
                    <Languages className="w-4 h-4" /> Preferred Language
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setLanguage(lang.code)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all group ${language === lang.code
                          ? "border-primary bg-primary/5 shadow-inner"
                          : "border-slate-100 bg-white hover:border-slate-200"
                          }`}
                      >
                        <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{lang.flag}</span>
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${language === lang.code ? "text-primary" : "text-slate-500"
                          }`}>
                          {lang.name}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] font-bold text-slate-400/60 ml-1 italic">This sets the language for explanations and guidance.</p>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-red-50 text-red-500 text-xs font-bold border border-red-100 flex items-center gap-3">
                  <Shield className="w-4 h-4" /> {error}
                </div>
              )}

              {success && (
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 flex items-center gap-3">
                  <Target className="w-4 h-4" /> {success}
                </div>
              )}

              <Button type="submit" className="h-14 px-8 rounded-2xl text-sm font-black btn-orange shadow-premium min-w-[200px]" disabled={saving}>
                {saving ? "Wird gespeichert..." : "Profil speichern"}
              </Button>
            </form>
          </Card>

          {/* Account Management Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
            <Card padding="md" glass hover className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-slate-800 text-sm">Security</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Update Password</p>
                </div>
              </div>
              <Button variant="ghost" type="button" className="text-[10px] font-black text-primary hover:bg-primary/5 uppercase tracking-widest">Ändern</Button>
            </Card>

            <Card padding="md" glass hover className="flex items-center justify-between group border-red-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 group-hover:text-red-600 transition-colors">
                  <LogOut className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-slate-800 text-sm">Session</p>
                  <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Sign Out</p>
                </div>
              </div>
              <Button
                onClick={() => signOut({ callbackUrl: "/login" })}
                variant="ghost"
                type="button"
                className="text-[10px] font-black text-red-500 hover:bg-red-50 uppercase tracking-widest"
              >
                Abmelden
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
