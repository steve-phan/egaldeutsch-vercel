package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"
 
	"egaldeutsch-vercel/db"
	"egaldeutsch-vercel/utils"
 
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
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

	collection := db.GetCollection("sessions")
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	// Pipeline: Filter by User, then Facet into Overall and Category slices
	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.D{{Key: "user_id", Value: userID}}}},
		{{Key: "$facet", Value: bson.D{
			{Key: "overall", Value: mongo.Pipeline{
				{{Key: "$group", Value: bson.D{
					{Key: "_id", Value: nil},
					{Key: "total_sessions", Value: bson.D{{Key: "$sum", Value: 1}}},
					{Key: "total_questions", Value: bson.D{{Key: "$sum", Value: "$total_q"}}},
					{Key: "total_correct", Value: bson.D{{Key: "$sum", Value: "$correct_q"}}},
				}}},
			}},
			{Key: "categories", Value: mongo.Pipeline{
				{{Key: "$group", Value: bson.D{
					{Key: "_id", Value: "$category"},
					{Key: "avg_score", Value: bson.D{{Key: "$avg", Value: "$score"}}},
				}}},
			}},
		}}},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		utils.LogError(w, err, "Failed to aggregate dashboard stats", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var results []bson.M
	if err = cursor.All(ctx, &results); err != nil {
		utils.LogError(w, err, "Failed to decode dashboard stats", http.StatusInternalServerError)
		return
	}

	stats := DashboardStats{
		CategoryAverages: make(map[string]float64),
	}

	if len(results) > 0 {
		facet := results[0]

		// Extract Overall Stats
		if overall, ok := facet["overall"].(primitive.A); ok && len(overall) > 0 {
			data := overall[0].(bson.M)
			stats.TotalSessions = int(data["total_sessions"].(int32))
			stats.TotalQuestions = int(data["total_questions"].(int32))
			stats.TotalCorrect = int(data["total_correct"].(int32))
			if stats.TotalQuestions > 0 {
				stats.Accuracy = (float64(stats.TotalCorrect) / float64(stats.TotalQuestions)) * 100
			}
		}

		// Extract Category Averages
		if categories, ok := facet["categories"].(primitive.A); ok {
			for _, c := range categories {
				data := c.(bson.M)
				if catID, ok := data["_id"].(string); ok {
					stats.CategoryAverages[catID] = data["avg_score"].(float64)
				}
			}
		}
	}

	json.NewEncoder(w).Encode(stats)
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
