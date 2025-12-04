"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function NewLessonPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptions, setQuizOptions] = useState(["", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateQuizOption = (index: number, value: string) => {
    const newOptions = [...quizOptions];
    newOptions[index] = value;
    setQuizOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/lesson-management", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          audio_url: audioUrl,
          transcript,
          quiz_question: quizQuestion,
          quiz_options: quizOptions.filter((o) => o.trim() !== ""),
          correct_answer: correctAnswer,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create lesson");
      }

      router.push("/admin");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-slate-600 mb-4">Please log in to create lessons.</p>
            <Link href="/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-slate-900">Create New Lesson</h1>

        <Card>
          <CardHeader>
            <CardTitle>Lesson Details</CardTitle>
            <CardDescription>Fill in the lesson information</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., The Break Room"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Learn how to start a conversation"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audioUrl">Audio URL</Label>
                <Input
                  id="audioUrl"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  placeholder="https://example.com/audio.mp3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transcript">Transcript</Label>
                <textarea
                  id="transcript"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Enter the lesson transcript..."
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Quiz Configuration</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="quizQuestion">Quiz Question</Label>
                    <Input
                      id="quizQuestion"
                      value={quizQuestion}
                      onChange={(e) => setQuizQuestion(e.target.value)}
                      placeholder="e.g., What is a common way to greet someone?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quiz Options</Label>
                    {quizOptions.map((option, index) => (
                      <Input
                        key={index}
                        value={option}
                        onChange={(e) => updateQuizOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="mb-2"
                      />
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setQuizOptions([...quizOptions, ""])}
                    >
                      Add Option
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="correctAnswer">Correct Answer</Label>
                    <Input
                      id="correctAnswer"
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      placeholder="Enter the correct answer"
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? "Creating..." : "Create Lesson"}
              </Button>
              <Link href="/admin">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
