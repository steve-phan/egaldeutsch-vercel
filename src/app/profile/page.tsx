"use client";

import { useProfile } from "@/hooks/use-profile";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOut } from "next-auth/react";
import { AppShell } from "@/components/layout/app-shell";
import { User, Mail, Shield, LogOut, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { 
    profile, name, setName, email, setEmail, 
    loading, saving, error, success, handleSubmit 
  } = useProfile();

  if (loading) {
     return (
        <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
           <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
     );
  }

  return (
    <AppShell showNav={true} maxWidth="md">
        <DashboardHeader />

        <section className="w-full pt-10">
           <div className="mb-10">
              <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic">Dein Profil</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Manage your Mastery Account</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Card */}
              <div className="glass-card-premium p-8 md:p-10 rounded-[2.5rem] space-y-8">
                 <div className="space-y-6">
                    <div className="space-y-3">
                       <Label htmlFor="name" className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest flex items-center gap-2">
                          <User className="w-4 h-4" /> Name
                       </Label>
                       <Input 
                         id="name"
                         value={name} 
                         onChange={(e) => setName(e.target.value)} 
                         className="h-12 rounded-2xl border-slate-100 bg-white shadow-sm focus:ring-primary/20 transition-all px-6 font-bold"
                       />
                    </div>

                    <div className="space-y-3">
                       <Label htmlFor="email" className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest flex items-center gap-2">
                          <Mail className="w-4 h-4" /> E-Mail
                       </Label>
                       <Input 
                         id="email"
                         value={email} 
                         onChange={(e) => setEmail(e.target.value)} 
                         className="h-12 rounded-2xl border-slate-100 bg-white shadow-sm focus:ring-primary/20 transition-all px-6 font-bold opacity-70"
                         readOnly
                       />
                    </div>
                 </div>

                 {error && (
                    <div className="p-4 rounded-2xl bg-red-50 text-red-500 text-xs font-bold border border-red-100 animate-in fade-in transition-all">
                       {error}
                    </div>
                 )}

                 {success && (
                    <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 animate-in fade-in transition-all">
                       {success}
                    </div>
                 )}

                 <Button type="submit" className="w-full h-12 rounded-2xl text-sm font-black btn-orange" disabled={saving}>
                    {saving ? "Wird gespeichert..." : "Profil speichern"}
                 </Button>
              </div>

              {/* Secondary Actions */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-6 glass-card-premium rounded-[2rem]">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                          <Shield className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="font-black text-slate-800 text-sm">Passwort ändern</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Security Settings</p>
                       </div>
                    </div>
                    <Button variant="ghost" className="text-[10px] font-black text-primary hover:bg-primary/5 uppercase tracking-widest">Ändern</Button>
                 </div>

                 <Button 
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    variant="ghost" 
                    className="w-full h-12 rounded-2xl border border-red-100 text-red-500 text-xs font-black hover:bg-red-50 hover:text-red-600 transition-all flex items-center gap-2 justify-center"
                 >
                    <LogOut className="w-4 h-4" />
                    Abmelden
                 </Button>
              </div>
           </form>
        </section>
    </AppShell>
  );
}
