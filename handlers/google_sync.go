package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"egaldeutsch-vercel/db"
	"egaldeutsch-vercel/models"
	"egaldeutsch-vercel/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type GoogleSyncRequest struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

func GoogleSyncHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req GoogleSyncRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Email == "" || req.Name == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	collection := db.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check if user exists
	var existingUser models.User
	err := collection.FindOne(ctx, bson.M{"email": req.Email}).Decode(&existingUser)

	if err == nil {
		// User already exists, just return success
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "User already synchronized",
			"user":    existingUser,
		})
		return
	}

	// User doesn't exist, create new record
	newUser := models.User{
		ID:         primitive.NewObjectID(),
		Name:       req.Name,
		Email:      req.Email,
		Role:       "student",
		AuthSource: "google",
	}

	_, err = collection.InsertOne(ctx, newUser)
	if err != nil {
		http.Error(w, "Failed to synchronize user", http.StatusInternalServerError)
		return
	}

	// Trigger welcome email (first time only)
	go func() {
		utils.SendWelcomeEmail(newUser.Email, newUser.Name)
	}()

	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "User created and welcome email triggered",
		"user":    newUser,
	})
}
