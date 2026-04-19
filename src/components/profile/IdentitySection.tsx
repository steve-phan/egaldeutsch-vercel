"use client";

import { User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface IdentitySectionProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  saving: boolean;
  error: string;
  success: string;
}

export function IdentitySection({
  name, setName, email, setEmail, handleSubmit, saving, error, success
}: IdentitySectionProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight italic">Personal Information</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Update your public identity</p>
        </div>
      </div>

      <div className="space-y-6">
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

      {error && <p className="text-xs font-bold text-rose-500 text-center uppercase tracking-tight">{error}</p>}
      {success && <p className="text-xs font-bold text-emerald-600 text-center uppercase tracking-tight">{success}</p>}

      <Button type="submit" className="w-full h-16 rounded-2xl text-base font-black btn-orange shadow-premium active-bounce" disabled={saving}>
        {saving ? "Wird gespeichert..." : "Profil speichern"}
      </Button>
    </form>
  );
}
