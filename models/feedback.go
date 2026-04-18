package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Feedback struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID       *primitive.ObjectID `bson:"user_id,omitempty" json:"user_id"` // Optional for guest
	UserEmail    string             `bson:"user_email,omitempty" json:"user_email"` // For guests
	UserName     string             `bson:"user_name,omitempty" json:"user_name"`
	Category     string             `bson:"category" json:"category"` // "Bug Report", "Feature Request", "Praise", "Other"
	Message      string             `bson:"message" json:"message"`
	Rating       int                `bson:"rating" json:"rating"` // 1-5
	IPAddress    string             `bson:"ip_address" json:"ip_address"`
	UserAgent    string             `bson:"user_agent" json:"user_agent"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at"`
}
