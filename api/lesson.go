package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"egaldeutsch-vercel/api/db"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type LessonDetail struct {
	ID           string   `bson:"_id,omitempty" json:"id"`
	Title        string   `bson:"title" json:"title"`
	Description  string   `bson:"description" json:"description"`
	AudioURL     string   `bson:"audio_url" json:"audio_url"`
	Transcript   string   `bson:"transcript" json:"transcript"`
	QuizQuestion string   `bson:"quiz_question" json:"quiz_question"`
	QuizOptions  []string `bson:"quiz_options" json:"quiz_options"`
}

func LessonHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "Missing id parameter", http.StatusBadRequest)
		return
	}

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, "Invalid lesson ID", http.StatusBadRequest)
		return
	}

	collection := db.GetCollection("lessons")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var lesson LessonDetail
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&lesson)
	if err != nil {
		http.Error(w, "Lesson not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(lesson)
}
