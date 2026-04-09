package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"egaldeutsch-vercel/db"
	"egaldeutsch-vercel/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	// Enable CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Parse ID from query parameters if present
	id := r.URL.Query().Get("id")

	switch r.Method {
	case http.MethodGet:
		if id != "" {
			handleGetExplanationQuizByID(w, r, id)
		} else {
			handleGetExplanationQuizzes(w, r)
		}
	case http.MethodPost:
		handleCreateExplanationQuiz(w, r)
	case http.MethodPut:
		if id != "" {
			handleUpdateExplanationQuiz(w, r, id)
		} else {
			http.Error(w, "ID required for update", http.StatusBadRequest)
		}
	case http.MethodDelete:
		if id != "" {
			handleDeleteExplanationQuiz(w, r, id)
		} else {
			http.Error(w, "ID required for delete", http.StatusBadRequest)
		}
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// GET /api/explanation-quiz - List all quizzes
func handleGetExplanationQuizzes(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	collection := db.GetCollection("explanation_quizzes")
	opts := options.Find().SetSort(bson.M{"created_at": -1})

	cursor, err := collection.Find(context.Background(), bson.M{}, opts)
	if err != nil {
		http.Error(w, "Failed to fetch quizzes", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	var quizzes []models.ExplanationQuiz
	if err = cursor.All(context.Background(), &quizzes); err != nil {
		http.Error(w, "Failed to parse quizzes", http.StatusInternalServerError)
		return
	}

	if quizzes == nil {
		quizzes = []models.ExplanationQuiz{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(quizzes)
}

// GET /api/explanation-quiz/:id - Get single quiz
func handleGetExplanationQuizByID(w http.ResponseWriter, r *http.Request, id string) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, "Invalid quiz ID", http.StatusBadRequest)
		return
	}

	collection := db.GetCollection("explanation_quizzes")
	var quiz models.ExplanationQuiz
	err = collection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&quiz)
	if err != nil {
		http.Error(w, "Quiz not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(quiz)
}

// POST /api/explanation-quiz - Create new quiz
func handleCreateExplanationQuiz(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.CreateExplanationQuizRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Question == "" || req.Category == "" || len(req.Options) == 0 {
		http.Error(w, "Question, category, and options are required", http.StatusBadRequest)
		return
	}

	// Ensure at least one correct answer
	hasCorrect := false
	for _, opt := range req.Options {
		if opt.IsCorrect {
			hasCorrect = true
			break
		}
	}
	if !hasCorrect {
		http.Error(w, "At least one option must be marked as correct", http.StatusBadRequest)
		return
	}

	// Generate IDs for options
	newOptions := make([]models.QuizOption, len(req.Options))
	for i, opt := range req.Options {
		if opt.ID.IsZero() {
			opt.ID = primitive.NewObjectID()
		}
		newOptions[i] = opt
	}

	quiz := models.ExplanationQuiz{
		ID:        primitive.NewObjectID(),
		Title:     req.Title,
		Question:  req.Question,
		Context:   req.Context,
		Category:  req.Category,
		Options:   newOptions,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	collection := db.GetCollection("explanation_quizzes")
	result, err := collection.InsertOne(context.Background(), quiz)
	if err != nil {
		http.Error(w, "Failed to create quiz", http.StatusInternalServerError)
		return
	}

	quiz.ID = result.InsertedID.(primitive.ObjectID)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(quiz)
}

// PUT /api/explanation-quiz/:id - Update quiz
func handleUpdateExplanationQuiz(w http.ResponseWriter, r *http.Request, id string) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, "Invalid quiz ID", http.StatusBadRequest)
		return
	}

	var req models.UpdateExplanationQuizRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	update := bson.M{
		"updated_at": time.Now(),
	}

	if req.Title != "" {
		update["title"] = req.Title
	}
	if req.Question != "" {
		update["question"] = req.Question
	}
	if req.Context != "" {
		update["context"] = req.Context
	}
	if req.Category != "" {
		update["category"] = req.Category
	}
	if len(req.Options) > 0 {
		update["options"] = req.Options
	}

	collection := db.GetCollection("explanation_quizzes")
	result := collection.FindOneAndUpdate(
		context.Background(),
		bson.M{"_id": objectID},
		bson.M{"$set": update},
		options.FindOneAndUpdate().SetReturnDocument(options.After),
	)

	if result.Err() != nil {
		http.Error(w, "Quiz not found", http.StatusNotFound)
		return
	}

	var updatedQuiz models.ExplanationQuiz
	if err := result.Decode(&updatedQuiz); err != nil {
		http.Error(w, "Failed to decode updated quiz", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedQuiz)
}

// DELETE /api/explanation-quiz/:id - Delete quiz
func handleDeleteExplanationQuiz(w http.ResponseWriter, r *http.Request, id string) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, "Invalid quiz ID", http.StatusBadRequest)
		return
	}

	collection := db.GetCollection("explanation_quizzes")
	result, err := collection.DeleteOne(context.Background(), bson.M{"_id": objectID})
	if err != nil {
		http.Error(w, "Failed to delete quiz", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "Quiz not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Quiz deleted successfully"})
}
