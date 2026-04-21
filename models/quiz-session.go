package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// QuizSession records a completed user quiz session in the database.
type QuizSession struct {
	ID          primitive.ObjectID  `bson:"_id,omitempty" json:"id"`
	UserID      *primitive.ObjectID `bson:"user_id"      json:"user_id,omitempty"` // nil = guest
	Category    string              `bson:"category"     json:"category"`
	Level       string              `bson:"level"        json:"level"`
	Score       float64             `bson:"score"        json:"score"`
	TotalQ      int                 `bson:"total_q"      json:"total_q"`
	CorrectQ    int                 `bson:"correct_q"    json:"correct_q"`
	Mode        string              `bson:"mode"         json:"mode"`           // "test" or "practice"
	EstimatedLevel string           `bson:"estimated_level" json:"estimated_level,omitempty"`
	QuestionIDs []primitive.ObjectID `bson:"question_ids" json:"question_ids"`
	CompletedAt time.Time           `bson:"completed_at" json:"completed_at"`
}
