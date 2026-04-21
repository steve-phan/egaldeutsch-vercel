import { RotateCcw, Trophy, Shuffle, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shuffle className="h-5 w-5 text-blue-500" />
          Matching Pairs
        </CardTitle>
        <CardDescription>
          Match each word with its correct pair by clicking on the cards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Display */}
        <div className="flex justify-center gap-6 text-sm text-muted-foreground">
          <span className="bg-muted px-3 py-1 rounded-full">
            Matches: <strong className="text-foreground">{matches}/{pairs.length}</strong>
          </span>
          <span className="bg-muted px-3 py-1 rounded-full">
            Attempts: <strong className="text-foreground">{attempts}</strong>
          </span>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {cards.map((card) => (
            <Button
              key={card.id}
              onClick={() => handleCardClick(card)}
              disabled={card.isFlipped || card.isMatched || isChecking}
              className={`
                relative h-20 sm:h-24 rounded-2xl font-black text-sm sm:text-base
                transition-all duration-300 transform active:scale-95
                ${card.isMatched
                  ? "bg-emerald-500 text-white cursor-default scale-95 shadow-lg shadow-emerald-200"
                  : card.isFlipped
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-white border-2 border-slate-100 text-slate-400 hover:border-primary/30 hover:text-primary hover:shadow-premium"
                }
              `}
              style={{
                perspective: "1000px",
              }}
            >
              <span
                className={`
                  absolute inset-0 flex items-center justify-center p-2 text-center
                  ${card.isFlipped || card.isMatched ? "opacity-100" : "opacity-0"}
                `}
              >
                {card.content}
              </span>
              <span
                className={`
                  absolute inset-0 flex items-center justify-center text-2xl
                  ${card.isFlipped || card.isMatched ? "opacity-0" : "opacity-100"}
                `}
              >
                ❓
              </span>
            </Button>
          ))}
        </div>

        {/* Completion Message */}
        {isComplete && (
          <div className="p-4 rounded-lg text-center bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <div className="flex items-center justify-center gap-2 font-medium mb-2">
              <Trophy className="h-5 w-5" />
              Congratulations! You matched all pairs!
            </div>
            <p className="text-sm">
              {getScoreEmoji()} You completed it in {attempts} attempts!
              {attempts === pairs.length && " Perfect score!"}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          onClick={handleReset}
          variant="outline"
          className="w-full h-12 rounded-2xl border-2 border-slate-100 font-black text-slate-400 hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          {language === "de" ? "Nochmal spielen" : "Play Again"}
        </Button>
      </CardFooter>
    </Card>
  );
}
