"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Section } from "@/components/shared/layout/section";
import { Card } from "@/components/shared/layout/card";
import { VisualPageHeader } from "@/components/shared/visual-page-header";
import { Trash2, Loader2, CheckCircle2, XCircle, Home } from "lucide-react";
import Link from "next/link";

function DeleteConfirmContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found. Please check your email link.");
      return;
    }

    const confirmDeletion = async () => {
      try {
        const response = await fetch("/api/account/delete-confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setStatus("success");
          setMessage("Your account and all associated data have been permanently deleted.");
        } else {
          setStatus("error");
          setMessage("The link is invalid or has expired. Please request a new one.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("A network error occurred. Please try again later.");
      }
    };

    confirmDeletion();
  }, [token]);

  return (
    <div className="max-w-xl mx-auto py-12">
      {status === "loading" && (
        <Card padding="xl" radius="3xl" className="text-center space-y-6">
          <div className="flex justify-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800 italic text-center">Verifying Request...</h2>
            <p className="text-slate-500 font-bold text-center">Please wait while we process your request.</p>
          </div>
        </Card>
      )}

      {status === "success" && (
        <Card padding="xl" radius="3xl" className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center">
            <div className="bg-green-100 p-5 rounded-full text-center">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800 italic text-center">Account Deleted</h2>
            <p className="text-slate-600 font-bold text-center">{message}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl text-sm text-slate-500 font-bold leading-relaxed text-center">
            We're sorry to see you go. If you ever want to return, you can always create a new account.
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-800 text-white px-8 py-3 rounded-2xl font-black italic hover:bg-slate-900 transition-all shadow-lg shadow-slate-200"
          >
            <Home className="w-5 h-5" />
            Return to Home
          </Link>
        </Card>
      )}

      {status === "error" && (
        <Card padding="xl" radius="3xl" className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-center">
            <div className="bg-red-100 p-5 rounded-full text-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-black text-slate-800 italic text-center">Deletion Failed</h2>
            <p className="text-red-500 font-bold text-center">{message}</p>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <Link
              href="/delete-account"
              className="w-full py-4 bg-primary text-white rounded-2xl font-black italic hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
            >
              Request New Link
            </Link>
            <Link href="/" className="text-slate-400 font-black text-sm hover:underline italic">
              Back to Home
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

export function DeleteConfirmClientView() {
  return (
    <AppShell showNav={false} maxWidth="lg">
      <div className="w-full">
        <Section spacing="sm">
          <VisualPageHeader
            title="Final Confirmation"
            subtitle="Securely finalizing your account deletion"
            icon={<Trash2 className="w-6 h-6 text-red-500" />}
          />
        </Section>

        <Section spacing="sm">
          <Suspense fallback={
             <Card padding="xl" radius="3xl" className="text-center space-y-6 max-w-xl mx-auto py-12">
               <div className="flex justify-center">
                 <Loader2 className="w-12 h-12 text-primary animate-spin" />
               </div>
               <div className="space-y-2">
                 <h2 className="text-2xl font-black text-slate-800 italic">Loading...</h2>
               </div>
             </Card>
          }>
            <DeleteConfirmContent />
          </Suspense>
        </Section>
      </div>
    </AppShell>
  );
}
