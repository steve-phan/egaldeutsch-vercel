"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flashcard } from "@/components/lesson/flashcard";
import { VocabularyQuiz } from "@/components/lesson/vocabulary-quiz";
import { LearningStats } from "@/components/lesson/learning-stats";
import { ArrowLeft, BookOpen, Brain, BarChart3 } from "lucide-react";
import type { Vocabulary, UserLearningStats } from "@/types/vocabulary";

// Demo vocabulary data (inspired by Baicizhan's approach)
const demoVocabulary: Vocabulary[] = [
  {
    id: "1",
    word: "Procrastinate",
    meaning: "To delay or postpone action; put off doing something",
    phonetic: "/prəˈkræstɪneɪt/",
    example_sentence: "I tend to procrastinate when faced with difficult tasks.",
    example_translation: "面对困难任务时，我倾向于拖延。",
    difficulty: "intermediate",
  },
  {
    id: "2",
    word: "Eloquent",
    meaning: "Fluent or persuasive in speaking or writing",
    phonetic: "/ˈeləkwənt/",
    example_sentence: "She gave an eloquent speech at the conference.",
    example_translation: "她在会议上发表了一篇雄辩的演讲。",
    difficulty: "intermediate",
  },
  {
    id: "3",
    word: "Resilient",
    meaning: "Able to recover quickly from difficulties; tough",
    phonetic: "/rɪˈzɪliənt/",
    example_sentence: "The team proved to be resilient after the setback.",
    example_translation: "团队在挫折后证明了他们的韧性。",
    difficulty: "intermediate",
  },
  {
    id: "4",
    word: "Ambitious",
    meaning: "Having a strong desire for success or achievement",
    phonetic: "/æmˈbɪʃəs/",
    example_sentence: "He has ambitious plans for the company's future.",
    example_translation: "他对公司的未来有雄心勃勃的计划。",
    difficulty: "beginner",
  },
  {
    id: "5",
    word: "Meticulous",
    meaning: "Showing great attention to detail; very careful and precise",
    phonetic: "/məˈtɪkjələs/",
    example_sentence: "She is meticulous about keeping her workspace organized.",
    example_translation: "她对保持工作空间整洁非常细致。",
    difficulty: "advanced",
  },
];

// Demo learning stats
const demoStats: UserLearningStats = {
  total_words_learned: 127,
  total_words_mastered: 45,
  words_due_for_review: 12,
  daily_goal: {
    target_words: 10,
    words_learned: 6,
    target_reviews: 20,
    words_reviewed: 15,
    date: new Date().toISOString().split("T")[0],
  },
  streak: {
    current_streak: 7,
    longest_streak: 14,
    last_active_date: new Date().toISOString().split("T")[0],
    streak_dates: [],
  },
};

type ViewMode = "stats" | "flashcard" | "quiz";

// Deterministic shuffle based on seed (using word index as seed for consistency)
function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let currentSeed = seed;
  
  // Simple seeded random function
  const seededRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };
  
  // Fisher-Yates shuffle with seeded random
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}

export default function VocabularyDemoPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("stats");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [stats, setStats] = useState<UserLearningStats>(demoStats);

  const currentVocab = demoVocabulary[currentWordIndex];

  // Generate quiz options deterministically based on word index
  const quizOptions = React.useMemo(() => {
    const correctAnswer = currentVocab.meaning;
    const otherMeanings = demoVocabulary
      .filter((v) => v.id !== currentVocab.id)
      .map((v) => v.meaning);
    
    // Use word index as seed for deterministic shuffling
    const shuffledOthers = seededShuffle(otherMeanings, currentWordIndex + 1);
    const distractors = shuffledOthers.slice(0, 3);
    
    return seededShuffle([correctAnswer, ...distractors], currentWordIndex + 100);
  }, [currentVocab, currentWordIndex]);

  const handleKnow = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      daily_goal: {
        ...prev.daily_goal,
        words_reviewed: prev.daily_goal.words_reviewed + 1,
      },
    }));
    setCurrentWordIndex((prev) => (prev + 1) % demoVocabulary.length);
  }, []);

  const handleDontKnow = useCallback(() => {
    setCurrentWordIndex((prev) => (prev + 1) % demoVocabulary.length);
  }, []);

  const handleQuizAnswer = useCallback((correct: boolean) => {
    if (correct) {
      setStats((prev) => ({
        ...prev,
        daily_goal: {
          ...prev.daily_goal,
          words_learned: prev.daily_goal.words_learned + 1,
        },
      }));
    }
  }, []);

  const handleNextWord = useCallback(() => {
    setCurrentWordIndex((prev) => (prev + 1) % demoVocabulary.length);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Vocabulary Learning</h1>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <Button
            variant={viewMode === "stats" ? "default" : "ghost"}
            size="sm"
            className="flex-1 gap-2"
            onClick={() => setViewMode("stats")}
          >
            <BarChart3 className="h-4 w-4" />
            Stats
          </Button>
          <Button
            variant={viewMode === "flashcard" ? "default" : "ghost"}
            size="sm"
            className="flex-1 gap-2"
            onClick={() => setViewMode("flashcard")}
          >
            <BookOpen className="h-4 w-4" />
            Flashcards
          </Button>
          <Button
            variant={viewMode === "quiz" ? "default" : "ghost"}
            size="sm"
            className="flex-1 gap-2"
            onClick={() => setViewMode("quiz")}
          >
            <Brain className="h-4 w-4" />
            Quiz
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 pb-8">
        {viewMode === "stats" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📚 Baicizhan-Inspired Features</CardTitle>
                <CardDescription>
                  Experience vocabulary learning with spaced repetition, daily goals, and streak tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This demo showcases features inspired by Baicizhan (百词斩), a popular vocabulary learning app:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span><strong>Daily Goals</strong> - Set and track daily learning targets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span><strong>Learning Streaks</strong> - Maintain consecutive days of learning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span><strong>Flashcard Mode</strong> - Flip cards to learn word meanings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span><strong>Vocabulary Quiz</strong> - Multiple choice questions to test knowledge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span><strong>Example Sentences</strong> - Words in context for better understanding</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <LearningStats stats={stats} />
          </div>
        )}

        {viewMode === "flashcard" && (
          <div className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              Word {currentWordIndex + 1} of {demoVocabulary.length}
            </div>
            <Flashcard
              word={currentVocab.word}
              meaning={currentVocab.meaning}
              phonetic={currentVocab.phonetic}
              exampleSentence={currentVocab.example_sentence}
              exampleTranslation={currentVocab.example_translation}
              onKnow={handleKnow}
              onDontKnow={handleDontKnow}
            />
          </div>
        )}

        {viewMode === "quiz" && (
          <div className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              Word {currentWordIndex + 1} of {demoVocabulary.length}
            </div>
            <VocabularyQuiz
              vocabulary={currentVocab}
              options={quizOptions}
              quizType="word-to-meaning"
              onAnswer={handleQuizAnswer}
              onNext={handleNextWord}
            />
          </div>
        )}
      </div>
    </main>
  );
}
