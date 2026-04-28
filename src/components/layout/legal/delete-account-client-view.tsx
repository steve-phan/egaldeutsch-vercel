"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Section } from "@/components/shared/layout/section";
import { Card } from "@/components/shared/layout/card";
import { VisualPageHeader } from "@/components/shared/visual-page-header";
import { Trash2, AlertTriangle, Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeleteAccountClientView() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("/api/account/delete-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const error = await response.text();
        console.error("Deletion request failed:", error);
        alert("Failed to send request. Please try again.");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("A network error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell showNav={false} maxWidth="lg">
      <div className="w-full">
        <Section spacing="sm">
          <VisualPageHeader
            title="Account Deletion"
            subtitle="Request to delete your EgalDeutsch account and data"
            icon={<Trash2 className="w-6 h-6 text-red-500" />}
          />
        </Section>

        <Section spacing="md">
          <div className="max-w-xl mx-auto space-y-8">
            {!submitted ? (
              <>
                <Card padding="lg" radius="3xl" className="border-red-100 bg-red-50/30">
                  <div className="flex gap-4">
                    <div className="bg-red-100 p-3 rounded-2xl h-fit">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-black text-slate-800 italic">Important Information</h3>
                      <p className="text-sm text-slate-600 font-bold leading-relaxed">
                        Deleting your account is permanent. All your progress, quiz scores, saved vocabulary, and personal profile information will be removed from our servers within 30 days.
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-black text-slate-800 italic">Verify Your Identity</h2>
                    <p className="text-sm text-slate-500 font-bold leading-relaxed">
                      To prevent unauthorized deletions, we will send a **secure confirmation link** to your inbox. You must click this link to finalize the request.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your-email@example.com"
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-800 placeholder:text-slate-300 focus:border-primary focus:ring-0 transition-all outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !email}
                      className={cn(
                        "w-full py-4 rounded-2xl font-black text-white italic transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20",
                        loading || !email 
                          ? "bg-slate-300 cursor-not-allowed shadow-none" 
                          : "bg-primary hover:bg-orange-600 active:scale-[0.98]"
                      )}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Send Verification Link
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>

                  <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-widest">
                    Processing time: up to 30 days
                  </p>
                </div>
              </>
            ) : (
              <Card padding="xl" radius="3xl" className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center">
                  <div className="bg-primary/10 p-5 rounded-full">
                    <CheckCircle2 className="w-12 h-12 text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-800 italic">Check Your Email</h2>
                  <p className="text-slate-600 font-bold">
                    We have sent a verification link to <span className="text-primary">{email}</span>.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl text-sm text-slate-500 font-bold leading-relaxed">
                  Please click the link in your email to confirm the account deletion. If you don't see it, check your spam folder.
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-primary font-black text-sm hover:underline italic"
                >
                  Didn't get the email? Try again
                </button>
              </Card>
            )}

            <div className="pt-8 border-t border-slate-100 space-y-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">What data is deleted?</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Account Profile (Name, Email)",
                  "Learning Progress & History",
                  "Quiz Scores & Achievements",
                  "Saved Vocabulary & Notes",
                  "Microphone Permission Data",
                  "Device Usage Statistics"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </div>
    </AppShell>
  );
}
