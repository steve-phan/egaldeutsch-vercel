'use client';

import { useState, useEffect } from 'react';
import { Search, Book, Globe, Languages } from 'lucide-react';
import { loadAllLetterDictionaries, searchDictionary, getEntriesByArtikel, getTotalEntries } from '@/lib/dictionary';
import type { Dictionary, DictionarySearchFilters, DictionarySearchResult } from '@/types/dictionary';

export default function DictionaryPage() {
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [results, setResults] = useState<DictionarySearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'word' | 'english' | 'vietnamese'>('word');
  const [filterArtikel, setFilterArtikel] = useState<'der' | 'die' | 'das' | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load dictionary on mount
  useEffect(() => {
    async function loadDictionary() {
      try {
        // Load all letter-based dictionary files
        const merged = await loadAllLetterDictionaries();
        
        setDictionary(merged);
        // Show all entries initially
        const allResults = Object.keys(merged.entries).map(id => ({
          id,
          entry: merged.entries[id],
        }));
        setResults(allResults);
      } catch (error) {
        console.error('Failed to load dictionary:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadDictionary();
  }, []);

  // Handle search
  const handleSearch = () => {
    if (!dictionary) return;

    if (searchTerm.trim() === '' && filterArtikel === 'all') {
      // Show all entries
      const allResults = Object.keys(dictionary.entries).map(id => ({
        id,
        entry: dictionary.entries[id],
      }));
      setResults(allResults);
      return;
    }

    const filters: DictionarySearchFilters = {};
    
    if (searchTerm.trim() !== '') {
      if (searchType === 'word') {
        filters.word = searchTerm;
      } else if (searchType === 'english') {
        filters.english = searchTerm;
      } else if (searchType === 'vietnamese') {
        filters.vietnamese = searchTerm;
      }
    }

    if (filterArtikel !== 'all') {
      filters.artikel = filterArtikel;
    }

    const searchResults = searchDictionary(dictionary, filters);
    setResults(searchResults);
  };

  // Filter by artikel only
  const handleArtikelFilter = (artikel: 'der' | 'die' | 'das' | 'all') => {
    setFilterArtikel(artikel);
    if (!dictionary) return;

    if (artikel === 'all') {
      const allResults = Object.keys(dictionary.entries).map(id => ({
        id,
        entry: dictionary.entries[id],
      }));
      setResults(allResults);
    } else {
      const artikelResults = getEntriesByArtikel(dictionary, artikel);
      setResults(artikelResults);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dictionary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Book className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">German Noun Dictionary</h1>
              <p className="text-sm text-muted-foreground">
                {dictionary ? `${getTotalEntries(dictionary)} entries` : 'Loading...'}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={`Search by ${searchType}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Search
              </button>
            </div>

            {/* Search Type Selector */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSearchType('word')}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors ${
                  searchType === 'word'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Languages className="h-3 w-3" />
                German
              </button>
              <button
                onClick={() => setSearchType('english')}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors ${
                  searchType === 'english'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Globe className="h-3 w-3" />
                English
              </button>
              <button
                onClick={() => setSearchType('vietnamese')}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors ${
                  searchType === 'vietnamese'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Globe className="h-3 w-3" />
                Vietnamese
              </button>
            </div>

            {/* Artikel Filter */}
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground py-1">Filter by artikel:</span>
              {(['all', 'der', 'die', 'das'] as const).map((artikel) => (
                <button
                  key={artikel}
                  onClick={() => handleArtikelFilter(artikel)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filterArtikel === artikel
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {artikel === 'all' ? 'All' : artikel}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Results */}
      <main className="container mx-auto px-4 py-6">
        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No results found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-card border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                {/* Header with artikel and word */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span
                    className={`text-sm font-semibold px-2 py-0.5 rounded ${
                      result.entry.artikel === 'der'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : result.entry.artikel === 'die'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    }`}
                  >
                    {result.entry.artikel}
                  </span>
                  <h3 className="text-xl font-bold">{result.entry.word}</h3>
                </div>

                {/* Plural */}
                <p className="text-sm text-muted-foreground mb-3">
                  Plural: {result.entry.plural}
                </p>

                {/* Translations */}
                <div className="space-y-2 mb-3">
                  <div className="flex gap-2">
                    <span className="text-xs font-medium text-muted-foreground w-16">EN:</span>
                    <span className="text-sm">{result.entry.english}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs font-medium text-muted-foreground w-16">VI:</span>
                    <span className="text-sm">{result.entry.vietnamese}</span>
                  </div>
                </div>

                {/* Definitions */}
                <div className="space-y-2 mb-3 border-t pt-3">
                  <p className="text-xs text-muted-foreground">{result.entry.definition_en}</p>
                  <p className="text-xs text-muted-foreground">{result.entry.definition_vi}</p>
                </div>

                {/* Examples */}
                {result.entry.examples.length > 0 && (
                  <div className="border-t pt-3 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Examples:</p>
                    {result.entry.examples.map((example, idx) => (
                      <div key={idx} className="text-xs space-y-1 bg-muted/50 p-2 rounded">
                        <p className="font-medium">{example.de}</p>
                        <p className="text-muted-foreground">{example.en}</p>
                        <p className="text-muted-foreground">{example.vi}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
