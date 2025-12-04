// Vocabulary and Spaced Repetition System types inspired by Baicizhan

export interface Vocabulary {
  id: string;
  word: string;
  meaning: string;
  phonetic?: string;
  example_sentence?: string;
  example_translation?: string;
  image_url?: string;
  audio_url?: string;
  category?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

// Spaced Repetition System (SRS) mastery levels
export type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface WordProgress {
  vocabulary_id: string;
  mastery_level: MasteryLevel;
  correct_count: number;
  incorrect_count: number;
  last_reviewed: string;
  next_review: string;
}

export interface DailyGoal {
  target_words: number;
  words_learned: number;
  target_reviews: number;
  words_reviewed: number;
  date: string;
}

export interface LearningStreak {
  current_streak: number;
  longest_streak: number;
  last_active_date: string;
  streak_dates: string[];
}

export interface UserLearningStats {
  total_words_learned: number;
  total_words_mastered: number;
  daily_goal: DailyGoal;
  streak: LearningStreak;
  words_due_for_review: number;
}

// Flashcard quiz types
export type FlashcardQuizType = 
  | "word-to-meaning"     // Show word, select correct meaning
  | "meaning-to-word"     // Show meaning, select correct word
  | "image-to-word"       // Show image, select correct word
  | "audio-to-word"       // Play audio, select correct word
  | "fill-in-blank";      // Fill in the blank in a sentence
