package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"egaldeutsch-vercel/db"
	"egaldeutsch-vercel/mock"
	"egaldeutsch-vercel/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// MatchingPairRequest represents a word-match pair for matching quiz
type MatchingPairRequest struct {
	ID    int    `json:"id"`
	Word  string `json:"word"`
	Match string `json:"match"`
}

// TranscriptSentenceRequest represents a sentence in the transcript with translation
type TranscriptSentenceRequest struct {
	Text        string `json:"text"`
	Translation string `json:"translation"`
}

type CreateLessonRequest struct {
	Title         string                      `json:"title"`
	Description   string                      `json:"description"`
	AudioURL      string                      `json:"audio_url"`
	VideoURL      string                      `json:"video_url,omitempty"`
	Transcript    []TranscriptSentenceRequest `json:"transcript"`
	QuizType      string                      `json:"quiz_type"`
	QuizQuestion  string                      `json:"quiz_question"`
	QuizOptions   []string                    `json:"quiz_options"`
	CorrectAnswer string                      `json:"correct_answer"`
	ScrambleWord  string                      `json:"scramble_word,omitempty"`
	MatchingPairs []MatchingPairRequest       `json:"matching_pairs,omitempty"`
}

type LessonManagementResponse struct {
	ID            string                      `json:"id"`
	Title         string                      `json:"title"`
	Description   string                      `json:"description"`
	AudioURL      string                      `json:"audio_url"`
	VideoURL      string                      `json:"video_url,omitempty"`
	Transcript    []TranscriptSentenceRequest `json:"transcript"`
	QuizType      string                      `json:"quiz_type"`
	QuizQuestion  string                      `json:"quiz_question"`
	QuizOptions   []string                    `json:"quiz_options"`
	CorrectAnswer string                      `json:"correct_answer"`
	ScrambleWord  string                      `json:"scramble_word,omitempty"`
	MatchingPairs []MatchingPairRequest       `json:"matching_pairs,omitempty"`
	CreatedAt     time.Time                   `json:"created_at"`
	UpdatedAt     time.Time                   `json:"updated_at"`
}

