export interface QuizOption {
  id: string;
  text: string;
  explanation: string;
  isCorrect: boolean;
  commonMistake?: string;
}

export interface ExplanationQuiz {
  id: string;
  title: string;
  question: string;
  context?: string;
  category: string;
  options: QuizOption[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateExplanationQuizRequest {
  title: string;
  question: string;
  context?: string;
  category: string;
  options: Omit<QuizOption, "id">[];
}
