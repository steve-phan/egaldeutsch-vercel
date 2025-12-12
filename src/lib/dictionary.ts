// Utility functions for dictionary operations

import type { Dictionary, DictionaryEntry, DictionarySearchFilters, DictionarySearchResult } from '@/types/dictionary';

/**
 * Load a dictionary batch from JSON file
 */
export async function loadDictionaryBatch(batchNumber: number): Promise<Dictionary> {
  const response = await fetch(`/data/dictionary/batch-${String(batchNumber).padStart(3, '0')}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load dictionary batch ${batchNumber}`);
  }
  return response.json();
}

/**
 * Load dictionary by letter from JSON file
 */
export async function loadDictionaryByLetter(letter: string): Promise<Dictionary> {
  const response = await fetch(`/data/dictionary/letters/${letter.toLowerCase()}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load dictionary for letter ${letter}`);
  }
  return response.json();
}

/**
 * Load all letter-based dictionaries
 */
export async function loadAllLetterDictionaries(): Promise<Dictionary> {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const dictionaries: Dictionary[] = [];
  
  for (const letter of letters) {
    try {
      const dict = await loadDictionaryByLetter(letter);
      dictionaries.push(dict);
    } catch {
      // Skip letters that don't have entries yet
      console.log(`No entries for letter ${letter}`);
    }
  }
  
  return mergeDictionaries(dictionaries);
}

/**
 * Merge multiple dictionary batches into one
 */
export function mergeDictionaries(dictionaries: Dictionary[]): Dictionary {
  const merged: Dictionary = {
    byWord: {},
    byEnglish: {},
    byVietnamese: {},
    byArtikel: { der: [], die: [], das: [] },
    entries: {},
  };

  for (const dict of dictionaries) {
    // Merge byWord
    Object.assign(merged.byWord, dict.byWord);

    // Merge byEnglish
    for (const [key, ids] of Object.entries(dict.byEnglish)) {
      if (!merged.byEnglish[key]) {
        merged.byEnglish[key] = [];
      }
      merged.byEnglish[key].push(...ids);
    }

    // Merge byVietnamese
    for (const [key, ids] of Object.entries(dict.byVietnamese)) {
      if (!merged.byVietnamese[key]) {
        merged.byVietnamese[key] = [];
      }
      merged.byVietnamese[key].push(...ids);
    }

    // Merge byArtikel
    merged.byArtikel.der.push(...dict.byArtikel.der);
    merged.byArtikel.die.push(...dict.byArtikel.die);
    merged.byArtikel.das.push(...dict.byArtikel.das);

    // Merge entries
    Object.assign(merged.entries, dict.entries);
  }

  return merged;
}

/**
 * Search dictionary entries
 */
export function searchDictionary(
  dictionary: Dictionary,
  filters: DictionarySearchFilters
): DictionarySearchResult[] {
  const results: DictionarySearchResult[] = [];
  const addedIds = new Set<string>();

  // Search by German word
  if (filters.word) {
    const searchTerm = filters.word.toLowerCase();
    for (const [word, id] of Object.entries(dictionary.byWord)) {
      if (word.includes(searchTerm) && !addedIds.has(id)) {
        results.push({
          id,
          entry: dictionary.entries[id],
          relevance: word === searchTerm ? 1 : 0.5,
        });
        addedIds.add(id);
      }
    }
  }

  // Search by English translation
  if (filters.english) {
    const searchTerm = filters.english.toLowerCase();
    for (const [english, ids] of Object.entries(dictionary.byEnglish)) {
      if (english.toLowerCase().includes(searchTerm)) {
        for (const id of ids) {
          if (!addedIds.has(id)) {
            results.push({
              id,
              entry: dictionary.entries[id],
              relevance: english.toLowerCase() === searchTerm ? 1 : 0.5,
            });
            addedIds.add(id);
          }
        }
      }
    }
  }

  // Search by Vietnamese translation
  if (filters.vietnamese) {
    const searchTerm = filters.vietnamese.toLowerCase();
    for (const [vietnamese, ids] of Object.entries(dictionary.byVietnamese)) {
      if (vietnamese.toLowerCase().includes(searchTerm)) {
        for (const id of ids) {
          if (!addedIds.has(id)) {
            results.push({
              id,
              entry: dictionary.entries[id],
              relevance: vietnamese.toLowerCase() === searchTerm ? 1 : 0.5,
            });
            addedIds.add(id);
          }
        }
      }
    }
  }

  // Filter by artikel
  if (filters.artikel) {
    const artikelIds = new Set(dictionary.byArtikel[filters.artikel]);
    return results.filter(result => artikelIds.has(result.id));
  }

  // Sort by relevance
  results.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));

  return results;
}

/**
 * Get all entries for a specific artikel
 */
export function getEntriesByArtikel(
  dictionary: Dictionary,
  artikel: 'der' | 'die' | 'das'
): DictionarySearchResult[] {
  const ids = dictionary.byArtikel[artikel];
  return ids.map(id => ({
    id,
    entry: dictionary.entries[id],
  }));
}

/**
 * Get a single entry by ID
 */
export function getEntryById(
  dictionary: Dictionary,
  id: string
): DictionaryEntry | undefined {
  return dictionary.entries[id];
}

/**
 * Get total number of entries
 */
export function getTotalEntries(dictionary: Dictionary): number {
  return Object.keys(dictionary.entries).length;
}
