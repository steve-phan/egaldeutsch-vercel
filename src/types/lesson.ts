export type QuizType = "multiple-choice" | "word-scramble" | "matching-pairs";

export interface MatchingPair {
  id: number;
  word: string;
  match: string;
}

export interface TranscriptSentence {
  text: string;
  translation: string;
}

export interface LessonDetail {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  video_url?: string;
  transcript: TranscriptSentence[];
  quiz_type?: QuizType;
  quiz_question: string;
  quiz_options: string[];
  scramble_word?: string;
  matching_pairs?: MatchingPair[];
}
