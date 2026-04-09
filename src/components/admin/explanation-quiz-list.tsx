import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ExplanationQuiz } from "@/types/explanation-quiz";

interface ExplanationQuizListProps {
  quizzes: ExplanationQuiz[];
  onEdit?: (quiz: ExplanationQuiz) => void;
  onDelete?: (id: string) => void;
  isDeleting?: string | null;
}

export function ExplanationQuizList({
  quizzes,
  onEdit,
  onDelete,
  isDeleting,
}: ExplanationQuizListProps) {
  if (quizzes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-gray-500">
          No quizzes yet. Create one to get started!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => (
        <Card key={quiz.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl">
                  {quiz.title || quiz.question}
                </CardTitle>
                <CardDescription className="text-sm mt-2">
                  {quiz.question}
                  {quiz.context && <> : {quiz.context}</>}
                </CardDescription>
              </div>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {quiz.category}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">
                Options ({quiz.options.length}):
              </h4>
              <div className="space-y-2">
                {quiz.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-2 rounded text-sm border ${
                      opt.isCorrect
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="font-medium">
                      {opt.isCorrect && "✓ "} {opt.text}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {opt.explanation.substring(0, 100)}...
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              {onEdit && (
                <Button
                  onClick={() => onEdit(quiz)}
                  variant="outline"
                  size="sm"
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this quiz?")) {
                      onDelete(quiz.id);
                    }
                  }}
                  variant="destructive"
                  size="sm"
                  disabled={isDeleting === quiz.id}
                >
                  {isDeleting === quiz.id ? "Deleting..." : "Delete"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
