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
		// User already exists, generate a fresh token
		token, tokenErr := utils.GenerateToken(existingUser.ID.Hex(), existingUser.Email, existingUser.Role)
		if tokenErr != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}

		// User already exists, return success with token
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "User already synchronized",
			"user":    existingUser,
			"token":   token,
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
		Language:   "en",
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

	// Trigger welcome notification
	utils.CreateNotification(newUser.ID, "Willkommen bei EgalDeutsch!", "Du hast dein Mastery-Konto erfolgreich erstellt. Starte deinen ersten Quiz, um deinen Fortschritt zu verfolgen!", "system", "/")

	// Generate token for new user
	token, tokenErr := utils.GenerateToken(newUser.ID.Hex(), newUser.Email, newUser.Role)
	if tokenErr != nil {
		// Even if token fails, user was created. But for consistency we return error.
		http.Error(w, "User created but failed to generate token", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "User created and welcome email triggered",
		"user":    newUser,
		"token":   token,
	})
}
