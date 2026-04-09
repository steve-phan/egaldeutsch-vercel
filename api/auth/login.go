package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"egaldeutsch-vercel/api/mock"
	"egaldeutsch-vercel/api/models"
	"egaldeutsch-vercel/api/utils"
	"egaldeutsch-vercel/db"

	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string      `json:"token"`
	User  models.User `json:"user"`
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Use mock database if mock mode is enabled
	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		mockUser, err := mockDB.ValidatePassword(req.Email, req.Password)
		if err != nil {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}

		token, err := utils.GenerateToken(mockUser.ID.Hex(), mockUser.Email)
		if err != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(LoginResponse{
			Token: token,
			User: models.User{
				ID:    mockUser.ID,
				Name:  mockUser.Name,
				Email: mockUser.Email,
			},
		})
		return
	}

	collection := db.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err := collection.FindOne(ctx, bson.M{"email": req.Email}).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	token, err := utils.GenerateToken(user.ID.Hex(), user.Email)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(LoginResponse{
		Token: token,
		User:  user,
	})
}
