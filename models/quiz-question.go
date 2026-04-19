package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// QuizQuestion represents a quiz question in the database.
type QuizQuestion struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Category      string             `bson:"category"       json:"category"`
	Subcategory   string             `bson:"subcategory"    json:"subcategory"`
	Level         string             `bson:"level"          json:"level"`
	Type          string             `bson:"type"           json:"type"`
	PromptDe      string             `bson:"prompt_de"      json:"prompt_de"`
	BlankIndex    *int               `bson:"blank_index"    json:"blank_index,omitempty"`
	Options       []string           `bson:"options"        json:"options,omitempty"`
	CorrectAnswer string             `bson:"correct_answer" json:"correct_answer"`
	ExplanationDe string             `bson:"explanation_de" json:"explanation_de"`
	ExplanationEn string             `bson:"explanation_en" json:"explanation_en"`
	ExplanationVi string             `bson:"explanation_vi" json:"explanation_vi"`
	HintDe        string             `bson:"hint_de"        json:"hint_de,omitempty"`
	HintEn        string             `bson:"hint_en"        json:"hint_en,omitempty"`
	HintVi        string             `bson:"hint_vi"        json:"hint_vi,omitempty"`
	Tags          []string           `bson:"tags"           json:"tags"`
	Status        string             `bson:"status"         json:"status"` // "draft", "review", "published"
	CreatedAt     time.Time          `bson:"created_at"     json:"-"`
	UpdatedAt     time.Time          `bson:"updated_at"     json:"-"`
}
