import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Lesson } from "@/hooks/use-lessons";

interface LessonCardProps {
  lesson: Lesson;
}

export function LessonCard({ lesson }: LessonCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
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
  );
}

interface LessonGridProps {
  lessons: Lesson[];
  loading: boolean;
}

export function LessonGrid({ lessons, loading }: LessonGridProps) {
  if (loading) {
    return (
      <p className="text-slate-500 col-span-full text-center">
        Loading lessons...
      </p>
    );
  }

  if (lessons.length === 0) {
    return (
      <p className="text-slate-500 col-span-full text-center">
        No lessons available.
      </p>
    );
  }

  return (
    <>
      {lessons.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </>
  );
}
