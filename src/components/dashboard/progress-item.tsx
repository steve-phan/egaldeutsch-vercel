import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { LessonProgress } from "@/hooks/use-dashboard";

interface ProgressItemProps {
  progress: LessonProgress;
}

export function ProgressItem({ progress }: ProgressItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <h3 className="font-medium">
          {progress.lesson_title || `Lesson ${progress.lesson_id}`}
        </h3>
        <p className="text-sm text-slate-500">
          {progress.attempts} attempt{progress.attempts !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span
          className={`px-2 py-1 text-xs rounded ${
            progress.completed
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {progress.completed ? "Completed" : "In Progress"}
        </span>
        <span
          className={`px-2 py-1 text-xs rounded ${
            progress.quiz_passed
              ? "bg-blue-100 text-blue-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          Quiz: {progress.quiz_passed ? "Passed" : "Not Passed"}
        </span>
        <Link href={`/lesson/${progress.lesson_id}`}>
          <Button variant="outline" size="sm">
            Continue
          </Button>
        </Link>
      </div>
    </div>
  );
}
