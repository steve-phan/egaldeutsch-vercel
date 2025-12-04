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

// MatchingPair represents a word-match pair for matching quiz
type MatchingPair struct {
	ID    int    `bson:"id" json:"id"`
	Word  string `bson:"word" json:"word"`
	Match string `bson:"match" json:"match"`
}

type LessonDetail struct {
	ID            string         `bson:"_id,omitempty" json:"id"`
	Title         string         `bson:"title" json:"title"`
	Description   string         `bson:"description" json:"description"`
	AudioURL      string         `bson:"audio_url" json:"audio_url"`
	Transcript    string         `bson:"transcript" json:"transcript"`
	QuizType      string         `bson:"quiz_type" json:"quiz_type"`
	QuizQuestion  string         `bson:"quiz_question" json:"quiz_question"`
	QuizOptions   []string       `bson:"quiz_options" json:"quiz_options"`
	ScrambleWord  string         `bson:"scramble_word,omitempty" json:"scramble_word,omitempty"`
	MatchingPairs []MatchingPair `bson:"matching_pairs,omitempty" json:"matching_pairs,omitempty"`
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

	// Use mock database if mock mode is enabled
	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		mockLesson, err := mockDB.GetLessonByID(objID)
		if err != nil {
			http.Error(w, "Lesson not found", http.StatusNotFound)
			return
		}

		// Convert matching pairs
		var matchingPairs []MatchingPair
		for _, mp := range mockLesson.MatchingPairs {
			matchingPairs = append(matchingPairs, MatchingPair{
				ID:    mp.ID,
				Word:  mp.Word,
				Match: mp.Match,
			})
		}

		lesson := LessonDetail{
			ID:            mockLesson.ID.Hex(),
			Title:         mockLesson.Title,
			Description:   mockLesson.Description,
			AudioURL:      mockLesson.AudioURL,
			Transcript:    mockLesson.Transcript,
			QuizType:      mockLesson.QuizType,
			QuizQuestion:  mockLesson.QuizQuestion,
			QuizOptions:   mockLesson.QuizOptions,
			ScrambleWord:  mockLesson.ScrambleWord,
			MatchingPairs: matchingPairs,
		}
		json.NewEncoder(w).Encode(lesson)
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
