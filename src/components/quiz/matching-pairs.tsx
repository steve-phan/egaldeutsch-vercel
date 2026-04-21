import { useCallback, useState } from "react";
import { RotateCcw, Trophy, Shuffle, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

interface MatchingPair {
  id: number;
  word: string;
  match: string;
}

interface MatchingPairsProps {
  pairs: MatchingPair[];
  onComplete: (success: boolean) => void;
}

interface CardState {
  id: string;
  content: string;
  pairId: number;
  type: "word" | "match";
  isFlipped: boolean;
  isMatched: boolean;
}

// Shuffle function outside component to avoid lint warnings
function createShuffledCards(pairs: MatchingPair[]): CardState[] {
  const cards: CardState[] = [];

  pairs.forEach((pair) => {
    cards.push({
      id: `word-${pair.id}`,
      content: pair.word,
      pairId: pair.id,
      type: "word",
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      id: `match-${pair.id}`,
      content: pair.match,
      pairId: pair.id,
      type: "match",
      isFlipped: false,
      isMatched: false,
    });
  });

  // Shuffle cards using Fisher-Yates
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

// Factory function for initial state
function getInitialCards(pairs: MatchingPair[]) {
  return createShuffledCards(pairs);
}

export function MatchingPairs({ pairs, onComplete }: MatchingPairsProps) {
  const { language } = useLanguage();
  const [cards, setCards] = useState<CardState[]>(() => getInitialCards(pairs));
  const [selectedCards, setSelectedCards] = useState<CardState[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Compute isComplete from matches count
  const isComplete = matches === pairs.length;

  const handleCardClick = useCallback((card: CardState) => {
    if (isChecking || card.isFlipped || card.isMatched || selectedCards.length >= 2) {
      return;
    }

    const newCards = cards.map(c =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newSelected = [...selectedCards, { ...card, isFlipped: true }];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setAttempts(prev => prev + 1);
      setIsChecking(true);

      const [first, second] = newSelected;
      const isMatch = first.pairId === second.pairId && first.type !== second.type;

      setTimeout(() => {
        if (isMatch) {
          setCards(prev =>
            prev.map(c =>
              c.pairId === first.pairId ? { ...c, isMatched: true, isFlipped: true } : c
            )
          );
          const newMatchCount = matches + 1;
          setMatches(newMatchCount);

          // Check for completion and call onComplete only once
          // hasCompleted prevents duplicate calls, isComplete is derived for UI
          if (newMatchCount === pairs.length && !hasCompleted) {
            setHasCompleted(true);
            onComplete(true);
          }
        } else {
          setCards(prev =>
            prev.map(c =>
              c.id === first.id || c.id === second.id ? { ...c, isFlipped: false } : c
            )
          );
        }
        setSelectedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  }, [cards, selectedCards, isChecking, matches, pairs.length, hasCompleted, onComplete]);

  const handleReset = useCallback(() => {
    // Re-shuffle and reset
    const newCards = createShuffledCards(pairs);
    setCards(newCards);
    setSelectedCards([]);
    setAttempts(0);
    setMatches(0);
    setHasCompleted(false);
    setIsChecking(false);
  }, [pairs]);

  const getScoreEmoji = () => {
    const efficiency = (pairs.length / attempts) * 100;
    if (efficiency >= 100) return "🏆";
    if (efficiency >= 70) return "🌟";
    if (efficiency >= 50) return "👍";
    return "💪";
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header Prompt Area */}
      <div className="w-full p-6 md:p-8 text-center relative border-b border-slate-100 bg-white">
        <div className="absolute top-4 right-8 text-primary animate-pulse opacity-20">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Matching Pairs</p>
        <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-2 italic tracking-tighter leading-tight">
          {language === "de" ? "Finde die Paare" : language === "vi" ? "Tìm các cặp tương ứng" : "Find the matching pairs"}
        </h2>
        <p className="text-sm text-slate-400 mt-2">Vocabulary Mastery</p>
      </div>

      {/* interaction Area */}
      <div className="w-full p-6 md:p-8 space-y-8 bg-slate-50/20">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {matches}/{pairs.length} Matches
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {attempts} Attempts
            </span>
          </div>
          <Shuffle className="w-4 h-4 text-slate-200" />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
          {cards.map((card) => (
            <Button
              key={card.id}
              onClick={() => handleCardClick(card)}
              disabled={card.isFlipped || card.isMatched || isChecking}
              className={`
                relative h-24 rounded-2xl font-black text-sm
                transition-all duration-500 transform active:scale-95
                ${card.isMatched
                  ? "bg-emerald-500 text-white cursor-default scale-95 shadow-lg shadow-emerald-200 border-transparent"
                  : card.isFlipped
                    ? "bg-primary text-white shadow-xl shadow-primary/30 border-transparent"
                    : "bg-white border-2 border-slate-100 text-slate-500 hover:border-primary/30 hover:shadow-premium"
                }
              `}
            >
              <span className={cn(
                "absolute inset-0 flex items-center justify-center p-3 text-center transition-all duration-300",
                card.isFlipped || card.isMatched ? "opacity-100 scale-100" : "opacity-0 scale-75"
              )}>
                {card.content}
              </span>
              <span className={cn(
                "absolute inset-0 flex items-center justify-center text-xl transition-all duration-300",
                card.isFlipped || card.isMatched ? "opacity-0 scale-125" : "opacity-100 scale-100"
              )}>
                ❓
              </span>
            </Button>
          ))}
        </div>

        {/* Completion Message */}
        {isComplete && (
          <div className="p-6 rounded-[2rem] text-center bg-emerald-50 border-2 border-emerald-100 text-emerald-800 animate-in zoom-in-95 duration-500">
            <div className="flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs mb-2">
              <Trophy className="h-4 w-4 text-emerald-500" />
              Perfect Match!
            </div>
            <p className="text-sm font-bold italic">
              {getScoreEmoji()} You completed it in {attempts} attempts!
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100">
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full h-14 rounded-2xl border-2 border-slate-100 font-black text-slate-400 hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-2 bg-white"
          >
            <RotateCcw className="w-4 h-4" />
            {language === "de" ? "Nochmal spielen" : language === "vi" ? "Chơi lại" : "Play Again"}
          </Button>
        </div>
      </div>
    </div>
  );
}
