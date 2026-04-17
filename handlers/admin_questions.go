package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"egaldeutsch-vercel/db"
	"egaldeutsch-vercel/mock"
	"egaldeutsch-vercel/models"
	"egaldeutsch-vercel/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// AdminQuestionsHandler handles CRUD operations for questions by admins
func AdminQuestionsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// For local testing: Admin endpoint is entirely unauthenticated.

	collection := db.GetCollection("questions")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	switch r.Method {
	case http.MethodGet:
		category := r.URL.Query().Get("category")
		level := r.URL.Query().Get("level")

		if mock.IsMockMode() {
			mockDB := mock.GetMockDB()
			questions := mockDB.GetAllQuestions(category, level)
			json.NewEncoder(w).Encode(questions)
			return
		}

		filter := bson.M{}
		if category != "" {
			filter["category"] = category
		}
		if level != "" {
			filter["level"] = level
		}

		cursor, err := collection.Find(ctx, filter)
		if err != nil {
			utils.LogError(w, err, "Failed to find questions", http.StatusInternalServerError)
			return
		}
		defer cursor.Close(ctx)

		var questions []models.QuizQuestion
		if err = cursor.All(ctx, &questions); err != nil {
			utils.LogError(w, err, "Failed to decode questions", http.StatusInternalServerError)
			return
		}

		if questions == nil {
			// Return empty array instead of null
			questions = []models.QuizQuestion{}
		}
		json.NewEncoder(w).Encode(questions)

	case http.MethodPost:
		var q models.QuizQuestion
		if err := json.NewDecoder(r.Body).Decode(&q); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if mock.IsMockMode() {
			// Mock conversion hack not needed if mock mode not used, but keep for fallback
			mockQ := mock.MockQuizQuestion{
				Category: q.Category, Level: q.Level, PromptDe: q.PromptDe,
			}
			mockDB := mock.GetMockDB()
			created := mockDB.CreateQuestion(&mockQ)
			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(created)
			return
		}

		q.ID = primitive.NewObjectID()
		if q.Status == "" {
			q.Status = "draft"
		}
		q.CreatedAt = time.Now()
		q.UpdatedAt = time.Now()

		_, err := collection.InsertOne(ctx, q)
		if err != nil {
			utils.LogError(w, err, "Failed to create question", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(q)

	case http.MethodPut:
		idStr := r.URL.Query().Get("id")
		id, err := primitive.ObjectIDFromHex(idStr)
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}

		var q models.QuizQuestion
		if err := json.NewDecoder(r.Body).Decode(&q); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if mock.IsMockMode() {
			var m mock.MockQuizQuestion
			json.Unmarshal([]byte(`{}`), &m) // Stub
			updated, _ := mock.GetMockDB().UpdateQuestion(id, &m)
			json.NewEncoder(w).Encode(updated)
			return
		}

		update := bson.M{
			"$set": bson.M{
				"category":       q.Category,
				"subcategory":    q.Subcategory,
				"level":          q.Level,
				"type":           q.Type,
				"prompt_de":      q.PromptDe,
				"prompt_en":      q.PromptEn,
				"prompt_vi":      q.PromptVi,
				"options":        q.Options,
				"correct_answer": q.CorrectAnswer,
				"explanation_de": q.ExplanationDe,
				"explanation_en": q.ExplanationEn,
				"explanation_vi": q.ExplanationVi,
				"hint_de":        q.HintDe,
				"hint_en":        q.HintEn,
				"hint_vi":        q.HintVi,
				"blank_index":    q.BlankIndex,
				"tags":           q.Tags,
				"status":         q.Status,
				"updated_at":     time.Now(),
			},
		}

		_, err = collection.UpdateOne(ctx, bson.M{"_id": id}, update)
		if err != nil {
			utils.LogError(w, err, "Failed to update question", http.StatusInternalServerError)
			return
		}

		// fetch updated
		var updated models.QuizQuestion
		collection.FindOne(ctx, bson.M{"_id": id}).Decode(&updated)
		json.NewEncoder(w).Encode(updated)

	case http.MethodDelete:
		idStr := r.URL.Query().Get("id")
		id, err := primitive.ObjectIDFromHex(idStr)
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}

		if mock.IsMockMode() {
			if err := mock.GetMockDB().DeleteQuestion(id); err != nil {
				http.Error(w, err.Error(), http.StatusNotFound)
				return
			}
			w.WriteHeader(http.StatusNoContent)
			return
		}

		result, err := collection.DeleteOne(ctx, bson.M{"_id": id})
		if err != nil || result.DeletedCount == 0 {
			utils.LogError(w, err, "Failed to delete question or not found", http.StatusInternalServerError)
			return
		}
		
		w.WriteHeader(http.StatusNoContent)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
