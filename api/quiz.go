package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"egaldeutsch-vercel/mock"
)

// QuizQuestionsHandler handles GET /api/quiz/questions
// Query params: category (string, optional), level (string, optional), limit (int, default = 10)
func QuizQuestionsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	category := r.URL.Query().Get("category")
	level := r.URL.Query().Get("level")
	limitStr := r.URL.Query().Get("limit")
	limit := 10 // Default

	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		questions := mockDB.GetQuestions(category, level, limit)
		json.NewEncoder(w).Encode(questions)
		return
	}

	// TODO: Phase 6 MongoDB logic
	json.NewEncoder(w).Encode([]interface{}{})
}
