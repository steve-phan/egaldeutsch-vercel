import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface QuizProps {
  question: string;
  options: string[];
  selectedAnswer: string;
  onSelectAnswer: (answer: string) => void;
  onCheckAnswer: () => void;
  feedback: string | null;
}

export function Quiz({
  question,
  options,
  selectedAnswer,
  onSelectAnswer,
  onCheckAnswer,
  feedback,
}: QuizProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
        <CardDescription>{question}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedAnswer} onValueChange={onSelectAnswer} className="space-y-3">
          {options &&
            options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-3 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <Button onClick={onCheckAnswer} disabled={!selectedAnswer} className="w-full sm:w-auto">
          Check Answer
        </Button>
        {feedback && (
          <div
            className={`p-3 rounded-md w-full ${
              feedback.includes("Correct") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {feedback}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
