"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useDashboard } from "@/hooks/use-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProgressList } from "@/components/dashboard/progress-list";
import { AppShell } from "@/components/layout/app-shell";
import { Section } from "@/components/shared/layout/section";
import { Loader2, LayoutDashboard } from "lucide-react";
import { VisualPageHeader } from "@/components/shared/visual-page-header";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { stats, loading } = useDashboard();

  if (status === "unauthenticated") {
    return (
      <main className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-md rounded-[2rem] border-slate-100 shadow-premium">
          <CardContent className="pt-8 p-8">
            <div className="text-center mb-6">
               <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <LayoutDashboard className="w-8 h-8" />
               </div>
               <p className="text-slate-600 font-bold">
                 Please log in to view your dashboard.
               </p>
            </div>
            <Link href="/login">
              <Button className="w-full h-12 rounded-xl btn-orange">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
         <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading your progress...</p>
         </div>
      </div>
    );
  }

  return (
    <AppShell showNav={true} maxWidth="lg">
      <div className="w-full">
         <Section spacing="sm">
            <VisualPageHeader
               title={`Willkommen, ${session?.user?.name?.split(' ')[0] || "Learner"}!`}
               subtitle="Track your path to German fluency"
               icon={<LayoutDashboard className="w-6 h-6" />}
            />
         </Section>

         <Section spacing="md">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
               <StatCard
                  title="Sessions"
                  value={stats?.total_sessions ?? 0}
               />
               <StatCard
                  title="Questions"
                  value={stats?.total_questions ?? 0}
               />
               <StatCard
                  title="Correct"
                  value={stats?.total_correct ?? 0}
                  className="text-emerald-600"
               />
               <StatCard
                  title="Accuracy"
                  value={`${(stats?.accuracy ?? 0).toFixed(0)}%`}
                  className="text-primary"
               />
            </div>

            {/* Per-category progress */}
            <div className="mb-12">
               <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-black text-slate-800 tracking-tighter italic">Topic Mastery</h2>
                  <div className="h-0.5 flex-1 bg-slate-100/50 rounded-full" />
               </div>
               <ProgressList categoryAverages={stats?.category_averages ?? {}} />
            </div>

            {/* Quick actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100/50">
               <Link href="/" className="flex-1">
                  <Button className="w-full h-12 rounded-xl btn-orange">Browse Categories</Button>
               </Link>
               <Link href="/profile" className="flex-1">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 shadow-sm transition-all">Edit Profile</Button>
               </Link>
            </div>
         </Section>
      </div>
    </AppShell>
  );
}
