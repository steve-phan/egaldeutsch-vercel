package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
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
	Category    string   `json:"category"`
	Level       string   `json:"level"`
	Score       float64  `json:"score"`
	TotalQ      int      `json:"total_q"`
	CorrectQ    int      `json:"correct_q"`
	QuestionIDs []string `json:"question_ids"`
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
	mode := r.URL.Query().Get("mode")
	limitStr := r.URL.Query().Get("limit")
	limit := 10 // Default

	if mode == "test" || mode == "practice" {
		limit = 30
	}
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
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
		questions := mockDB.GetQuestions(category, level, limit)
		json.NewEncoder(w).Encode(questions)
		return
	}

	var questions []models.QuizQuestion
	if mode == "test" {
		questions, err = fetchBalancedQuestions("", limit, userID)
	} else {
		questions, err = fetchQuestions(category, level, limit, userID)
	}

	if err != nil {
		utils.LogError(w, err, "Failed to fetch questions", http.StatusInternalServerError)
		return
	}

	if questions == nil {
		questions = []models.QuizQuestion{}
	}

	json.NewEncoder(w).Encode(questions)
}

func fetchQuestions(category, level string, limit int, userID *primitive.ObjectID) ([]models.QuizQuestion, error) {
	collection := db.GetCollection("questions")
	sessionColl := db.GetCollection("sessions")
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	matchStage := bson.M{}
	if category != "" {
		matchStage["category"] = category
	}
	if level != "" {
		matchStage["level"] = level
	}

	if userID != nil {
		filter := bson.M{"user_id": userID}
		if category != "" {
			filter["category"] = category
		}

		cursor, err := sessionColl.Find(ctx, filter)
		if err == nil {
			var sessions []models.QuizSession
			if err = cursor.All(ctx, &sessions); err == nil {
				answeredIDs := []primitive.ObjectID{}
				for _, s := range sessions {
					answeredIDs = append(answeredIDs, s.QuestionIDs...)
				}

				if len(answeredIDs) > 0 {
					matchStage["_id"] = bson.M{"$nin": answeredIDs}
				}
			}
		}
	}

	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: matchStage}},
		{{Key: "$sample", Value: bson.M{"size": limit}}},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var questions []models.QuizQuestion
	if err = cursor.All(ctx, &questions); err != nil {
		return nil, err
	}

	if len(questions) == 0 && userID != nil && matchStage["_id"] != nil {
		delete(matchStage, "_id")
		pipeline = mongo.Pipeline{
			{{Key: "$match", Value: matchStage}},
			{{Key: "$sample", Value: bson.M{"size": limit}}},
		}
		cursor, err = collection.Aggregate(ctx, pipeline)
		if err == nil {
			defer cursor.Close(ctx)
			cursor.All(ctx, &questions)
		}
	}

	return filterValidQuestions(questions), nil
}

func filterValidQuestions(questions []models.QuizQuestion) []models.QuizQuestion {
	valid := make([]models.QuizQuestion, 0, len(questions))
	for _, q := range questions {
		// Basic validation
		if q.PromptDe == "" || q.CorrectAnswer == "" || q.Type == "" {
			continue
		}

		// Normalize type (handle multiple_choice underscore)
		if q.Type == "multiple_choice" {
			q.Type = "multiple-choice"
		}

		// Type-specific validation
		isValid := true
		switch q.Type {
		case "multiple-choice":
			if len(q.Options) < 2 {
				isValid = false
			}
		case "matching":
			if len(q.Options) < 2 {
				isValid = false
			}
		case "word-order":
			// Ensure there are at least 2 words
			words := strings.Fields(q.CorrectAnswer)
			if len(words) < 2 {
				isValid = false
			}
		}

		if isValid {
			valid = append(valid, q)
		}
	}
	return valid
}

func fetchBalancedQuestions(category string, totalLimit int, userID *primitive.ObjectID) ([]models.QuizQuestion, error) {
	levels := []string{"A1", "A2", "B1", "B2"}
	perLevel := totalLimit / len(levels)
	if perLevel == 0 {
		perLevel = 1
	}

	var allQuestions []models.QuizQuestion
	for _, level := range levels {
		qs, err := fetchQuestions(category, level, perLevel, userID)
		if err != nil {
			continue
		}
		allQuestions = append(allQuestions, qs...)
	}

	if len(allQuestions) < totalLimit {
		needed := totalLimit - len(allQuestions)
		qs, _ := fetchQuestions(category, "", needed, userID)
		allQuestions = append(allQuestions, qs...)
	}

	if len(allQuestions) > totalLimit {
		allQuestions = allQuestions[:totalLimit]
	}

	return allQuestions, nil
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

	var req struct {
		Category    string   `json:"category"`
		Level       string   `json:"level"`
		Mode        string   `json:"mode"`
		Score       float64  `json:"score"`
		TotalQ      int      `json:"total_q"`
		CorrectQ    int      `json:"correct_q"`
		QuestionIDs []string `json:"question_ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// MANDATORY User ID for sessions
	claims, err := utils.GetClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized: Login required to save session", http.StatusUnauthorized)
		return
	}

	userID, err := primitive.ObjectIDFromHex(claims.UserID)
	if err != nil {
		http.Error(w, "Invalid user ID in token", http.StatusBadRequest)
		return
	}

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		session := &mock.MockQuizSession{
			UserID:   &userID,
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

	// Convert string IDs to ObjectIDs
	objIDs := make([]primitive.ObjectID, 0, len(req.QuestionIDs))
	for _, idStr := range req.QuestionIDs {
		if oid, err := primitive.ObjectIDFromHex(idStr); err == nil {
			objIDs = append(objIDs, oid)
		}
	}

	estimatedLevel := ""
	if req.Mode == "test" {
		if req.Score >= 85 {
			estimatedLevel = "B2"
		} else if req.Score >= 70 {
			estimatedLevel = "B1"
		} else if req.Score >= 50 {
			estimatedLevel = "A2"
		} else {
			estimatedLevel = "A1"
		}
	}

	session := models.QuizSession{
		ID:             primitive.NewObjectID(),
		UserID:         &userID,
		Category:       req.Category,
		Level:          req.Level,
		Mode:           req.Mode,
		Score:          req.Score,
		TotalQ:         req.TotalQ,
		CorrectQ:       req.CorrectQ,
		QuestionIDs:    objIDs,
		EstimatedLevel: estimatedLevel,
		CompletedAt:    time.Now(),
	}

	_, iErr := collection.InsertOne(ctx, session)
	if iErr != nil {
		http.Error(w, "Failed to record session", http.StatusInternalServerError)
		return
	}

	// Trigger Mastery Notification for high scores
	if req.Score >= 90 {
		title := "Mission Accomplished!"
		desc := "You've successfully mastered the '" + req.Category + "' module with perfect precision."
		if req.Score < 100 {
			title = "Great Progress!"
			desc = "You're getting closer to mastery in '" + req.Category + "'! Keep it up."
		}

		utils.CreateNotification(*session.UserID, title, desc, "achievement", "/notifications")
	}

	json.NewEncoder(w).Encode(session)
}
