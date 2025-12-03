"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface Lesson {
  id: string;
  title: string;
  description: string;
}

export default function Home() {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    // Fetch lessons from API
    fetch("/api/lessons")
      .then((res) => res.json())
      .then((data) => setLessons(data))
      .catch((err) => console.error("Failed to fetch lessons:", err));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-slate-50">
      <h1 className="text-4xl font-bold mb-8 text-slate-900">EgalDeutsch</h1>
      <p className="text-lg text-slate-600 mb-12">
        Learn English conversation starters with audio and interactive quizzes.
      </p>

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
            Loading lessons... (Make sure backend is running and MongoDB is connected)
          </p>
        )}
      </div>
    </main>
  );
}
