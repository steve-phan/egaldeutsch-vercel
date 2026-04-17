import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CategoryProgress } from "./category-progress";

interface ProgressListProps {
  categoryAverages: Record<string, number>;
}

export function ProgressList({ categoryAverages }: ProgressListProps) {
  const entries = Object.entries(categoryAverages);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Your Progress by Category</CardTitle>
        <CardDescription>Average score across all quiz sessions</CardDescription>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 mb-4">
              You haven&apos;t completed any quizzes yet.
            </p>
            <Link href="/">
              <Button>Start a Quiz</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map(([cat, avg]) => (
              <CategoryProgress key={cat} category={cat} avgScore={avg} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
