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
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DashboardStats struct {
	TotalLessons     int     `json:"total_lessons"`
	CompletedLessons int     `json:"completed_lessons"`
	QuizzesPassed    int     `json:"quizzes_passed"`
	TotalAttempts    int     `json:"total_attempts"`
	CompletionRate   float64 `json:"completion_rate"`
}

type LessonProgressResponse struct {
	ID          string     `json:"id"`
	LessonID    string     `json:"lesson_id"`
	LessonTitle string     `json:"lesson_title,omitempty"`
	Completed   bool       `json:"completed"`
	QuizPassed  bool       `json:"quiz_passed"`
	Attempts    int        `json:"attempts"`
	CompletedAt *time.Time `json:"completed_at,omitempty"`
}

// DashboardHandler returns user's learning statistics and progress
func DashboardHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get user from token
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

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		stats := mockDB.GetUserStats(userID)

		json.NewEncoder(w).Encode(DashboardStats{
			TotalLessons:     stats["total_lessons"].(int),
			CompletedLessons: stats["completed_lessons"].(int),
			QuizzesPassed:    stats["quizzes_passed"].(int),
			TotalAttempts:    stats["total_attempts"].(int),
			CompletionRate:   stats["completion_rate"].(float64),
		})
		return
	}

	// For real MongoDB
	lessonsCollection := db.GetCollection("lessons")
	progressCollection := db.GetCollection("lesson_progress")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Get total lessons count
	totalLessons, err := lessonsCollection.CountDocuments(ctx, bson.M{})
	if err != nil {
		http.Error(w, "Failed to get lessons count", http.StatusInternalServerError)
		return
	}

	// Get user's progress
	cursor, err := progressCollection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		http.Error(w, "Failed to get progress", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	completedLessons := 0
	quizzesPassed := 0
	totalAttempts := 0

	for cursor.Next(ctx) {
		var progress struct {
			Completed  bool `bson:"completed"`
			QuizPassed bool `bson:"quiz_passed"`
			Attempts   int  `bson:"attempts"`
		}
		if err := cursor.Decode(&progress); err == nil {
			if progress.Completed {
				completedLessons++
			}
			if progress.QuizPassed {
				quizzesPassed++
			}
			totalAttempts += progress.Attempts
		}
	}

	var completionRate float64
	if totalLessons > 0 {
		completionRate = float64(completedLessons) / float64(totalLessons) * 100
	}

	json.NewEncoder(w).Encode(DashboardStats{
		TotalLessons:     int(totalLessons),
		CompletedLessons: completedLessons,
		QuizzesPassed:    quizzesPassed,
		TotalAttempts:    totalAttempts,
		CompletionRate:   completionRate,
	})
}

// UserProgressHandler returns detailed lesson progress for a user
func UserProgressHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get user from token
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

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		mockProgress := mockDB.GetUserProgress(userID)
		
		progress := make([]LessonProgressResponse, 0, len(mockProgress))
		for _, p := range mockProgress {
			// Get lesson title
			var lessonTitle string
			lesson, err := mockDB.GetLessonByID(p.LessonID)
			if err == nil {
				lessonTitle = lesson.Title
			}

			progress = append(progress, LessonProgressResponse{
				ID:          p.ID.Hex(),
				LessonID:    p.LessonID.Hex(),
				LessonTitle: lessonTitle,
				Completed:   p.Completed,
				QuizPassed:  p.QuizPassed,
				Attempts:    p.Attempts,
				CompletedAt: p.CompletedAt,
			})
		}

		json.NewEncoder(w).Encode(progress)
		return
	}

	collection := db.GetCollection("lesson_progress")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		http.Error(w, "Failed to get progress", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var progress []LessonProgressResponse
	if err = cursor.All(ctx, &progress); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if progress == nil {
		progress = []LessonProgressResponse{}
	}

	json.NewEncoder(w).Encode(progress)
}

// UpdateProgressRequest represents a request to update lesson progress
type UpdateProgressRequest struct {
	LessonID   string `json:"lesson_id"`
	Completed  bool   `json:"completed"`
	QuizPassed bool   `json:"quiz_passed"`
}

// UpdateProgressHandler updates user's progress on a lesson
func UpdateProgressHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get user from token
	claims, err := utils.GetClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req UpdateProgressRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	userID, err := primitive.ObjectIDFromHex(claims.UserID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	lessonID, err := primitive.ObjectIDFromHex(req.LessonID)
	if err != nil {
		http.Error(w, "Invalid lesson ID", http.StatusBadRequest)
		return
	}

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		
		// Get or create progress
		progress, err := mockDB.GetOrCreateLessonProgress(userID, lessonID)
		if err != nil {
			http.Error(w, "Failed to get progress", http.StatusInternalServerError)
			return
		}

		// Update progress
		updatedProgress, err := mockDB.UpdateLessonProgress(progress.ID, req.Completed, req.QuizPassed)
		if err != nil {
			http.Error(w, "Failed to update progress", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(LessonProgressResponse{
			ID:          updatedProgress.ID.Hex(),
			LessonID:    updatedProgress.LessonID.Hex(),
			Completed:   updatedProgress.Completed,
			QuizPassed:  updatedProgress.QuizPassed,
			Attempts:    updatedProgress.Attempts,
			CompletedAt: updatedProgress.CompletedAt,
		})
		return
	}

	// For real MongoDB - use upsert
	collection := db.GetCollection("lesson_progress")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	now := time.Now()
	filter := bson.M{"user_id": userID, "lesson_id": lessonID}
	
	update := bson.M{
		"$set": bson.M{
			"completed":   req.Completed,
			"quiz_passed": req.QuizPassed,
			"updated_at":  now,
		},
		"$inc": bson.M{
			"attempts": 1,
		},
		"$setOnInsert": bson.M{
			"user_id":    userID,
			"lesson_id":  lessonID,
			"created_at": now,
		},
	}

	if req.Completed {
		update["$set"].(bson.M)["completed_at"] = now
	}

	opts := options.Update().SetUpsert(true)
	_, err = collection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		http.Error(w, "Failed to update progress", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Progress updated successfully"})
}
