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
  const { stats, progress, loading } = useDashboard();

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-slate-600 mb-4">Please log in to view your dashboard.</p>
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">
          Welcome back, {user?.name || "Learner"}!
        </h1>
        <p className="text-slate-600 mb-8">Track your learning progress</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Lessons"
            value={stats?.total_lessons || 0}
          />
          <StatCard
            title="Completed Lessons"
            value={stats?.completed_lessons || 0}
            valueClassName="text-green-600"
          />
          <StatCard
            title="Quizzes Passed"
            value={stats?.quizzes_passed || 0}
            valueClassName="text-blue-600"
          />
          <StatCard
            title="Completion Rate"
            value={`${stats?.completion_rate?.toFixed(0) || 0}%`}
            valueClassName="text-purple-600"
          />
        </div>

        {/* Progress Overview */}
        <ProgressList progress={progress} />

        {/* Quick Actions */}
        <div className="flex gap-4">
          <Link href="/">
            <Button>Browse All Lessons</Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline">Edit Profile</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
