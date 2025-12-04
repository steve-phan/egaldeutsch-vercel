"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  description: string;
  created_at?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export default function AdminDashboardPage() {
  const { isAuthenticated } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchAdminData = async () => {
      try {
        // Check if user is admin by fetching users list
        const usersRes = await fetch("/api/auth/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
          setIsAdmin(true);
        } else if (usersRes.status === 403) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Fetch lessons
        const lessonsRes = await fetch("/api/lessons");
        if (lessonsRes.ok) {
          const lessonsData = await lessonsRes.json();
          setLessons(lessonsData);
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [isAuthenticated]);

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/lesson-management?id=${lessonId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setLessons(lessons.filter((l) => l.id !== lessonId));
      }
    } catch (error) {
      console.error("Failed to delete lesson:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/auth/admin/users?id=${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId));
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-slate-600 mb-4">Please log in to access admin dashboard.</p>
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
        <p>Loading admin dashboard...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-600 mb-4">
              Access denied. Admin privileges required.
            </p>
            <Link href="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mb-8">Manage lessons and users</p>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Lessons</CardDescription>
              <CardTitle className="text-3xl">{lessons.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-3xl">{users.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Lessons Management */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Lessons</CardTitle>
              <CardDescription>Manage your lesson content</CardDescription>
            </div>
            <Link href="/admin/lessons/new">
              <Button>Add New Lesson</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {lessons.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No lessons yet.</p>
            ) : (
              <div className="space-y-4">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{lesson.title}</h3>
                      <p className="text-sm text-slate-500">{lesson.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/lessons/${lesson.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDeleteLesson(lesson.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users Management */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No users yet.</p>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.role === "admin"}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
