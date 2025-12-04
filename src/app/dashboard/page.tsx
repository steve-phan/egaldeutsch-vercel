"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DashboardStats {
  total_lessons: number;
  completed_lessons: number;
  quizzes_passed: number;
  total_attempts: number;
  completion_rate: number;
}

interface LessonProgress {
  id: string;
  lesson_id: string;
  lesson_title?: string;
  completed: boolean;
  quiz_passed: boolean;
  attempts: number;
  completed_at?: string;
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const statsRes = await fetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch progress
        const progressRes = await fetch("/api/progress", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setProgress(progressData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

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
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Lessons</CardDescription>
              <CardTitle className="text-3xl">{stats?.total_lessons || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed Lessons</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {stats?.completed_lessons || 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Quizzes Passed</CardDescription>
              <CardTitle className="text-3xl text-blue-600">
                {stats?.quizzes_passed || 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completion Rate</CardDescription>
              <CardTitle className="text-3xl text-purple-600">
                {stats?.completion_rate?.toFixed(0) || 0}%
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Detailed view of your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            {progress.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 mb-4">
                  You haven&apos;t started any lessons yet.
                </p>
                <Link href="/">
                  <Button>Browse Lessons</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {progress.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{p.lesson_title || `Lesson ${p.lesson_id}`}</h3>
                      <p className="text-sm text-slate-500">
                        {p.attempts} attempt{p.attempts !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          p.completed
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {p.completed ? "Completed" : "In Progress"}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          p.quiz_passed
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        Quiz: {p.quiz_passed ? "Passed" : "Not Passed"}
                      </span>
                      <Link href={`/lesson/${p.lesson_id}`}>
                        <Button variant="outline" size="sm">
                          Continue
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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
