import { useState, useCallback } from "react";
import { Quiz } from "./quiz";
import { WordScramble } from "./word-scramble";
import { MatchingPairs } from "./matching-pairs";
import { Button } from "@/components/ui/button";
import { CheckCircle, Puzzle, Shuffle, ListChecks } from "lucide-react";

type QuizType = "multiple-choice" | "word-scramble" | "matching-pairs";

interface QuizSectionProps {
  // Multiple choice quiz props
  question: string;
  options: string[];
  selectedAnswer: string;
  onSelectAnswer: (answer: string) => void;
  onCheckAnswer: () => void;
  feedback: string | null;
  // Word scramble props
  scrambleWord?: string;
  scrambleHint?: string;
  // Matching pairs props
  matchingPairs?: Array<{ id: number; word: string; match: string }>;
}

export function QuizSection({
  question,
  options,
  selectedAnswer,
  onSelectAnswer,
  onCheckAnswer,
  feedback,
  scrambleWord,
  scrambleHint,
  matchingPairs,
}: QuizSectionProps) {
  const [activeQuiz, setActiveQuiz] = useState<QuizType>("multiple-choice");
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<QuizType>>(new Set());

  const handleWordScrambleComplete = useCallback((success: boolean) => {
    if (success) {
      setCompletedQuizzes(prev => new Set([...prev, "word-scramble"]));
    }
  }, []);

  const handleMatchingComplete = useCallback((success: boolean) => {
    if (success) {
      setCompletedQuizzes(prev => new Set([...prev, "matching-pairs"]));
    }
  }, []);

  const quizTypes: { type: QuizType; label: string; icon: React.ReactNode; available: boolean }[] = [
    {
      type: "multiple-choice",
      label: "Quiz",
      icon: <ListChecks className="h-4 w-4" />,
      available: true,
    },
    {
      type: "word-scramble",
      label: "Scramble",
      icon: <Puzzle className="h-4 w-4" />,
      available: !!scrambleWord,
    },
    {
      type: "matching-pairs",
      label: "Match",
      icon: <Shuffle className="h-4 w-4" />,
      available: !!matchingPairs && matchingPairs.length > 0,
    },
  ];

  const availableQuizTypes = quizTypes.filter(q => q.available);

  return (
    <div className="space-y-4">
      {/* Quiz Type Selector */}
      {availableQuizTypes.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center p-4 bg-muted/50 rounded-lg">
          {availableQuizTypes.map(({ type, label, icon }) => (
            <Button
              key={type}
              variant={activeQuiz === type ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveQuiz(type)}
              className="relative"
            >
              {icon}
              <span className="ml-1.5">{label}</span>
              {completedQuizzes.has(type) && (
                <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-500 bg-white rounded-full" />
              )}
            </Button>
          ))}
        </div>
      )}

      {/* Active Quiz */}
      {activeQuiz === "multiple-choice" && (
        <Quiz
          question={question}
          options={options}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={onSelectAnswer}
          onCheckAnswer={onCheckAnswer}
          feedback={feedback}
        />
      )}

      {activeQuiz === "word-scramble" && scrambleWord && scrambleHint && (
        <WordScramble
          word={scrambleWord}
          hint={scrambleHint}
          onComplete={handleWordScrambleComplete}
        />
      )}

      {activeQuiz === "matching-pairs" && matchingPairs && matchingPairs.length > 0 && (
        <MatchingPairs
          pairs={matchingPairs}
          onComplete={handleMatchingComplete}
        />
      )}

      {/* Progress Indicator */}
      {availableQuizTypes.length > 1 && (
        <div className="text-center text-sm text-muted-foreground">
          <span>
            Quiz Progress: {completedQuizzes.size}/{availableQuizTypes.length} completed
          </span>
          {completedQuizzes.size === availableQuizTypes.length && (
            <span className="block mt-1 text-green-600 font-medium">
              🎉 Amazing! You&apos;ve completed all quizzes!
            </span>
          )}
        </div>
      )}
    </div>
  );
}
