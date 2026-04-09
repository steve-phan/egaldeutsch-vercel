package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type QuizOption struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Text          string             `bson:"text" json:"text"`
	Explanation   string             `bson:"explanation" json:"explanation"`
	IsCorrect     bool               `bson:"is_correct" json:"isCorrect"`
	CommonMistake string             `bson:"common_mistake,omitempty" json:"commonMistake,omitempty"`
}

type ExplanationQuiz struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title     string             `bson:"title" json:"title"`
	Question  string             `bson:"question" json:"question"`
	Context   string             `bson:"context,omitempty" json:"context,omitempty"`
	Category  string             `bson:"category" json:"category"`
	Options   []QuizOption       `bson:"options" json:"options"`
	CreatedAt time.Time          `bson:"created_at" json:"createdAt"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updatedAt"`
}

type CreateExplanationQuizRequest struct {
	Title    string       `json:"title"`
	Question string       `json:"question"`
	Context  string       `json:"context,omitempty"`
	Category string       `json:"category"`
	Options  []QuizOption `json:"options"`
}

type UpdateExplanationQuizRequest struct {
	Title    string       `json:"title,omitempty"`
	Question string       `json:"question,omitempty"`
	Context  string       `json:"context,omitempty"`
	Category string       `json:"category,omitempty"`
	Options  []QuizOption `json:"options,omitempty"`
}
