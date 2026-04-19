package utils

import (
	"context"
	"time"

	"egaldeutsch-vercel/db"
	"egaldeutsch-vercel/models"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CreateNotification inserts a new activity feed item for a user.
func CreateNotification(userID primitive.ObjectID, title, description, notifType, link string) error {
	collection := db.GetCollection("notifications")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	notif := models.Notification{
		ID:          primitive.NewObjectID(),
		UserID:      userID,
		Title:       title,
		Description: description,
		Type:        notifType,
		Link:        link,
		IsRead:      false,
		CreatedAt:   time.Now(),
	}

	_, err := collection.InsertOne(ctx, notif)
	return err
}
