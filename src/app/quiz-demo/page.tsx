"use client";

import { useState, useCallback } from "react";
import { QuizSection } from "@/components/lesson/quiz-section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Demo lesson data
const demoLesson = {
  title: "The Break Room",
  description: "Learn how to start a conversation in the break room.",
  quiz_question: "What is a common way to ask how someone is doing?",
  quiz_options: ["How's it going?", "What is your function?", "Execute order 66"],
};

export default function QuizDemoPage() {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const checkAnswer = useCallback(() => {
    const correct = selectedAnswer === "How's it going?";
    setFeedback(correct ? "Correct!" : "Incorrect, try again.");
  }, [selectedAnswer]);

  // Quiz data derived from lesson
  const scrambleWord = "GOING";
  const scrambleHint = demoLesson.quiz_question;
  const matchingPairs = [
    { id: 1, word: "Correct", match: "How's it going?" },
    { id: 2, word: "Incorrect", match: "What is your function?" },
    { id: 3, word: "Also Incorrect", match: "Execute order 66" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 bg-slate-50">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">{demoLesson.title}</CardTitle>
              <CardDescription>{demoLesson.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is a demo page showcasing the new interactive quiz features. 
                Try switching between the different quiz types below!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Section */}
        <QuizSection
          question={demoLesson.quiz_question}
          options={demoLesson.quiz_options}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={setSelectedAnswer}
          onCheckAnswer={checkAnswer}
          feedback={feedback}
          scrambleWord={scrambleWord}
          scrambleHint={scrambleHint}
          matchingPairs={matchingPairs}
        />
      </div>
    </main>
  );
}
