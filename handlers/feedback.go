package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"sync"
	"time"

	"egaldeutsch-vercel/db"
	"egaldeutsch-vercel/models"
	"egaldeutsch-vercel/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Rate limiting map
var (
	feedbackRateLimit = make(map[string][]time.Time)
	rateLimitMutex    = &sync.Mutex{}
)

const (
	MaxFeedbackPerHour = 5
)

type FeedbackSubmission struct {
	Category    string `json:"category"`
	Message     string `json:"message"`
	Rating      int    `json:"rating"`
	Honeypot    string `json:"hp_website"` // Honeypot field
	GuestEmail  string `json:"guest_email,omitempty"`
}

// FeedbackHandler handles user submissions (POST /api/feedback)
func FeedbackHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req FeedbackSubmission
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// 1. Honeypot check
	if req.Honeypot != "" {
		// Silent reject for bots
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
		return
	}

	// 2. IP Rate Limiting
	ip := r.RemoteAddr
	rateLimitMutex.Lock()
	now := time.Now()
	submissions := feedbackRateLimit[ip]
	
	// Filter out old submissions (older than 1 hour)
	valid := []time.Time{}
	for _, t := range submissions {
		if now.Sub(t) < time.Hour {
			valid = append(valid, t)
		}
	}
	
	if len(valid) >= MaxFeedbackPerHour {
		rateLimitMutex.Unlock()
		http.Error(w, "Too many requests. Please try again later.", http.StatusTooManyRequests)
		return
	}
	
	valid = append(valid, now)
	feedbackRateLimit[ip] = valid
	rateLimitMutex.Unlock()

	// 3. User Identification
	var userID *primitive.ObjectID
	claims, err := utils.GetClaimsFromRequest(r)
	if err == nil {
		if id, err := primitive.ObjectIDFromHex(claims.UserID); err == nil {
			userID = &id
		}
	}

	// 4. Save to Database
	collection := db.GetCollection("feedback")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	feedback := models.Feedback{
		ID:        primitive.NewObjectID(),
		UserID:    userID,
		UserEmail: req.GuestEmail,
		Category:  req.Category,
		Message:   req.Message,
		Rating:    req.Rating,
		IPAddress: ip,
		UserAgent: r.UserAgent(),
		CreatedAt: now,
	}

	_, iErr := collection.InsertOne(ctx, feedback)
	if iErr != nil {
		http.Error(w, "Failed to save feedback", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(feedback)
}

// AdminFeedbackHandler handles GET /api/admin/feedback
func AdminFeedbackHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Check Admin Authorization
	claims, err := utils.GetClaimsFromRequest(r)
	if err != nil || claims.Role != "admin" {
		http.Error(w, "Unauthorized: Admin access required", http.StatusUnauthorized)
		return
	}

	collection := db.GetCollection("feedback")
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	findOptions := options.Find()
	findOptions.SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := collection.Find(ctx, bson.M{}, findOptions)
	if err != nil {
		http.Error(w, "Failed to fetch feedback", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var feedbacks []models.Feedback
	if err = cursor.All(ctx, &feedbacks); err != nil {
		http.Error(w, "Failed to decode feedback", http.StatusInternalServerError)
		return
	}

	if feedbacks == nil {
		feedbacks = []models.Feedback{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(feedbacks)
}
