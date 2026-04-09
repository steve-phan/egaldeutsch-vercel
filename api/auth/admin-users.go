package handler

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

// AdminUsersHandler handles admin operations on users
// GET - list all users
// DELETE with id query param - delete user
func AdminUsersHandler(w http.ResponseWriter, r *http.Request) {
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
	case http.MethodGet:
		listAllUsers(w)
	case http.MethodDelete:
		deleteUser(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func listAllUsers(w http.ResponseWriter) {
	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		mockUsers := mockDB.GetAllUsers()

		users := make([]UserResponse, 0, len(mockUsers))
		for _, u := range mockUsers {
			users = append(users, UserResponse{
				ID:        u.ID.Hex(),
				Name:      u.Name,
				Email:     u.Email,
				Role:      u.Role,
				CreatedAt: u.CreatedAt,
			})
		}

		json.NewEncoder(w).Encode(users)
		return
	}

	collection := db.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var users []models.User
	if err = cursor.All(ctx, &users); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := make([]UserResponse, 0, len(users))
	for _, u := range users {
		response = append(response, UserResponse{
			ID:    u.ID.Hex(),
			Name:  u.Name,
			Email: u.Email,
		})
	}

	json.NewEncoder(w).Encode(response)
}

func deleteUser(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.URL.Query().Get("id")
	if userIDStr == "" {
		http.Error(w, "User ID required", http.StatusBadRequest)
		return
	}

	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		err := mockDB.DeleteUser(userID)
		if err != nil {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}

		json.NewEncoder(w).Encode(map[string]string{"message": "User deleted successfully"})
		return
	}

	collection := db.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := collection.DeleteOne(ctx, bson.M{"_id": userID})
	if err != nil {
		http.Error(w, "Failed to delete user", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "User deleted successfully"})
}
