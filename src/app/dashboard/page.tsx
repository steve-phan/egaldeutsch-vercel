"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { useDashboard } from "@/hooks/use-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProgressList } from "@/components/dashboard/progress-list";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const { stats, loading } = useDashboard();

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-slate-600 mb-4">
              Please log in to view your dashboard.
            </p>
            <Link href="/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p>Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">
          Welcome back, {user?.name || "Learner"}!
        </h1>
        <p className="text-slate-600 mb-8">Track your German quiz progress</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Quiz Sessions"
            value={stats?.total_sessions ?? 0}
          />
          <StatCard
            title="Questions Answered"
            value={stats?.total_questions ?? 0}
            valueClassName="text-blue-600"
          />
          <StatCard
            title="Correct Answers"
            value={stats?.total_correct ?? 0}
            valueClassName="text-green-600"
          />
          <StatCard
            title="Overall Accuracy"
            value={`${(stats?.accuracy ?? 0).toFixed(0)}%`}
            valueClassName="text-purple-600"
          />
        </div>

        {/* Per-category progress */}
        <ProgressList categoryAverages={stats?.category_averages ?? {}} />

        {/* Quick actions */}
        <div className="flex gap-4">
          <Link href="/">
            <Button>Browse Categories</Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline">Edit Profile</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
