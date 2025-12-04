package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"egaldeutsch-vercel/api/db"
	"egaldeutsch-vercel/api/mock"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CheckAnswerRequest struct {
	LessonID string `json:"lesson_id"`
	Answer   string `json:"answer"`
}

type CheckAnswerResponse struct {
	Correct bool   `json:"correct"`
	Message string `json:"message"`
}

type LessonWithAnswer struct {
	ID            primitive.ObjectID `bson:"_id"`
	CorrectAnswer string             `bson:"correct_answer"`
}

func CheckAnswerHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CheckAnswerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	objID, err := primitive.ObjectIDFromHex(req.LessonID)
	if err != nil {
		http.Error(w, "Invalid lesson ID", http.StatusBadRequest)
		return
	}

	// Use mock database if mock mode is enabled
	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		correct, err := mockDB.CheckAnswer(objID, req.Answer)
		if err != nil {
			http.Error(w, "Lesson not found", http.StatusNotFound)
			return
		}

		message := "Incorrect, try again."
		if correct {
			message = "Correct!"
		}

		json.NewEncoder(w).Encode(CheckAnswerResponse{
			Correct: correct,
			Message: message,
		})
		return
	}

	collection := db.GetCollection("lessons")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var lesson LessonWithAnswer
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&lesson)
	if err != nil {
		http.Error(w, "Lesson not found", http.StatusNotFound)
		return
	}

	correct := lesson.CorrectAnswer == req.Answer
	message := "Incorrect, try again."
	if correct {
		message = "Correct!"
	}

	json.NewEncoder(w).Encode(CheckAnswerResponse{
		Correct: correct,
		Message: message,
	})
}
