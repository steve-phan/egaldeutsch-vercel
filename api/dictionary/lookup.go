package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

// DictionaryExample represents an example sentence
type DictionaryExample struct {
	De string `json:"de"`
	En string `json:"en"`
	Vi string `json:"vi"`
}

// DictionaryEntry represents a single dictionary entry
type DictionaryEntry struct {
	Word         string              `json:"word"`
	Artikel      string              `json:"artikel"`
	Plural       string              `json:"plural"`
	English      string              `json:"english"`
	Vietnamese   string              `json:"vietnamese"`
	DefinitionEn string              `json:"definition_en"`
	DefinitionVi string              `json:"definition_vi"`
	Examples     []DictionaryExample `json:"examples"`
}

// Dictionary represents the complete dictionary structure
type Dictionary struct {
	ByWord       map[string]string              `json:"byWord"`
	ByEnglish    map[string][]string            `json:"byEnglish"`
	ByVietnamese map[string][]string            `json:"byVietnamese"`
	ByArtikel    map[string][]string            `json:"byArtikel"`
	Entries      map[string]DictionaryEntry     `json:"entries"`
}

// SearchResult represents a search result
type SearchResult struct {
	ID    string          `json:"id"`
	Entry DictionaryEntry `json:"entry"`
}

// LookupHandler handles dictionary lookup requests
func LookupHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse query parameters
	query := r.URL.Query()
	word := query.Get("word")
	english := query.Get("english")
	vietnamese := query.Get("vietnamese")
	artikel := query.Get("artikel")

	// Load dictionary
	dict, err := loadDictionary()
	if err != nil {
		http.Error(w, "Failed to load dictionary", http.StatusInternalServerError)
		return
	}

	// Perform search
	results := searchDictionary(dict, word, english, vietnamese, artikel)

	// Return results
	json.NewEncoder(w).Encode(map[string]interface{}{
		"results": results,
		"total":   len(results),
	})
}

// loadDictionary loads the dictionary from JSON files
func loadDictionary() (*Dictionary, error) {
	// Load batch-001.json
	dictPath := filepath.Join("public", "data", "dictionary", "batch-001.json")
	data, err := os.ReadFile(dictPath)
	if err != nil {
		return nil, err
	}

	var dict Dictionary
	if err := json.Unmarshal(data, &dict); err != nil {
		return nil, err
	}

	return &dict, nil
}

// searchDictionary performs a search on the dictionary
func searchDictionary(dict *Dictionary, word, english, vietnamese, artikel string) []SearchResult {
	results := []SearchResult{}
	addedIDs := make(map[string]bool)

	// Search by German word
	if word != "" {
		searchTerm := strings.ToLower(word)
		for w, id := range dict.ByWord {
			if strings.Contains(w, searchTerm) && !addedIDs[id] {
				results = append(results, SearchResult{
					ID:    id,
					Entry: dict.Entries[id],
				})
				addedIDs[id] = true
			}
		}
	}

	// Search by English translation
	if english != "" {
		searchTerm := strings.ToLower(english)
		for en, ids := range dict.ByEnglish {
			if strings.Contains(strings.ToLower(en), searchTerm) {
				for _, id := range ids {
					if !addedIDs[id] {
						results = append(results, SearchResult{
							ID:    id,
							Entry: dict.Entries[id],
						})
						addedIDs[id] = true
					}
				}
			}
		}
	}

	// Search by Vietnamese translation
	if vietnamese != "" {
		searchTerm := strings.ToLower(vietnamese)
		for vi, ids := range dict.ByVietnamese {
			if strings.Contains(strings.ToLower(vi), searchTerm) {
				for _, id := range ids {
					if !addedIDs[id] {
						results = append(results, SearchResult{
							ID:    id,
							Entry: dict.Entries[id],
						})
						addedIDs[id] = true
					}
				}
			}
		}
	}

	// Filter by artikel
	if artikel != "" && (artikel == "der" || artikel == "die" || artikel == "das") {
		artikelIDs := make(map[string]bool)
		for _, id := range dict.ByArtikel[artikel] {
			artikelIDs[id] = true
		}

		if len(results) > 0 {
			// Filter existing results
			filteredResults := []SearchResult{}
			for _, result := range results {
				if artikelIDs[result.ID] {
					filteredResults = append(filteredResults, result)
				}
			}
			results = filteredResults
		} else {
			// Return all entries for this artikel
			for _, id := range dict.ByArtikel[artikel] {
				results = append(results, SearchResult{
					ID:    id,
					Entry: dict.Entries[id],
				})
			}
		}
	}

	// If no search criteria provided, return all entries
	if word == "" && english == "" && vietnamese == "" && artikel == "" {
		for id, entry := range dict.Entries {
			results = append(results, SearchResult{
				ID:    id,
				Entry: entry,
			})
		}
	}

	return results
}
