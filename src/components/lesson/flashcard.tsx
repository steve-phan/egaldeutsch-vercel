"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, Eye, EyeOff, RotateCcw, Check, X } from "lucide-react";

interface FlashcardProps {
  word: string;
  meaning: string;
  phonetic?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  imageUrl?: string;
  audioUrl?: string;
  onKnow: () => void;
  onDontKnow: () => void;
}

export function Flashcard({
  word,
  meaning,
  phonetic,
  exampleSentence,
  exampleTranslation,
  imageUrl,
  audioUrl,
  onKnow,
  onDontKnow,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExample, setShowExample] = useState(false);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handlePlayAudio = useCallback(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => console.error("Failed to play audio:", err));
    }
  }, [audioUrl]);

  const handleReset = useCallback(() => {
    setIsFlipped(false);
    setShowExample(false);
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg text-muted-foreground">
          Tap card to reveal {isFlipped ? "word" : "meaning"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Flashcard Display */}
        <button
          onClick={handleFlip}
          className="w-full min-h-[200px] rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer p-6 flex flex-col items-center justify-center"
          aria-label={isFlipped ? "Show word" : "Show meaning"}
        >
          {/* Front Side - Word */}
          {!isFlipped ? (
            <div className="space-y-3 text-center">
              {imageUrl && (
                <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={word}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h2 className="text-3xl font-bold text-foreground">{word}</h2>
              {phonetic && (
                <p className="text-sm text-muted-foreground">{phonetic}</p>
              )}
              {audioUrl && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Volume2 className="h-4 w-4" />
                  Audio available below
                </span>
              )}
            </div>
          ) : (
            /* Back Side - Meaning */
            <div className="space-y-3 text-center">
              <h2 className="text-xl font-semibold text-foreground">{meaning}</h2>
              <div className="h-px w-16 mx-auto bg-border" />
              <p className="text-2xl font-bold text-primary">{word}</p>
              {phonetic && (
                <p className="text-sm text-muted-foreground">{phonetic}</p>
              )}
            </div>
          )}
        </button>

        {/* Example Sentence Toggle */}
        {exampleSentence && (
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExample(!showExample)}
              className="w-full gap-2"
            >
              {showExample ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {showExample ? "Hide" : "Show"} Example
            </Button>
            
            {showExample && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="text-sm font-medium">{exampleSentence}</p>
                {exampleTranslation && (
                  <p className="text-xs text-muted-foreground">
                    {exampleTranslation}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        {/* Audio Button */}
        {audioUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlayAudio}
            className="w-full gap-2"
          >
            <Volume2 className="h-4 w-4" />
            Listen to Pronunciation
          </Button>
        )}

        {/* Answer Buttons */}
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              handleReset();
              onDontKnow();
            }}
          >
            <X className="h-4 w-4" />
            Don&apos;t Know
          </Button>
          <Button
            className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => {
              handleReset();
              onKnow();
            }}
          >
            <Check className="h-4 w-4" />
            Know It
          </Button>
        </div>

        {/* Reset Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="w-full gap-2 text-muted-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Card
        </Button>
      </CardFooter>
    </Card>
  );
}
