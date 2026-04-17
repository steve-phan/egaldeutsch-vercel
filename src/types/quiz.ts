export type CEFRLevel = "A1" | "A2" | "B1" | "B2";

export type QuizCategory =
  | "artikel"
  | "kasus"
  | "praepositionen"
  | "verb-konjugation"
  | "adjektivendungen"
  | "negation"
  | "relativsaetze"
  | "konjunktionen"
  | "passiv"
  | "konjunktiv"
  | "wortstellung"
  | "trennbare-verben"
  | "n-deklination"
  | "praepositionalverben"
  | "genitiv";

export type QuizType =
  | "multiple-choice"
  | "fill-in-blank"
  | "word-order"
  | "matching"
  | "word-scramble";

export interface LocalizedText {
  de: string;
  en: string;
  vi: string;
}

export interface QuizOption {
  de: string;
  en: string;
  vi: string;
}

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  subcategory: string;
  level: CEFRLevel;
  type: QuizType;
  prompt_de: string;
  prompt_en: string;
  prompt_vi: string;
  blank_index?: number;
  options?: QuizOption[];
  correct_answer: string;
  explanation_de: string;
  explanation_en: string;
  explanation_vi: string;
  hint_de?: string;
  hint_en?: string;
  hint_vi?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CategoryMeta {
  id: QuizCategory;
  label: LocalizedText;
  description: LocalizedText;
  icon: string;
  levels: CEFRLevel[];
  question_counts: Partial<Record<CEFRLevel, number>>;
}

export interface QuizSessionConfig {
  category: QuizCategory;
  level: CEFRLevel | "mixed";
  totalQuestions: number;
  timePerQuestion?: number; // In seconds, undefined = no limit
}

export interface QuizSessionResult {
  categoryId: string;
  score: number;
  timeSpent: number; // in seconds
  questionsAnswered: number;
  correctAnswers: number;
  date: Date;
}
