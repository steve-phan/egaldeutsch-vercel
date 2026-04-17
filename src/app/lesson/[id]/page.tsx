"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useLesson } from "@/hooks/use-lesson";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { AudioPlayer } from "@/components/lesson/audio-player";
import { VideoPlayer } from "@/components/lesson/video-player";
import { TranscriptViewer } from "@/components/lesson/transcript-viewer";
import { QuizSection } from "@/components/lesson/quiz-section";
import { Comments } from "@/components/lesson/comments";
import { Card, CardContent } from "@/components/ui/card";

export default function LessonPage() {
  const params = useParams();
  const lessonId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { lesson, loading, error } = useLesson(lessonId);
  const { isPlaying, togglePlay, hasAudio } = useAudioPlayer(lesson?.audio_url);

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleCheckAnswer = useCallback(async () => {
    if (!lesson || !selectedAnswer) return;

    setFeedback("Answer submitted! Keep practicing.");

    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch("/api/dashboard/progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            lesson_id: lesson.id,
            completed: true,
            quiz_passed: false,
          }),
        });
      } catch {
        // Progress update failure is non-critical
      }
    }
  }, [lesson, selectedAnswer]);

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
            
            {lesson.video_url && (
              <VideoPlayer videoUrl={lesson.video_url} />
            )}
            
            <TranscriptViewer transcript={lesson.transcript} />
          </CardContent>
        </Card>

        <QuizSection
          question={lesson.quiz_question}
          options={lesson.quiz_options}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={setSelectedAnswer}
          onCheckAnswer={handleCheckAnswer}
          feedback={feedback}
          scrambleWord={lesson.scramble_word}
          scrambleHint={lesson.quiz_question}
          matchingPairs={lesson.matching_pairs}
        />

        {/* Comments Section */}
        <div className="mt-8">
          <Comments lessonId={lesson.id} />
        </div>
      </div>
    </main>
  );
}