// LessonManagementHandler handles CRUD operations for lessons (admin only)
// POST - create lesson
// PUT - update lesson (requires id query param)
// DELETE - delete lesson (requires id query param)
func LessonManagementHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get user from token
	claims, err := utils.GetClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Verify admin role (in mock mode)
	if mock.IsMockMode() {
		userID, _ := primitive.ObjectIDFromHex(claims.UserID)
		mockDB := mock.GetMockDB()
		user, err := mockDB.GetUserByID(userID)
		if err != nil || user.Role != "admin" {
			http.Error(w, "Forbidden: Admin access required", http.StatusForbidden)
			return
		}
	}

	switch r.Method {
	case http.MethodPost:
		createLesson(w, r)
	case http.MethodPut:
		updateLesson(w, r)
	case http.MethodDelete:
		deleteLesson(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func createLesson(w http.ResponseWriter, r *http.Request) {
	var req CreateLessonRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Title == "" || req.Description == "" {
		http.Error(w, "Title and description are required", http.StatusBadRequest)
		return
	}

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()

		// Convert matching pairs
		var matchingPairs []mock.MatchingPair
		for _, mp := range req.MatchingPairs {
			matchingPairs = append(matchingPairs, mock.MatchingPair{
				ID:    mp.ID,
				Word:  mp.Word,
				Match: mp.Match,
			})
		}

		// Convert transcript sentences
		var transcriptSentences []mock.TranscriptSentence
		for _, ts := range req.Transcript {
			transcriptSentences = append(transcriptSentences, mock.TranscriptSentence{
				Text:        ts.Text,
				Translation: ts.Translation,
			})
		}

		lesson, err := mockDB.CreateLesson(
			req.Title,
			req.Description,
			req.AudioURL,
			req.VideoURL,
			transcriptSentences,
			req.QuizType,
			req.QuizQuestion,
			req.QuizOptions,
			req.CorrectAnswer,
			req.ScrambleWord,
			matchingPairs,
		)
		if err != nil {
			http.Error(w, "Failed to create lesson", http.StatusInternalServerError)
			return
		}

		// Convert matching pairs for response
		var responsePairs []MatchingPairRequest
		for _, mp := range lesson.MatchingPairs {
			responsePairs = append(responsePairs, MatchingPairRequest{
				ID:    mp.ID,
				Word:  mp.Word,
				Match: mp.Match,
			})
		}

		// Convert transcript sentences for response
		var responseTranscript []TranscriptSentenceRequest
		for _, ts := range lesson.Transcript {
			responseTranscript = append(responseTranscript, TranscriptSentenceRequest{
				Text:        ts.Text,
				Translation: ts.Translation,
			})
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(LessonManagementResponse{
			ID:            lesson.ID.Hex(),
			Title:         lesson.Title,
			Description:   lesson.Description,
			AudioURL:      lesson.AudioURL,
			VideoURL:      lesson.VideoURL,
			Transcript:    responseTranscript,
			QuizType:      lesson.QuizType,
			QuizQuestion:  lesson.QuizQuestion,
			QuizOptions:   lesson.QuizOptions,
			CorrectAnswer: lesson.CorrectAnswer,
			ScrambleWord:  lesson.ScrambleWord,
			MatchingPairs: responsePairs,
			CreatedAt:     lesson.CreatedAt,
			UpdatedAt:     lesson.UpdatedAt,
		})
		return
	}

	collection := db.GetCollection("lessons")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	now := time.Now()
	lesson := bson.M{
		"title":          req.Title,
		"description":    req.Description,
		"audio_url":      req.AudioURL,
		"video_url":      req.VideoURL,
		"transcript":     req.Transcript,
		"quiz_type":      req.QuizType,
		"quiz_question":  req.QuizQuestion,
		"quiz_options":   req.QuizOptions,
		"correct_answer": req.CorrectAnswer,
		"scramble_word":  req.ScrambleWord,
		"matching_pairs": req.MatchingPairs,
		"created_at":     now,
		"updated_at":     now,
	}

	result, err := collection.InsertOne(ctx, lesson)
	if err != nil {
		http.Error(w, "Failed to create lesson", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":      result.InsertedID.(primitive.ObjectID).Hex(),
		"message": "Lesson created successfully",
	})
}

func updateLesson(w http.ResponseWriter, r *http.Request) {
	lessonIDStr := r.URL.Query().Get("id")
	if lessonIDStr == "" {
		http.Error(w, "Lesson ID required", http.StatusBadRequest)
		return
	}

	lessonID, err := primitive.ObjectIDFromHex(lessonIDStr)
	if err != nil {
		http.Error(w, "Invalid lesson ID", http.StatusBadRequest)
		return
	}

	var req CreateLessonRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()

		// Convert matching pairs
		var matchingPairs []mock.MatchingPair
		for _, mp := range req.MatchingPairs {
			matchingPairs = append(matchingPairs, mock.MatchingPair{
				ID:    mp.ID,
				Word:  mp.Word,
				Match: mp.Match,
			})
		}

		// Convert transcript sentences
		var transcriptSentences []mock.TranscriptSentence
		for _, ts := range req.Transcript {
			transcriptSentences = append(transcriptSentences, mock.TranscriptSentence{
				Text:        ts.Text,
				Translation: ts.Translation,
			})
		}

		lesson, err := mockDB.UpdateLesson(
			lessonID,
			req.Title,
			req.Description,
			req.AudioURL,
			req.VideoURL,
			transcriptSentences,
			req.QuizType,
			req.QuizQuestion,
			req.QuizOptions,
			req.CorrectAnswer,
			req.ScrambleWord,
			matchingPairs,
		)
		if err != nil {
			http.Error(w, "Lesson not found", http.StatusNotFound)
			return
		}

		// Convert matching pairs for response
		var responsePairs []MatchingPairRequest
		for _, mp := range lesson.MatchingPairs {
			responsePairs = append(responsePairs, MatchingPairRequest{
				ID:    mp.ID,
				Word:  mp.Word,
				Match: mp.Match,
			})
		}

		// Convert transcript sentences for response
		var responseTranscript []TranscriptSentenceRequest
		for _, ts := range lesson.Transcript {
			responseTranscript = append(responseTranscript, TranscriptSentenceRequest{
				Text:        ts.Text,
				Translation: ts.Translation,
			})
		}

		json.NewEncoder(w).Encode(LessonManagementResponse{
			ID:            lesson.ID.Hex(),
			Title:         lesson.Title,
			Description:   lesson.Description,
			AudioURL:      lesson.AudioURL,
			VideoURL:      lesson.VideoURL,
			Transcript:    responseTranscript,
			QuizType:      lesson.QuizType,
			QuizQuestion:  lesson.QuizQuestion,
			QuizOptions:   lesson.QuizOptions,
			CorrectAnswer: lesson.CorrectAnswer,
			ScrambleWord:  lesson.ScrambleWord,
			MatchingPairs: responsePairs,
			CreatedAt:     lesson.CreatedAt,
			UpdatedAt:     lesson.UpdatedAt,
		})
		return
	}

	collection := db.GetCollection("lessons")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	update := bson.M{
		"$set": bson.M{
			"title":          req.Title,
			"description":    req.Description,
			"audio_url":      req.AudioURL,
			"video_url":      req.VideoURL,
			"transcript":     req.Transcript,
			"quiz_type":      req.QuizType,
			"quiz_question":  req.QuizQuestion,
			"quiz_options":   req.QuizOptions,
			"correct_answer": req.CorrectAnswer,
			"scramble_word":  req.ScrambleWord,
			"matching_pairs": req.MatchingPairs,
			"updated_at":     time.Now(),
		},
	}

	result, err := collection.UpdateOne(ctx, bson.M{"_id": lessonID}, update)
	if err != nil {
		http.Error(w, "Failed to update lesson", http.StatusInternalServerError)
		return
	}

	if result.MatchedCount == 0 {
		http.Error(w, "Lesson not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Lesson updated successfully"})
}

func deleteLesson(w http.ResponseWriter, r *http.Request) {
	lessonIDStr := r.URL.Query().Get("id")
	if lessonIDStr == "" {
		http.Error(w, "Lesson ID required", http.StatusBadRequest)
		return
	}

	lessonID, err := primitive.ObjectIDFromHex(lessonIDStr)
	if err != nil {
		http.Error(w, "Invalid lesson ID", http.StatusBadRequest)
		return
	}

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		err := mockDB.DeleteLesson(lessonID)
		if err != nil {
			http.Error(w, "Lesson not found", http.StatusNotFound)
			return
		}

		json.NewEncoder(w).Encode(map[string]string{"message": "Lesson deleted successfully"})
		return
	}

	collection := db.GetCollection("lessons")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := collection.DeleteOne(ctx, bson.M{"_id": lessonID})
	if err != nil {
		http.Error(w, "Failed to delete lesson", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "Lesson not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Lesson deleted successfully"})
}
