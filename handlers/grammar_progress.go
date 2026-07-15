package handlers

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

type grammarProgressPayload struct {
	Chapters     map[string]models.GrammarChapterProgress `json:"chapters"`
	LastReadSlug string                                   `json:"last_read_slug,omitempty"`
}

func GrammarProgressHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	claims, err := utils.GetClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	userID, err := primitive.ObjectIDFromHex(claims.UserID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodGet:
		getGrammarProgress(w, userID)
	case http.MethodPut:
		updateGrammarProgress(w, r, userID)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getGrammarProgress(w http.ResponseWriter, userID primitive.ObjectID) {
	if mock.IsMockMode() {
		progress, err := mock.GetMockDB().GetGrammarProgress(userID)
		if err != nil {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(progress)
		return
	}

	collection := db.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err := collection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	progress := user.GrammarProgress
	if progress == nil {
		progress = &models.GrammarProgress{Chapters: map[string]models.GrammarChapterProgress{}}
	}
	if progress.Chapters == nil {
		progress.Chapters = map[string]models.GrammarChapterProgress{}
	}

	json.NewEncoder(w).Encode(progress)
}

func updateGrammarProgress(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	var payload grammarProgressPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if payload.Chapters == nil {
		payload.Chapters = map[string]models.GrammarChapterProgress{}
	}

	now := time.Now()
	progress := models.GrammarProgress{
		Chapters:     payload.Chapters,
		LastReadSlug: payload.LastReadSlug,
		UpdatedAt:    now,
	}

	if mock.IsMockMode() {
		updated, err := mock.GetMockDB().UpdateGrammarProgress(userID, progress)
		if err != nil {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(updated)
		return
	}

	collection := db.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := collection.UpdateOne(
		ctx,
		bson.M{"_id": userID},
		bson.M{"$set": bson.M{"grammar_progress": progress}},
	)
	if err != nil {
		http.Error(w, "Failed to update progress", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(progress)
}