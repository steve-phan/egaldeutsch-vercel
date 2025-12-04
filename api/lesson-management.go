package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"egaldeutsch-vercel/api/db"
	"egaldeutsch-vercel/api/mock"
	"egaldeutsch-vercel/api/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CreateLessonRequest struct {
	Title         string   `json:"title"`
	Description   string   `json:"description"`
	AudioURL      string   `json:"audio_url"`
	Transcript    string   `json:"transcript"`
	QuizQuestion  string   `json:"quiz_question"`
	QuizOptions   []string `json:"quiz_options"`
	CorrectAnswer string   `json:"correct_answer"`
}

type LessonManagementResponse struct {
	ID            string    `json:"id"`
	Title         string    `json:"title"`
	Description   string    `json:"description"`
	AudioURL      string    `json:"audio_url"`
	Transcript    string    `json:"transcript"`
	QuizQuestion  string    `json:"quiz_question"`
	QuizOptions   []string  `json:"quiz_options"`
	CorrectAnswer string    `json:"correct_answer"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// LessonManagementHandler handles CRUD operations for lessons (admin only)
// POST - create lesson
// PUT - update lesson (requires id query param)
// DELETE - delete lesson (requires id query param)
func LessonManagementHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get user from token
	claims, err := utils.GetClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Verify admin role (in mock mode)
	if mock.IsMockMode() {
		userID, _ := primitive.ObjectIDFromHex(claims.UserID)
		mockDB := mock.GetMockDB()
		user, err := mockDB.GetUserByID(userID)
		if err != nil || user.Role != "admin" {
			http.Error(w, "Forbidden: Admin access required", http.StatusForbidden)
			return
		}
	}

	switch r.Method {
	case http.MethodPost:
		createLesson(w, r)
	case http.MethodPut:
		updateLesson(w, r)
	case http.MethodDelete:
		deleteLesson(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func createLesson(w http.ResponseWriter, r *http.Request) {
	var req CreateLessonRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Title == "" || req.Description == "" {
		http.Error(w, "Title and description are required", http.StatusBadRequest)
		return
	}

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		lesson, err := mockDB.CreateLesson(
			req.Title,
			req.Description,
			req.AudioURL,
			req.Transcript,
			req.QuizQuestion,
			req.QuizOptions,
			req.CorrectAnswer,
		)
		if err != nil {
			http.Error(w, "Failed to create lesson", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(LessonManagementResponse{
			ID:            lesson.ID.Hex(),
			Title:         lesson.Title,
			Description:   lesson.Description,
			AudioURL:      lesson.AudioURL,
			Transcript:    lesson.Transcript,
			QuizQuestion:  lesson.QuizQuestion,
			QuizOptions:   lesson.QuizOptions,
			CorrectAnswer: lesson.CorrectAnswer,
			CreatedAt:     lesson.CreatedAt,
			UpdatedAt:     lesson.UpdatedAt,
		})
		return
	}

	collection := db.GetCollection("lessons")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	now := time.Now()
	lesson := bson.M{
		"title":          req.Title,
		"description":    req.Description,
		"audio_url":      req.AudioURL,
		"transcript":     req.Transcript,
		"quiz_question":  req.QuizQuestion,
		"quiz_options":   req.QuizOptions,
		"correct_answer": req.CorrectAnswer,
		"created_at":     now,
		"updated_at":     now,
	}

	result, err := collection.InsertOne(ctx, lesson)
	if err != nil {
		http.Error(w, "Failed to create lesson", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":      result.InsertedID.(primitive.ObjectID).Hex(),
		"message": "Lesson created successfully",
	})
}

func updateLesson(w http.ResponseWriter, r *http.Request) {
	lessonIDStr := r.URL.Query().Get("id")
	if lessonIDStr == "" {
		http.Error(w, "Lesson ID required", http.StatusBadRequest)
		return
	}

	lessonID, err := primitive.ObjectIDFromHex(lessonIDStr)
	if err != nil {
		http.Error(w, "Invalid lesson ID", http.StatusBadRequest)
		return
	}

	var req CreateLessonRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		lesson, err := mockDB.UpdateLesson(
			lessonID,
			req.Title,
			req.Description,
			req.AudioURL,
			req.Transcript,
			req.QuizQuestion,
			req.QuizOptions,
			req.CorrectAnswer,
		)
		if err != nil {
			http.Error(w, "Lesson not found", http.StatusNotFound)
			return
		}

		json.NewEncoder(w).Encode(LessonManagementResponse{
			ID:            lesson.ID.Hex(),
			Title:         lesson.Title,
			Description:   lesson.Description,
			AudioURL:      lesson.AudioURL,
			Transcript:    lesson.Transcript,
			QuizQuestion:  lesson.QuizQuestion,
			QuizOptions:   lesson.QuizOptions,
			CorrectAnswer: lesson.CorrectAnswer,
			CreatedAt:     lesson.CreatedAt,
			UpdatedAt:     lesson.UpdatedAt,
		})
		return
	}

	collection := db.GetCollection("lessons")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	update := bson.M{
		"$set": bson.M{
			"title":          req.Title,
			"description":    req.Description,
			"audio_url":      req.AudioURL,
			"transcript":     req.Transcript,
			"quiz_question":  req.QuizQuestion,
			"quiz_options":   req.QuizOptions,
			"correct_answer": req.CorrectAnswer,
			"updated_at":     time.Now(),
		},
	}

	result, err := collection.UpdateOne(ctx, bson.M{"_id": lessonID}, update)
	if err != nil {
		http.Error(w, "Failed to update lesson", http.StatusInternalServerError)
		return
	}

	if result.MatchedCount == 0 {
		http.Error(w, "Lesson not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Lesson updated successfully"})
}

func deleteLesson(w http.ResponseWriter, r *http.Request) {
	lessonIDStr := r.URL.Query().Get("id")
	if lessonIDStr == "" {
		http.Error(w, "Lesson ID required", http.StatusBadRequest)
		return
	}

	lessonID, err := primitive.ObjectIDFromHex(lessonIDStr)
	if err != nil {
		http.Error(w, "Invalid lesson ID", http.StatusBadRequest)
		return
	}

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		err := mockDB.DeleteLesson(lessonID)
		if err != nil {
			http.Error(w, "Lesson not found", http.StatusNotFound)
			return
		}

		json.NewEncoder(w).Encode(map[string]string{"message": "Lesson deleted successfully"})
		return
	}

	collection := db.GetCollection("lessons")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := collection.DeleteOne(ctx, bson.M{"_id": lessonID})
	if err != nil {
		http.Error(w, "Failed to delete lesson", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "Lesson not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Lesson deleted successfully"})
}
