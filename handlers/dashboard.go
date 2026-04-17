package handlers

import (
	"encoding/json"
	"net/http"

	"egaldeutsch-vercel/mock"
	"egaldeutsch-vercel/utils"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// DashboardStats is the quiz-based stats response for the dashboard.
type DashboardStats struct {
	TotalSessions   int                `json:"total_sessions"`
	TotalQuestions  int                `json:"total_questions"`
	TotalCorrect    int                `json:"total_correct"`
	Accuracy        float64            `json:"accuracy"`
	CategoryAverages map[string]float64 `json:"category_averages"`
}

// DashboardHandler returns user's quiz statistics.
// Requires a valid JWT token. Returns placeholder stats if no sessions exist.
func DashboardHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	claims, err := utils.GetClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	userID, err := primitive.ObjectIDFromHex(claims.UserID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		raw := mockDB.GetUserStats(userID)

		stats := DashboardStats{
			TotalSessions:    toInt(raw["total_sessions"]),
			TotalQuestions:   toInt(raw["total_questions"]),
			TotalCorrect:     toInt(raw["total_correct"]),
			Accuracy:         toFloat(raw["accuracy"]),
			CategoryAverages: toCatAvg(raw["category_averages"]),
		}
		json.NewEncoder(w).Encode(stats)
		return
	}

	// TODO: MongoDB aggregation in Phase 6
	json.NewEncoder(w).Encode(DashboardStats{CategoryAverages: map[string]float64{}})
}

// ─── helpers ─────────────────────────────────────────────────────────────────

func toInt(v interface{}) int {
	if i, ok := v.(int); ok {
		return i
	}
	return 0
}

func toFloat(v interface{}) float64 {
	if f, ok := v.(float64); ok {
		return f
	}
	return 0
}

func toCatAvg(v interface{}) map[string]float64 {
	if m, ok := v.(map[string]float64); ok {
		return m
	}
	return map[string]float64{}
}
