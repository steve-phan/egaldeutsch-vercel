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

type ForgotPasswordRequest struct {
	Email string `json:"email"`
}

func ForgotPasswordHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ForgotPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	client := db.GetClient()

	collection := client.Database("egaldeutsch").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Generate reset token
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}
	resetToken := hex.EncodeToString(bytes)
	resetTokenExpiry := time.Now().Add(1 * time.Hour)

	// Update user with reset token
	filter := bson.M{"email": req.Email}
	update := bson.M{
		"$set": bson.M{
			"reset_token":        resetToken,
			"reset_token_expiry": resetTokenExpiry,
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
		json.NewEncoder(w).Encode(map[string]string{"message": "If an account exists with this email, a reset link has been sent."})
		return
	}

	// Send reset email (async)
	// In a real app, you'd want a more robust queue system
	go func() {
		resetLink := fmt.Sprintf("%s/reset-password?token=%s", os.Getenv("NEXT_PUBLIC_APP_URL"), resetToken)
		utils.SendPasswordResetEmail(req.Email, resetLink)
	}()

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "If an account exists with this email, a reset link has been sent."})
}
