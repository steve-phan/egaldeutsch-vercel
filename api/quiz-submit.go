package handler

import (
	"encoding/json"
	"net/http"

	"egaldeutsch-vercel/mock"
	"egaldeutsch-vercel/utils"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type QuizSubmitRequest struct {
	Category string  `json:"category"`
	Level    string  `json:"level"`
	Score    float64 `json:"score"`
	TotalQ   int     `json:"total_q"`
	CorrectQ int     `json:"correct_q"`
}

// QuizSubmitHandler handles POST /api/quiz/submit
// Both guests and authenticated users can submit.
func QuizSubmitHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req QuizSubmitRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Try to get user from token, but don't fail if guest (no token)
	var userID *primitive.ObjectID
	claims, err := utils.GetClaimsFromRequest(r)
	if err == nil {
		if id, err := primitive.ObjectIDFromHex(claims.UserID); err == nil {
			userID = &id
		}
	}

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		session := &mock.MockQuizSession{
			UserID:   userID,
			Category: req.Category,
			Level:    req.Level,
			Score:    req.Score,
			TotalQ:   req.TotalQ,
			CorrectQ: req.CorrectQ,
		}
		saved := mockDB.SaveSession(session)
		json.NewEncoder(w).Encode(saved)
		return
	}

	// TODO: Phase 6 MongoDB logic
	json.NewEncoder(w).Encode(map[string]interface{}{"status": "success"})
}
