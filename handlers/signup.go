package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"egaldeutsch-vercel/db"
	"egaldeutsch-vercel/mock"
	"egaldeutsch-vercel/models"
	"egaldeutsch-vercel/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type SignupRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Language string `json:"language"`
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

	userEmail := utils.NormalizeEmail(req.Email)

	// Use mock database if mock mode is enabled
	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		_, err := mockDB.CreateUser(req.Name, userEmail, req.Password)
		if err != nil {
			if err == mock.ErrAlreadyExists {
				http.Error(w, "User already exists", http.StatusConflict)
				return
			}
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			return
		}

		// Send welcome email (synchronous for serverless reliability)
		fmt.Printf("Attempting to send welcome email (mock) to %s...\n", userEmail)
		err = utils.SendWelcomeEmail(userEmail, req.Name)
		if err != nil {
			fmt.Printf("Failed to send welcome email (mock) to %s: %v\n", userEmail, err)
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully"})
		return
	}

	collection := db.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check if user exists
	count, err := collection.CountDocuments(ctx, bson.M{"email": userEmail})
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

	// Set language with a default of "en" if not provided
	lang := req.Language
	if lang == "" {
		lang = "en"
	}

	user := models.User{
		ID:       primitive.NewObjectID(),
		Name:     req.Name,
		Email:    userEmail,
		Password: string(hashedPassword),
		Language: lang,
	}

	_, err = collection.InsertOne(ctx, user)
	if err != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	// Send welcome email (synchronous for serverless reliability)
	fmt.Printf("Attempting to send welcome email to %s...\n", user.Email)
	err = utils.SendWelcomeEmail(user.Email, user.Name)
	if err != nil {
		fmt.Printf("Failed to send welcome email to %s: %v\n", user.Email, err)
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully"})
}
