import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Check, Sparkles } from "lucide-react";

interface WordScrambleProps {
  word: string;
  hint: string;
  onComplete: (success: boolean) => void;
}

// Shuffle function outside of component to avoid lint warnings
function shuffleLetters(word: string): Array<{ letter: string; id: number; used: boolean }> {
  const letters = word.toUpperCase().split("");
  // Fisher-Yates shuffle
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters.map((letter, index) => ({ letter, id: index, used: false }));
}

// Create a stable initial value using a factory function
function getInitialLetters(word: string) {
  return shuffleLetters(word);
}

export function WordScramble({ word, hint, onComplete }: WordScrambleProps) {
  const [availableLetters, setAvailableLetters] = useState(() => getInitialLetters(word));
  const [selectedLetters, setSelectedLetters] = useState<Array<{ letter: string; id: number }>>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleLetterClick = useCallback((letterObj: { letter: string; id: number; used: boolean }) => {
    if (letterObj.used || isComplete) return;

    setAvailableLetters(prev =>
      prev.map(l => (l.id === letterObj.id ? { ...l, used: true } : l))
    );
    setSelectedLetters(prev => [...prev, { letter: letterObj.letter, id: letterObj.id }]);
  }, [isComplete]);

  const handleSelectedClick = useCallback((letterObj: { letter: string; id: number }, index: number) => {
    if (isComplete) return;

    setAvailableLetters(prev =>
      prev.map(l => (l.id === letterObj.id ? { ...l, used: false } : l))
    );
    setSelectedLetters(prev => prev.filter((_, i) => i !== index));
  }, [isComplete]);

  const handleCheck = useCallback(() => {
    const currentWord = selectedLetters.map(l => l.letter).join("");
    const correct = currentWord === word.toUpperCase();
    setIsCorrect(correct);
    setIsComplete(true);
    onComplete(correct);
  }, [selectedLetters, word, onComplete]);

  const handleReset = useCallback(() => {
    const newLetters = shuffleLetters(word);
    setAvailableLetters(newLetters);
    setSelectedLetters([]);
    setIsComplete(false);
    setIsCorrect(false);
  }, [word]);

  const canCheck = selectedLetters.length === word.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Word Scramble
        </CardTitle>
        <CardDescription>
          Arrange the letters to form the correct word
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hint Section */}
        <div className="text-center">
          {showHint ? (
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              💡 Hint: {hint}
            </p>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setShowHint(true)}>
              Show Hint
            </Button>
          )}
        </div>

        {/* Selected Letters (Answer Area) */}
        <div className="min-h-[60px] flex items-center justify-center gap-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
          {selectedLetters.length === 0 ? (
            <span className="text-muted-foreground text-sm">Click letters below to form the word</span>
          ) : (
            selectedLetters.map((letterObj, index) => (
              <button
                key={`selected-${letterObj.id}-${index}`}
                onClick={() => handleSelectedClick(letterObj, index)}
                disabled={isComplete}
                className={`
                  w-10 h-12 md:w-12 md:h-14 rounded-lg font-bold text-lg md:text-xl
                  flex items-center justify-center
                  transition-all duration-200
                  ${isComplete
                    ? isCorrect
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-primary text-primary-foreground hover:scale-105 hover:shadow-md cursor-pointer"
                  }
                `}
              >
                {letterObj.letter}
              </button>
            ))
          )}
        </div>

        {/* Available Letters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {availableLetters.map((letterObj) => (
            <button
              key={`available-${letterObj.id}`}
              onClick={() => handleLetterClick(letterObj)}
              disabled={letterObj.used || isComplete}
              className={`
                w-10 h-12 md:w-12 md:h-14 rounded-lg font-bold text-lg md:text-xl
                flex items-center justify-center
                transition-all duration-200
                ${letterObj.used
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-secondary text-secondary-foreground hover:scale-110 hover:shadow-lg cursor-pointer border-2 border-slate-300 dark:border-slate-500"
                }
              `}
            >
              {letterObj.letter}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {isComplete && (
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
                Excellent! You got it right! 🎉
              </span>
            ) : (
              <span>
                Not quite! The correct word is: <strong>{word.toUpperCase()}</strong>
              </span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleCheck}
          disabled={!canCheck || isComplete}
          className="w-full sm:w-auto"
        >
          <Check className="mr-2 h-4 w-4" />
          Check Answer
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-full sm:w-auto"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
}
