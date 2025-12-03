"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Play, Pause } from "lucide-react";

interface LessonDetail {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  transcript: string;
  quiz_question: string;
  quiz_options: string[];
}

export default function LessonPage() {
  const params = useParams();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/lesson?id=${params.id}`)
        .then((res) => res.json())
        .then((data) => {
            setLesson(data);
            if (data.audio_url) {
                const newAudio = new Audio(data.audio_url);
                newAudio.onended = () => setIsPlaying(false);
                setAudio(newAudio);
            }
        })
        .catch((err) => console.error("Failed to fetch lesson:", err));
    }
    return () => {
        if (audio) {
            audio.pause();
        }
    }
  }, [params.id]);

  const togglePlay = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

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

  if (!lesson) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-slate-50">
      <div className="w-full max-w-3xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-slate-900">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Lessons
          </Button>
        </Link>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{lesson.title}</CardTitle>
            <CardDescription className="text-lg">{lesson.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center p-6 bg-slate-100 rounded-lg">
                <Button 
                    size="lg" 
                    className="rounded-full w-16 h-16 p-0" 
                    onClick={togglePlay}
                    disabled={!audio}
                >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                </Button>
            </div>
            
            <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-2">Transcript</h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{lesson.transcript}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quiz</CardTitle>
            <CardDescription>{lesson.quiz_question}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
              {lesson.quiz_options && lesson.quiz_options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <Button onClick={checkAnswer} disabled={!selectedAnswer} className="w-full sm:w-auto">
              Check Answer
            </Button>
            {feedback && (
              <div className={`p-3 rounded-md w-full ${feedback.includes("Correct") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {feedback}
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
