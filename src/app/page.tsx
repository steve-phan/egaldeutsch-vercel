"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface Lesson {
  id: string;
  title: string;
  description: string;
}

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    // Fetch lessons from API
    fetch("/api/lessons")
      .then((res) => res.json())
      .then((data) => setLessons(data))
      .catch((err) => console.error("Failed to fetch lessons:", err));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-slate-50">
      {/* Navigation */}
      <nav className="w-full max-w-5xl mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">EgalDeutsch</h1>
        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-600">Hello, {user?.name}</span>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" size="sm">Profile</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-slate-900">Learn English Conversations</h2>
        <p className="text-lg text-slate-600 max-w-2xl">
          Improve your English speaking skills with audio lessons and interactive quizzes designed for professionals.
        </p>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
                <CardDescription>{lesson.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/lesson/${lesson.id}`}>
                  <Button className="w-full">Start Lesson</Button>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-slate-500 col-span-full text-center">
            Loading lessons...
          </p>
        )}
      </div>
    </main>
  );
}
