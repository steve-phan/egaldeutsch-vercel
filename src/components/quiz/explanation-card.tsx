import { QuizQuestion } from "@/types/quiz";
import { CheckCircle2, XCircle } from "lucide-react";

interface ExplanationCardProps {
  question: QuizQuestion;
  isCorrect: boolean | null;
  userAnswer: string;
  language: "de" | "en" | "vi";
}

export function ExplanationCard({ question, isCorrect, userAnswer, language }: ExplanationCardProps) {
  if (isCorrect === null) return null;

  const getExplanation = () => {
    switch (language) {
      case "de": return question.explanation_de;
      case "vi": return question.explanation_vi;
      case "en":
      default: return question.explanation_en;
    }
  };

  const getExplanationTitle = () => {
    switch (language) {
      case "de": return "Erklärung";
      case "vi": return "Giải thích";
      case "en":
      default: return "Explanation";
    }
  };

  const isWin = isCorrect === true;

  return (
    <div className={`mt-6 p-6 rounded-xl border ${
      isWin 
        ? "bg-green-50 border-green-200" 
        : "bg-red-50 border-red-200"
    } animate-in fade-in slide-in-from-bottom-4 duration-300`}>
      <div className="flex items-start gap-4">
        {isWin ? (
          <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
        ) : (
          <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <h4 className={`text-lg font-bold mb-1 ${isWin ? "text-green-800" : "text-red-800"}`}>
            {isWin ? "Correct!" : "Incorrect"}
          </h4>
          {!isWin && (
             <p className="text-red-700 mb-3 font-medium">
               Correct answer: <span className="font-bold bg-white/50 px-2 py-0.5 rounded ml-1">{question.correct_answer}</span>
             </p>
          )}
          <div className="mt-4 pt-4 border-t border-black/10">
            <p className="text-sm font-semibold uppercase tracking-wider opacity-70 mb-2">
              {getExplanationTitle()}
            </p>
            <p className="text-slate-800 leading-relaxed">
              {getExplanation() || "No explanation provided."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
