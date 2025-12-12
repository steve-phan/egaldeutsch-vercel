// German Noun Dictionary Types

export interface DictionaryExample {
  de: string; // German sentence
  en: string; // English translation
  vi: string; // Vietnamese translation
}

export interface DictionaryEntry {
  word: string; // German noun (e.g., "Haus")
  artikel: "der" | "die" | "das"; // Grammatical article
  plural: string; // Plural form (e.g., "Häuser")
  english: string; // English translation
  vietnamese: string; // Vietnamese translation
  definition_en: string; // English definition
  definition_vi: string; // Vietnamese definition
  examples: DictionaryExample[]; // Usage examples
}

export interface Dictionary {
  byWord: Record<string, string>; // lowercase word -> ID mapping
  byEnglish: Record<string, string[]>; // English translation -> ID[] mapping
  byVietnamese: Record<string, string[]>; // Vietnamese translation -> ID[] mapping
  byArtikel: {
    der: string[];
    die: string[];
    das: string[];
  };
  entries: Record<string, DictionaryEntry>; // ID -> full entry mapping
}

// Search filters
export interface DictionarySearchFilters {
  word?: string;
  english?: string;
  vietnamese?: string;
  artikel?: "der" | "die" | "das";
}

// Search result
export interface DictionarySearchResult {
  id: string;
  entry: DictionaryEntry;
  relevance?: number;
}
