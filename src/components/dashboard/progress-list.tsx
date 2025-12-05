import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ProgressItem } from "./progress-item";
import type { LessonProgress } from "@/hooks/use-dashboard";

interface ProgressListProps {
  progress: LessonProgress[];
}

export function ProgressList({ progress }: ProgressListProps) {
  return (
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
              <ProgressItem key={p.id} progress={p} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
