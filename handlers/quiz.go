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

	// Normalize "mixed" values to empty strings for filtering
	if category == "mixed" {
		category = ""
	}
	if level == "mixed" {
		level = ""
	}

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

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		questions := mockDB.GetQuestions(category, level, limit)
		json.NewEncoder(w).Encode(questions)
		return
	}

	var questions []models.QuizQuestion
	if mode == "test" {
		questions, err = fetchBalancedQuestions(ctx, category, limit, userID)
	} else {
		questions, err = fetchQuestions(ctx, category, level, limit, userID, nil)
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

func getAnsweredIDs(ctx context.Context, userID *primitive.ObjectID, category string) []primitive.ObjectID {
	sessionColl := db.GetCollection("sessions")
	filter := bson.M{"user_id": userID}
	if category != "" {
		filter["category"] = category
	}

	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: filter}},
		{{Key: "$unwind", Value: "$question_ids"}},
		{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: nil},
			{Key: "ids", Value: bson.D{{Key: "$addToSet", Value: "$question_ids"}}},
		}}},
	}

	cursor, err := sessionColl.Aggregate(ctx, pipeline)
	if err != nil {
		return nil
	}
	defer cursor.Close(ctx)

	var result []struct {
		IDs []primitive.ObjectID `bson:"ids"`
	}
	if err = cursor.All(ctx, &result); err != nil || len(result) == 0 {
		return nil
	}

	return result[0].IDs
}

func fetchQuestions(ctx context.Context, category, level string, limit int, userID *primitive.ObjectID, excludeIDs []primitive.ObjectID) ([]models.QuizQuestion, error) {
	collection := db.GetCollection("questions")

	matchStage := bson.M{}
	if category != "" {
		if strings.Contains(category, ",") {
			cats := strings.Split(category, ",")
			matchStage["category"] = bson.M{"$in": cats}
		} else {
			matchStage["category"] = category
		}
	}
	if level != "" {
		matchStage["level"] = level
	}

	// Combine answering filtering and manual exclusion
	allExclude := excludeIDs
	if userID != nil {
		answered := getAnsweredIDs(ctx, userID, category)
		if len(answered) > 0 {
			allExclude = append(allExclude, answered...)
		}
	}

	if len(allExclude) > 0 {
		matchStage["_id"] = bson.M{"$nin": allExclude}
	}

	// Ensure we only process documents with a prompt to avoid aggregation errors
	matchStage["prompt_de"] = bson.M{"$exists": true, "$type": "string"}

	// Variety logic: group by prompt prefix to avoid too many similar templates in one go
	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: matchStage}},
		{{Key: "$addFields", Value: bson.M{
			"prompt_prefix": bson.M{"$substrCP": bson.A{"$prompt_de", 0, 15}},
		}}},
		{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$prompt_prefix"},
			{Key: "doc", Value: bson.D{{Key: "$first", Value: "$$ROOT"}}},
		}}},
		{{Key: "$replaceRoot", Value: bson.M{"newRoot": "$doc"}}},
		{{Key: "$sample", Value: bson.M{"size": limit}}},
	}

	var questions []models.QuizQuestion
	cursor, err := collection.Aggregate(ctx, pipeline)
	if err == nil {
		defer cursor.Close(ctx)
		if err = cursor.All(ctx, &questions); err != nil {
			questions = []models.QuizQuestion{}
		}
	}

	// Fallback if pool is exhausted by variety/exclusion
	if len(questions) < limit {
		fallbackMatch := bson.M{}
		if category != "" {
			fallbackMatch["category"] = category
		}
		if level != "" {
			fallbackMatch["level"] = level
		}

		pipeline = mongo.Pipeline{
			{{Key: "$match", Value: fallbackMatch}},
			{{Key: "$sample", Value: bson.M{"size": limit}}},
		}
		cursor, err = collection.Aggregate(ctx, pipeline)
		if err == nil {
			defer cursor.Close(ctx)
			var fallbackQs []models.QuizQuestion
			if err = cursor.All(ctx, &fallbackQs); err == nil && len(fallbackQs) > 0 {
				seen := make(map[string]bool)
				for _, q := range questions {
					seen[q.ID.Hex()] = true
				}
				for _, q := range fallbackQs {
					if !seen[q.ID.Hex()] && len(questions) < limit {
						questions = append(questions, q)
						seen[q.ID.Hex()] = true
					}
				}
			}
		}
	}

	validQs := filterValidQuestions(questions)
	return validQs, nil
}

func filterValidQuestions(questions []models.QuizQuestion) []models.QuizQuestion {
	valid := make([]models.QuizQuestion, 0, len(questions))
	for _, q := range questions {
		if err := q.Validate(); err != nil {
			// Skip invalid questions
			continue
		}
		valid = append(valid, q)
	}
	return valid
}

func fetchBalancedQuestions(ctx context.Context, category string, totalLimit int, userID *primitive.ObjectID) ([]models.QuizQuestion, error) {
	levels := []string{"A1", "A2", "B1", "B2", "C1"}
	perLevel := totalLimit / len(levels)
	if perLevel == 0 {
		perLevel = 1
	}

	var allQuestions []models.QuizQuestion
	var excludeIDs []primitive.ObjectID

	for _, level := range levels {
		qs, err := fetchQuestions(ctx, category, level, perLevel, userID, excludeIDs)
		if err != nil {
			continue
		}
		allQuestions = append(allQuestions, qs...)

		// Update exclusions to prevent duplicates across level segments
		for _, q := range qs {
			excludeIDs = append(excludeIDs, q.ID)
		}
	}

	if len(allQuestions) < totalLimit {
		needed := totalLimit - len(allQuestions)
		qs, _ := fetchQuestions(ctx, category, "", needed, userID, excludeIDs)
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
