package handler

import (
	"encoding/json"
	"net/http"

	"egaldeutsch-vercel/mock"
)

// QuizCategoriesHandler handles GET /api/quiz/categories
// Returns aggregated statistics of available questions per category per level.
func QuizCategoriesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		stats := mockDB.GetCategoryStats()
		json.NewEncoder(w).Encode(stats)
		return
	}

	// TODO: Phase 6 MongoDB logic
	json.NewEncoder(w).Encode(map[string]map[string]int{})
}
