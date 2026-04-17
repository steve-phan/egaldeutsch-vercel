package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"egaldeutsch-vercel/db"
	"egaldeutsch-vercel/mock"
	"egaldeutsch-vercel/models"
	"egaldeutsch-vercel/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type QuizSubmitRequest struct {
	Category string  `json:"category"`
	Level    string  `json:"level"`
	Score    float64 `json:"score"`
	TotalQ   int     `json:"total_q"`
	CorrectQ int     `json:"correct_q"`
}

// QuizQuestionsHandler handles GET /api/quiz/questions
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

	collection := db.GetCollection("questions")
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	matchStage := bson.M{}
	if category != "" {
		matchStage["category"] = category
	}
	if level != "" {
		matchStage["level"] = level
	}

	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: matchStage}},
		{{Key: "$sample", Value: bson.M{"size": limit}}},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		utils.LogError(w, err, "Failed to aggregate questions", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var questions []models.QuizQuestion
	if err = cursor.All(ctx, &questions); err != nil {
		utils.LogError(w, err, "Failed to decode questions", http.StatusInternalServerError)
		return
	}

	if questions == nil {
		questions = []models.QuizQuestion{}
	}

	json.NewEncoder(w).Encode(questions)
}

// QuizCategoriesHandler handles GET /api/quiz/categories
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

	collection := db.GetCollection("questions")
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	// Pipeline: Group By Category and Level
	pipeline := mongo.Pipeline{
		{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: bson.D{
				{Key: "category", Value: "$category"},
				{Key: "level", Value: "$level"},
			}},
			{Key: "count", Value: bson.D{{Key: "$sum", Value: 1}}},
		}}},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var results []bson.M
	if err = cursor.All(ctx, &results); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Marshall into the map[string]map[string]int expected by the dashboard UI
	stats := make(map[string]map[string]int)
	for _, result := range results {
		idDoc := result["_id"].(bson.M)
		cat := idDoc["category"].(string)
		lvl := idDoc["level"].(string)
		count := int(result["count"].(int32))

		if stats[cat] == nil {
			stats[cat] = make(map[string]int)
		}
		stats[cat][lvl] = count
	}

	json.NewEncoder(w).Encode(stats)
}

// QuizSubmitHandler handles POST /api/quiz/submit
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

	// Optional User ID via JWT
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

	collection := db.GetCollection("sessions")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	session := models.QuizSession{
		ID:          primitive.NewObjectID(),
		UserID:      userID,
		Category:    req.Category,
		Level:       req.Level,
		Score:       req.Score,
		TotalQ:      req.TotalQ,
		CorrectQ:    req.CorrectQ,
		CompletedAt: time.Now(),
	}

	_, iErr := collection.InsertOne(ctx, session)
	if iErr != nil {
		http.Error(w, "Failed to record session", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(session)
}
