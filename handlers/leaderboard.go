package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"egaldeutsch-vercel/db"
	"egaldeutsch-vercel/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type LeaderboardEntry struct {
	UserID       string  `json:"user_id"`
	Name         string  `json:"name"`
	TotalCorrect int     `json:"total_correct"`
	TotalQuizzes int     `json:"total_quizzes"`
	AvgScore     float64 `json:"avg_score"`
}

// LeaderboardHandler handles GET /api/quiz/leaderboard
func LeaderboardHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	sessionColl := db.GetCollection("sessions")
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	// Aggregation Pipeline
	pipeline := mongo.Pipeline{
		// 1. Filter out sessions without a UserID (if any exist from old logic)
		{{Key: "$match", Value: bson.D{
			{Key: "user_id", Value: bson.D{{Key: "$ne", Value: nil}}},
		}}},
		// 2. Group by UserID and accumulate stats
		{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$user_id"},
			{Key: "totalCorrect", Value: bson.D{{Key: "$sum", Value: "$correct_q"}}},
			{Key: "totalQuizzes", Value: bson.D{{Key: "$sum", Value: 1}}},
			{Key: "avgScore", Value: bson.D{{Key: "$avg", Value: "$score"}}},
		}}},
		// 3. Join with Users collection to get the name
		{{Key: "$lookup", Value: bson.D{
			{Key: "from", Value: "users"},
			{Key: "localField", Value: "_id"},
			{Key: "foreignField", Value: "_id"},
			{Key: "as", Value: "user_info"},
		}}},
		// 4. Flatten the joined user info
		{{Key: "$unwind", Value: "$user_info"}},
		// 5. Select only necessary fields
		{{Key: "$project", Value: bson.D{
			{Key: "user_id", Value: "$_id"},
			{Key: "name", Value: "$user_info.name"},
			{Key: "totalCorrect", Value: "$totalCorrect"},
			{Key: "totalQuizzes", Value: "$totalQuizzes"},
			{Key: "avgScore", Value: "$avgScore"},
		}}},
		// 6. Sort by totalCorrect DESC
		{{Key: "$sort", Value: bson.D{{Key: "totalCorrect", Value: -1}}}},
		// 7. Limit to top 20
		{{Key: "$limit", Value: 20}},
	}

	cursor, err := sessionColl.Aggregate(ctx, pipeline)
	if err != nil {
		utils.LogError(w, err, "Failed to aggregate leaderboard", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var leaderboard []LeaderboardEntry
	if err := cursor.All(ctx, &leaderboard); err != nil {
		utils.LogError(w, err, "Failed to decode leaderboard", http.StatusInternalServerError)
		return
	}

	if leaderboard == nil {
		leaderboard = []LeaderboardEntry{}
	}

	json.NewEncoder(w).Encode(leaderboard)
}
