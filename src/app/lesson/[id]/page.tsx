"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useLesson } from "@/hooks/use-lesson";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { AudioPlayer } from "@/components/lesson/audio-player";
import { TranscriptViewer } from "@/components/lesson/transcript-viewer";
import { QuizSection } from "@/components/lesson/quiz-section";
import { Comments } from "@/components/lesson/comments";
import { Card, CardContent } from "@/components/ui/card";

export default function LessonPage() {
  const params = useParams();
  const lessonId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { lesson, loading, error } = useLesson(lessonId);
  const { isPlaying, togglePlay, hasAudio } = useAudioPlayer(lesson?.audio_url);
  
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);

  // Derive word scramble and matching pairs data from the lesson
  const quizData = useMemo(() => {
    if (!lesson) return { scrambleWord: undefined, scrambleHint: undefined, matchingPairs: undefined };

    // Extract a key word from the quiz question for word scramble
    // We'll use the first significant word (longer than 3 characters) from the question
    const questionWords = lesson.quiz_question?.split(/\s+/).filter(w => w.length > 3) || [];
    const scrambleWord = questionWords.length > 0 
      ? questionWords[questionWords.length - 1].replace(/[^a-zA-Z]/g, "")
      : "QUIZ";

    // Generate matching pairs from quiz options with descriptive labels
    const matchingPairs = lesson.quiz_options && lesson.quiz_options.length >= 2
      ? lesson.quiz_options.map((option, index) => ({
          id: index + 1,
          word: `Option ${index + 1}`,
          match: option,
        }))
      : undefined;

    return {
      scrambleWord: scrambleWord.length >= 3 ? scrambleWord : undefined,
      scrambleHint: lesson.quiz_question,
      matchingPairs,
    };
  }, [lesson]);

  const checkAnswer = async () => {
    if (!lesson || !selectedAnswer) return;

    try {
      const res = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson_id: lesson.id,
          answer: selectedAnswer,
        }),
      });
      const data = await res.json();
      setFeedback(data.message);
    } catch (err) {
      console.error("Failed to check answer:", err);
      setFeedback("Error checking answer.");
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (error || !lesson) {
    return <div className="flex min-h-screen items-center justify-center text-red-500">{error || "Lesson not found"}</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-slate-50">
      <div className="w-full max-w-3xl">
        <LessonHeader title={lesson.title} description={lesson.description} />

        <Card className="mb-8">
          <CardContent className="space-y-6 pt-6">
            <AudioPlayer 
              isPlaying={isPlaying} 
              onTogglePlay={togglePlay} 
              disabled={!hasAudio} 
            />
            
            <TranscriptViewer transcript={lesson.transcript} />
          </CardContent>
        </Card>

        <QuizSection
          question={lesson.quiz_question}
          options={lesson.quiz_options}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={setSelectedAnswer}
          onCheckAnswer={checkAnswer}
          feedback={feedback}
          scrambleWord={quizData.scrambleWord}
          scrambleHint={quizData.scrambleHint}
          matchingPairs={quizData.matchingPairs}
        />

        {/* Comments Section */}
        <div className="mt-8">
          <Comments lessonId={lesson.id} />
        </div>
      </div>
    </main>
  );
}
