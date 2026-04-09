"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { ExplanationQuiz, QuizOption } from "@/types/explanation-quiz";

interface ExplanationQuizPlayerProps {
  quiz: ExplanationQuiz;
  onComplete?: (selectedOptionId: string, isCorrect: boolean) => void;
}

export function ExplanationQuizPlayer({
  quiz,
  onComplete,
}: ExplanationQuizPlayerProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [showAllExplanations, setShowAllExplanations] = useState(false);

  const selectedOption = quiz.options.find(
    (opt) => opt.id === selectedOptionId,
  );
  const correctOption = quiz.options.find((opt) => opt.isCorrect);

  const handleCheckAnswer = () => {
    if (selectedOptionId) {
      setShowExplanation(true);
      if (onComplete && selectedOption) {
        onComplete(selectedOptionId, selectedOption.isCorrect);
      }
    }
  };

  const handleReset = () => {
    setSelectedOptionId("");
    setShowExplanation(false);
    setShowAllExplanations(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          {quiz.title && <CardTitle>{quiz.title}</CardTitle>}
          <CardDescription className="text-base mt-4">
            <span className="text-lg font-medium text-gray-900">
              {quiz.question}
            </span>
            {quiz.context && (
              <span className="block text-sm text-gray-600 mt-2">
                {quiz.context}
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Phase 1: Answer Selection */}
          <div className="space-y-3">
            <RadioGroup
              value={selectedOptionId}
              onValueChange={setSelectedOptionId}
            >
              {quiz.options.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedOptionId === option.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={`option-${option.id}`}
                  />
                  <Label
                    htmlFor={`option-${option.id}`}
                    className="flex-grow cursor-pointer font-medium"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Phase 2: Show/Hide Explanation */}
          {showExplanation && selectedOption && (
            <div className="space-y-4 animate-in fade-in">
              <div
                className={`p-4 rounded-lg border-l-4 ${
                  selectedOption.isCorrect
                    ? "bg-green-50 border-green-500"
                    : "bg-red-50 border-red-500"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">
                    {selectedOption.isCorrect ? "✓" : "✗"}
                  </span>
                  <span className="font-bold text-lg">
                    {selectedOption.isCorrect ? "Correct!" : "Not quite..."}
                  </span>
                </div>
                {correctOption && !selectedOption.isCorrect && (
                  <p className="text-sm mb-3">
                    The correct answer is{" "}
                    <span className="font-bold">{correctOption.text}</span>
                  </p>
                )}
              </div>

              {/* Selected Answer Explanation */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-bold text-sm mb-2">
                  Erklärung: {selectedOption.text}
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedOption.explanation}
                </p>
              </div>

              {/* Common Mistake Info */}
              {selectedOption.commonMistake && !selectedOption.isCorrect && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-bold text-sm mb-2 text-yellow-900">
                    Warum diese Antwort falsch ist:
                  </h4>
                  <p className="text-sm text-yellow-800 leading-relaxed">
                    {selectedOption.commonMistake}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Phase 3: All Explanations */}
          {showExplanation && !showAllExplanations && (
            <Button
              onClick={() => setShowAllExplanations(true)}
              variant="outline"
              className="w-full"
            >
              View All Explanations
            </Button>
          )}

          {showAllExplanations && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="font-bold text-lg">Alle Optionen Erklärt:</h4>
              {quiz.options.map((option) => (
                <div
                  key={option.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    option.isCorrect
                      ? "bg-green-50 border-green-500"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold">
                      {option.isCorrect ? "✓" : "✗"} {option.text}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {option.explanation}
                  </p>
                  {option.commonMistake && (
                    <div className="mt-2 pt-2 border-t border-gray-300">
                      <p className="text-xs font-semibold text-gray-600 mb-1">
                        Häufiger Fehler:
                      </p>
                      <p className="text-sm text-gray-600">
                        {option.commonMistake}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!showExplanation ? (
              <Button
                onClick={handleCheckAnswer}
                disabled={!selectedOptionId}
                size="lg"
                className="flex-1"
              >
                Check Answer
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => setShowAllExplanations(!showAllExplanations)}
                  variant="secondary"
                  className="flex-1"
                >
                  {showAllExplanations ? "Hide All" : "Compare All"}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
