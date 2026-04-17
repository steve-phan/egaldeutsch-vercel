"use client";

import { useProfile } from "@/hooks/use-profile";
import { DashboardHeader } from "@/components/dashboard/header";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOut } from "next-auth/react";
import { User, Mail, Shield, LogOut, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { 
    profile, name, setName, email, setEmail, 
    loading, saving, error, success, handleSubmit 
  } = useProfile();

  if (loading) {
     return (
        <div className="flex h-screen items-center justify-center bg-background">
           <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
     );
  }

  return (
    <main className="flex min-h-screen flex-col bg-background pb-32">
       <DashboardHeader />

       <section className="w-full max-w-2xl mx-auto px-6 pt-10">
          <div className="mb-12">
             <h1 className="text-4xl font-black text-slate-800 tracking-tight">Dein Profil</h1>
             <p className="text-slate-500 font-bold">Verwalte deine Kontoeinstellungen.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
             {/* Profile Card */}
             <div className="glass-card p-10 rounded-[3rem] border border-white shadow-xl bg-white/50 space-y-8">
                <div className="space-y-6">
                   <div className="space-y-4">
                      <Label htmlFor="name" className="text-xs font-black text-slate-400 ml-1 uppercase tracking-widest flex items-center gap-2">
                         <User className="w-4 h-4" /> Name
                      </Label>
                      <Input 
                        id="name"
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus:ring-primary/20 transition-all px-6 text-lg font-bold"
                      />
                   </div>

                   <div className="space-y-4">
                      <Label htmlFor="email" className="text-xs font-black text-slate-400 ml-1 uppercase tracking-widest flex items-center gap-2">
                         <Mail className="w-4 h-4" /> E-Mail
                      </Label>
                      <Input 
                        id="email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus:ring-primary/20 transition-all px-6 text-lg font-bold"
                      />
                   </div>
                </div>

                {error && (
                   <div className="p-4 rounded-2xl bg-red-50 text-red-500 text-sm font-bold border border-red-100 animate-in fade-in transition-all">
                      {error}
                   </div>
                )}

                {success && (
                   <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-700 text-sm font-bold border border-indigo-100 animate-in fade-in transition-all">
                      {success}
                   </div>
                )}

                <Button type="submit" className="w-full h-16 rounded-[2rem] text-xl font-black btn-orange" disabled={saving}>
                   {saving ? "Wird gespeichert..." : "Profil speichern"}
                </Button>
             </div>

             {/* Secondary Actions */}
             <div className="space-y-4">
                <div className="flex items-center justify-between p-6 glass-card rounded-[2rem] border border-white/50">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                         <Shield className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="font-black text-slate-800">Passwort ändern</p>
                         <p className="text-xs font-bold text-slate-400">Letzte Änderung vor 3 Monaten</p>
                      </div>
                   </div>
                   <Button variant="ghost" className="font-black text-primary hover:bg-primary/5">Ändern</Button>
                </div>

                <Button 
                   onClick={() => signOut({ callbackUrl: "/login" })}
                   variant="ghost" 
                   className="w-full h-16 rounded-[2rem] border border-red-100 text-red-500 font-black hover:bg-red-50 hover:text-red-600 transition-all flex items-center gap-3"
                >
                   <LogOut className="w-6 h-6" />
                   Abmelden
                </Button>
             </div>
          </form>
       </section>

       <BottomNav />
    </main>
  );
}
