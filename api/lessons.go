package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"egaldeutsch-vercel/db"
	"egaldeutsch-vercel/mock"

	"go.mongodb.org/mongo-driver/bson"
)

type Lesson struct {
	ID          string `bson:"_id,omitempty" json:"id"`
	Title       string `bson:"title" json:"title"`
	Description string `bson:"description" json:"description"`
	AudioURL    string `bson:"audio_url" json:"audio_url"`
}

func LessonsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Use mock database if mock mode is enabled
	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		mockLessons := mockDB.GetAllLessons()
		
		lessons := make([]Lesson, 0, len(mockLessons))
		for _, l := range mockLessons {
			lessons = append(lessons, Lesson{
				ID:          l.ID.Hex(),
				Title:       l.Title,
				Description: l.Description,
				AudioURL:    l.AudioURL,
			})
		}
		
		json.NewEncoder(w).Encode(lessons)
		return
	}

	collection := db.GetCollection("lessons")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var lessons []Lesson
	if err = cursor.All(ctx, &lessons); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(lessons)
}
