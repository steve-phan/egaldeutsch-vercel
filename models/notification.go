package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Notification represents a user-specific or system-wide alert.
type Notification struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID      primitive.ObjectID `bson:"user_id"       json:"user_id"`
	Title       string             `bson:"title"         json:"title"`
	Description string             `bson:"description"   json:"description"`
	Type        string             `bson:"type"          json:"type"` // achievement, streak, system, social
	Link        string             `bson:"link"          json:"link,omitempty"`
	IsRead      bool               `bson:"is_read"       json:"is_read"`
	CreatedAt   time.Time          `bson:"created_at"    json:"created_at"`
}
