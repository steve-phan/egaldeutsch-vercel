package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// QuizOption holds a localized option for multiple-choice questions.
type QuizOption struct {
	De string `bson:"de" json:"de"`
	En string `bson:"en" json:"en"`
	Vi string `bson:"vi" json:"vi"`
}

// QuizQuestion represents a quiz question in the database.
type QuizQuestion struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Category      string             `bson:"category"       json:"category"`
	Subcategory   string             `bson:"subcategory"    json:"subcategory"`
	Level         string             `bson:"level"          json:"level"`
	Type          string             `bson:"type"           json:"type"`
	PromptDe      string             `bson:"prompt_de"      json:"prompt_de"`
	PromptEn      string             `bson:"prompt_en"      json:"prompt_en"`
	PromptVi      string             `bson:"prompt_vi"      json:"prompt_vi"`
	BlankIndex    *int               `bson:"blank_index"    json:"blank_index,omitempty"`
	Options       []QuizOption       `bson:"options"        json:"options,omitempty"`
	CorrectAnswer string             `bson:"correct_answer" json:"correct_answer"`
	ExplanationDe string             `bson:"explanation_de" json:"explanation_de"`
	ExplanationEn string             `bson:"explanation_en" json:"explanation_en"`
	ExplanationVi string             `bson:"explanation_vi" json:"explanation_vi"`
	HintDe        string             `bson:"hint_de"        json:"hint_de,omitempty"`
	HintEn        string             `bson:"hint_en"        json:"hint_en,omitempty"`
	HintVi        string             `bson:"hint_vi"        json:"hint_vi,omitempty"`
	Tags          []string           `bson:"tags"           json:"tags"`
	CreatedAt     time.Time          `bson:"created_at"     json:"created_at"`
	UpdatedAt     time.Time          `bson:"updated_at"     json:"updated_at"`
}
