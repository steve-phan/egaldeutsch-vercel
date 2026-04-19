package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"egaldeutsch-vercel/db"
	"egaldeutsch-vercel/models"
	"egaldeutsch-vercel/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// GetNotificationsHandler returns the activity feed for the logged-in user.
func GetNotificationsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	claims, err := utils.GetClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	userID, _ := primitive.ObjectIDFromHex(claims.UserID)
	collection := db.GetCollection("notifications")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})
	cursor, err := collection.Find(ctx, bson.M{"user_id": userID}, opts)
	if err != nil {
		http.Error(w, "Failed to fetch notifications", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var notifications []models.Notification
	if err = cursor.All(ctx, &notifications); err != nil {
		http.Error(w, "Failed to decode notifications", http.StatusInternalServerError)
		return
	}

	if notifications == nil {
		notifications = []models.Notification{}
	}

	json.NewEncoder(w).Encode(notifications)
}

// MarkNotificationReadHandler updates notifications to read status.
func MarkNotificationReadHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	claims, err := utils.GetClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	userID, _ := primitive.ObjectIDFromHex(claims.UserID)
	collection := db.GetCollection("notifications")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// If an ID is provided, mark that one. Otherwise, mark all for the user.
	targetID := r.URL.Query().Get("id")
	filter := bson.M{"user_id": userID}
	
	if targetID != "" {
		oid, _ := primitive.ObjectIDFromHex(targetID)
		filter["_id"] = oid
	}

	update := bson.M{"$set": bson.M{"is_read": true}}
	_, err = collection.UpdateMany(ctx, filter, update)
	if err != nil {
		http.Error(w, "Failed to update notifications", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Notifications marked as read"})
}
