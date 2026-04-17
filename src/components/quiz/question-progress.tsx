import { Timer } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface QuestionProgressProps {
  currentIndex: number;
  totalQuestions: number;
  timeRemainingMs: number | null;
  timePerQuestionMs?: number | null;
}

export function QuestionProgress({ currentIndex, totalQuestions, timeRemainingMs, timePerQuestionMs }: QuestionProgressProps) {
  const percentComplete = ((currentIndex) / totalQuestions) * 100;
  
  // Timer visual math
  let timePercent = 100;
  let isLowTime = false;
  if (timeRemainingMs !== null && timePerQuestionMs) {
    timePercent = (timeRemainingMs / timePerQuestionMs) * 100;
    isLowTime = timeRemainingMs <= 5000; // Less than 5 seconds
  }

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    return `${totalSeconds}s`;
  };

  return (
    <div className="w-full space-y-4 mb-8">
      {/* Question Counter + Progress Bar */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <Progress value={percentComplete} className="h-2 flex-1" />
      </div>

      {/* Timer Bar (Only shown if configured) */}
      {timeRemainingMs !== null && (
        <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-2 border">
          <Timer className={`w-5 h-5 ${isLowTime ? "text-red-500 animate-pulse" : "text-slate-400"}`} />
          <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
             <div 
               className={`h-full transition-all ease-linear duration-100 ${isLowTime ? "bg-red-500" : "bg-indigo-500"}`}
               style={{ width: `${timePercent}%` }}
             />
          </div>
          <span className={`text-sm font-medium w-8 text-right ${isLowTime ? "text-red-500" : "text-slate-600"}`}>
            {formatTime(timeRemainingMs)}
          </span>
        </div>
      )}
    </div>
  );
}
