package handlers

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"egaldeutsch-vercel/db"
	"egaldeutsch-vercel/utils"

	"go.mongodb.org/mongo-driver/bson"
)

type DeleteAccountRequest struct {
	Email string `json:"email"`
}

func RequestAccountDeletionHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req DeleteAccountRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	collection := db.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Generate delete token
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}
	deleteToken := hex.EncodeToString(bytes)
	deleteTokenExpiry := time.Now().Add(1 * time.Hour)

	// Update user with delete token
	filter := bson.M{"email": utils.NormalizeEmail(req.Email)}
	update := bson.M{
		"$set": bson.M{
			"delete_token":        deleteToken,
			"delete_token_expiry": deleteTokenExpiry,
		},
	}

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	if result.MatchedCount == 0 {
		// Don't reveal that the user doesn't exist
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "If an account exists, a verification link has been sent."})
		return
	}

	// Send deletion email
	appURL := os.Getenv("NEXT_PUBLIC_APP_URL")
	if appURL == "" {
		appURL = "https://egaldeutsch.com"
	}
	deleteLink := fmt.Sprintf("%s/delete-account/confirm?token=%s", appURL, deleteToken)
	
	fmt.Printf("Attempting to send account deletion email to %s with link: %s\n", req.Email, deleteLink)
	err = utils.SendAccountDeletionEmail(req.Email, deleteLink)
	if err != nil {
		fmt.Printf("Failed to send deletion email: %v\n", err)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Verification link sent."})
}

type ConfirmDeletionRequest struct {
	Token string `json:"token"`
}

func ConfirmAccountDeletionHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ConfirmDeletionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Token == "" {
		http.Error(w, "Token is required", http.StatusBadRequest)
		return
	}

	collection := db.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Find user with token and check expiry
	filter := bson.M{
		"delete_token":        req.Token,
		"delete_token_expiry": bson.M{"$gt": time.Now()},
	}

	// First find the user to log the action or clean up other data if needed
	result, err := collection.DeleteOne(ctx, filter)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "Invalid or expired token", http.StatusNotFound)
		return
	}

	fmt.Printf("Account successfully deleted using token %s\n", req.Token)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Account successfully deleted."})
}
