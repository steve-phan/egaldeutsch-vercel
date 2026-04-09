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
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type SignupRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func SignupHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req SignupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Email == "" || req.Password == "" || req.Name == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	// Use mock database if mock mode is enabled
	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		_, err := mockDB.CreateUser(req.Name, req.Email, req.Password)
		if err != nil {
			if err == mock.ErrAlreadyExists {
				http.Error(w, "User already exists", http.StatusConflict)
				return
			}
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			return
		}

		// Send welcome email (async)
		go func() {
			utils.SendWelcomeEmail(req.Email, req.Name)
		}()

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully"})
		return
	}

	collection := db.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check if user exists
	count, err := collection.CountDocuments(ctx, bson.M{"email": req.Email})
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	if count > 0 {
		http.Error(w, "User already exists", http.StatusConflict)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	user := models.User{
		ID:       primitive.NewObjectID(),
		Name:     req.Name,
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	_, err = collection.InsertOne(ctx, user)
	if err != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	// Send welcome email (async)
	go func() {
		utils.SendWelcomeEmail(user.Email, user.Name)
	}()

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully"})
}
