"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Volume2, Check, X, ArrowRight, Lightbulb } from "lucide-react";
import type { Vocabulary } from "@/types/vocabulary";

interface VocabularyQuizProps {
  vocabulary: Vocabulary;
  options: string[];
  quizType: "word-to-meaning" | "meaning-to-word";
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
}

export function VocabularyQuiz({
  vocabulary,
  options,
  quizType,
  onAnswer,
  onNext,
}: VocabularyQuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const correctAnswer = quizType === "word-to-meaning" ? vocabulary.meaning : vocabulary.word;
  const prompt = quizType === "word-to-meaning" ? vocabulary.word : vocabulary.meaning;

  const handlePlayAudio = useCallback(() => {
    if (vocabulary.audio_url) {
      const audio = new Audio(vocabulary.audio_url);
      audio.play().catch((err) => console.error("Failed to play audio:", err));
    }
  }, [vocabulary.audio_url]);

  const handleSubmit = useCallback(() => {
    if (!selectedAnswer) return;
    
    const correct = selectedAnswer === correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);
    onAnswer(correct);
  }, [selectedAnswer, correctAnswer, onAnswer]);

  const handleNext = useCallback(() => {
    setSelectedAnswer("");
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
    onNext();
  }, [onNext]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {quizType === "word-to-meaning" ? "What does this word mean?" : "Which word matches?"}
          </span>
          {vocabulary.audio_url && (
            <Button variant="ghost" size="icon" onClick={handlePlayAudio}>
              <Volume2 className="h-5 w-5" />
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          {quizType === "word-to-meaning" 
            ? "Select the correct meaning"
            : "Select the correct word"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question Display */}
        <div className="p-6 bg-primary/5 rounded-xl text-center">
          {vocabulary.image_url && quizType === "meaning-to-word" && (
            <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={vocabulary.image_url}
                alt="Vocabulary hint"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <p className="text-2xl font-bold text-foreground">{prompt}</p>
          {quizType === "word-to-meaning" && vocabulary.phonetic && (
            <p className="text-sm text-muted-foreground mt-1">{vocabulary.phonetic}</p>
          )}
        </div>

        {/* Hint Button */}
        {!isAnswered && vocabulary.example_sentence && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHint(!showHint)}
              className="gap-2 text-muted-foreground"
            >
              <Lightbulb className="h-4 w-4" />
              {showHint ? "Hide Hint" : "Show Hint"}
            </Button>
            {showHint && (
              <p className="mt-2 text-sm text-muted-foreground italic p-3 bg-muted/50 rounded-lg">
                {vocabulary.example_sentence}
              </p>
            )}
          </div>
        )}

        {/* Answer Options */}
        <RadioGroup
          value={selectedAnswer}
          onValueChange={setSelectedAnswer}
          className="space-y-3"
          disabled={isAnswered}
        >
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isOptionCorrect = option === correctAnswer;
            
            // Determine styling based on answer state
            const getOptionStyle = () => {
              if (isAnswered) {
                if (isOptionCorrect) return "border-green-500 bg-green-50 dark:bg-green-900/30";
                if (isSelected && !isCorrect) return "border-red-500 bg-red-50 dark:bg-red-900/30";
              } else if (isSelected) {
                return "border-primary bg-primary/5";
              }
              return "border-slate-200 hover:bg-slate-50";
            };

            // Show incorrect icon only for selected wrong answers
            const shouldShowIncorrectIcon = isAnswered && isSelected && !isCorrect && !isOptionCorrect;

            return (
              <div
                key={index}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors ${getOptionStyle()}`}
              >
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-grow cursor-pointer font-medium"
                >
                  {option}
                </Label>
                {isAnswered && isOptionCorrect && (
                  <Check className="h-5 w-5 text-green-500" />
                )}
                {shouldShowIncorrectIcon && (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </div>
            );
          })}
        </RadioGroup>

        {/* Feedback */}
        {isAnswered && (
          <div
            className={`p-4 rounded-lg text-center font-medium ${
              isCorrect
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
            }`}
          >
            {isCorrect ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="h-5 w-5" />
                Correct! Well done! 🎉
              </span>
            ) : (
              <span>
                Not quite. The correct answer is: <strong>{correctAnswer}</strong>
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        {!isAnswered ? (
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full"
          >
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="w-full gap-2">
            Next Word
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
