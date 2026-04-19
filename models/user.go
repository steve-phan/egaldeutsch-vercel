package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID               primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email            string             `bson:"email" json:"email"`
	Password         string             `bson:"password,omitempty" json:"-"`
	Name             string             `bson:"name" json:"name"`
	Role             string             `bson:"role" json:"role"`                         // "admin" or "student"
	AuthSource       string             `bson:"auth_source,omitempty" json:"auth_source"` // "google" or "credentials"
	ResetToken       string             `bson:"reset_token,omitempty" json:"-"`
	ResetTokenExpiry time.Time          `bson:"reset_token_expiry,omitempty" json:"-"`
	Language         string             `bson:"language,omitempty" json:"language"`
	SeenIdioms       []string           `bson:"seen_idioms,omitempty" json:"seen_idioms,omitempty"`
}
