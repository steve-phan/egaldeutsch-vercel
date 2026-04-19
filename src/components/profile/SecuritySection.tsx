"use client";

import { useState } from "react";
import { Shield, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

interface SecuritySectionProps {
  session: Session | null;
}

export function SecuritySection({ session }: SecuritySectionProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    setPasswordSaving(true);
    try {
      const token = session?.user?.accessToken;
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update password");
      }

      setPasswordSuccess("Passwort erfolgreich geändert!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setIsChangingPassword(false), 2000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="mt-12 pt-10 border-t border-slate-50 space-y-4">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight italic">Security & Session</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Manage your access and session</p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        {!isChangingPassword ? (
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => setIsChangingPassword(true)}
            className="w-full h-14 rounded-2xl border-slate-100 bg-white font-bold flex items-center gap-3 text-slate-600 hover:text-slate-800 hover:border-slate-200 transition-all active:scale-95 shadow-sm"
          >
            <Shield className="w-4 h-4" /> Passwort ändern
          </Button>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-6 p-6 rounded-2xl bg-slate-50 border border-slate-100 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</Label>
                <Input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 bg-white focus:ring-primary/20 font-bold"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</Label>
                <Input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 bg-white focus:ring-primary/20 font-bold"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</Label>
                <Input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 bg-white focus:ring-primary/20 font-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {passwordError && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tight text-center">{passwordError}</p>}
            {passwordSuccess && <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight text-center">{passwordSuccess}</p>}

            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="ghost"
                onClick={() => setIsChangingPassword(false)}
                className="flex-1 h-12 rounded-xl font-bold text-slate-500 hover:text-slate-700"
              >
                Abbrechen
              </Button>
              <Button 
                type="submit" 
                disabled={passwordSaving}
                className="flex-2 px-8 h-12 rounded-xl font-black bg-primary hover:bg-primary-dark text-white shadow-premium-sm active-bounce"
              >
                {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ändern"}
              </Button>
            </div>
          </form>
        )}
        
        <Button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black flex items-center gap-3 transition-all active:scale-95 shadow-premium-sm"
        >
          <LogOut className="w-4 h-4" /> Account abmelden
        </Button>
      </div>
    </div>
  );
}
