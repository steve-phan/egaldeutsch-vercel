package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID               primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email            string             `bson:"email" json:"email"`
	Password         string             `bson:"password" json:"-"`
	Name             string             `bson:"name" json:"name"`
	Role             string             `bson:"role" json:"role"` // "admin" or "user"
	ResetToken       string             `bson:"reset_token,omitempty" json:"-"`
	ResetTokenExpiry time.Time          `bson:"reset_token_expiry,omitempty" json:"-"`
}

