package handler

import (
	"encoding/json"
	"net/http"

	"egaldeutsch-vercel/mock"
	"egaldeutsch-vercel/utils"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// AdminQuestionsHandler handles CRUD operations for questions by admins
// Endpoint: /api/admin/questions
func AdminQuestionsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

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
	case http.MethodGet:
		category := r.URL.Query().Get("category")
		level := r.URL.Query().Get("level")

		if mock.IsMockMode() {
			mockDB := mock.GetMockDB()
			questions := mockDB.GetAllQuestions(category, level)
			json.NewEncoder(w).Encode(questions)
			return
		}
		// TODO: MongoDB Phase 6
		json.NewEncoder(w).Encode([]interface{}{})

	case http.MethodPost:
		var q mock.MockQuizQuestion
		if err := json.NewDecoder(r.Body).Decode(&q); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if mock.IsMockMode() {
			mockDB := mock.GetMockDB()
			created := mockDB.CreateQuestion(&q)
			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(created)
			return
		}
		// TODO: MongoDB Phase 6
		json.NewEncoder(w).Encode(map[string]interface{}{})

	case http.MethodPut:
		idStr := r.URL.Query().Get("id")
		id, err := primitive.ObjectIDFromHex(idStr)
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}

		var q mock.MockQuizQuestion
		if err := json.NewDecoder(r.Body).Decode(&q); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if mock.IsMockMode() {
			mockDB := mock.GetMockDB()
			updated, err := mockDB.UpdateQuestion(id, &q)
			if err != nil {
				http.Error(w, err.Error(), http.StatusNotFound)
				return
			}
			json.NewEncoder(w).Encode(updated)
			return
		}
		// TODO: MongoDB Phase 6
		json.NewEncoder(w).Encode(map[string]interface{}{})

	case http.MethodDelete:
		idStr := r.URL.Query().Get("id")
		id, err := primitive.ObjectIDFromHex(idStr)
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}

		if mock.IsMockMode() {
			mockDB := mock.GetMockDB()
			if err := mockDB.DeleteQuestion(id); err != nil {
				http.Error(w, err.Error(), http.StatusNotFound)
				return
			}
			w.WriteHeader(http.StatusNoContent)
			return
		}
		// TODO: MongoDB Phase 6
		w.WriteHeader(http.StatusNoContent)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
