package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"egaldeutsch-vercel/api/db"
	"egaldeutsch-vercel/api/mock"
	"egaldeutsch-vercel/api/models"
	"egaldeutsch-vercel/api/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserResponse struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Role      string    `json:"role,omitempty"`
	CreatedAt time.Time `json:"created_at,omitempty"`
}

type UpdateUserRequest struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password"`
	NewPassword     string `json:"new_password"`
}

// UserHandler handles GET (profile), PUT (update profile)
func UserHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get user from token
	claims, err := utils.GetClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	switch r.Method {
	case http.MethodGet:
		getUserProfile(w, claims)
	case http.MethodPut:
		updateUserProfile(w, r, claims)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getUserProfile(w http.ResponseWriter, claims *utils.Claims) {
	userID, err := primitive.ObjectIDFromHex(claims.UserID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		mockUser, err := mockDB.GetUserByID(userID)
		if err != nil {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}

		json.NewEncoder(w).Encode(UserResponse{
			ID:        mockUser.ID.Hex(),
			Name:      mockUser.Name,
			Email:     mockUser.Email,
			Role:      mockUser.Role,
			CreatedAt: mockUser.CreatedAt,
		})
		return
	}

	collection := db.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err = collection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(UserResponse{
		ID:    user.ID.Hex(),
		Name:  user.Name,
		Email: user.Email,
	})
}

func updateUserProfile(w http.ResponseWriter, r *http.Request, claims *utils.Claims) {
	userID, err := primitive.ObjectIDFromHex(claims.UserID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	var req UpdateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Name == "" || req.Email == "" {
		http.Error(w, "Name and email are required", http.StatusBadRequest)
		return
	}

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		mockUser, err := mockDB.UpdateUser(userID, req.Name, req.Email)
		if err != nil {
			if err == mock.ErrAlreadyExists {
				http.Error(w, "Email already in use", http.StatusConflict)
				return
			}
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}

		json.NewEncoder(w).Encode(UserResponse{
			ID:        mockUser.ID.Hex(),
			Name:      mockUser.Name,
			Email:     mockUser.Email,
			Role:      mockUser.Role,
			CreatedAt: mockUser.CreatedAt,
		})
		return
	}

	collection := db.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check if email is taken by another user
	count, err := collection.CountDocuments(ctx, bson.M{"email": req.Email, "_id": bson.M{"$ne": userID}})
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	if count > 0 {
		http.Error(w, "Email already in use", http.StatusConflict)
		return
	}

	update := bson.M{
		"$set": bson.M{
			"name":  req.Name,
			"email": req.Email,
		},
	}

	_, err = collection.UpdateOne(ctx, bson.M{"_id": userID}, update)
	if err != nil {
		http.Error(w, "Failed to update user", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "User updated successfully"})
}
