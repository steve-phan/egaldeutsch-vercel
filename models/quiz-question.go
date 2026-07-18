package models

import (
	"errors"
	"strings"
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
	PassageDe     string             `bson:"passage_de"     json:"passage_de,omitempty"`
	PassageTitle  string             `bson:"passage_title"  json:"passage_title,omitempty"`
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

// Validate checks if the question structure is correct and normalizes the type.
func (q *QuizQuestion) Validate() error {
	// Normalize type (handle legacy multiple_choice with underscore)
	q.Type = strings.ReplaceAll(q.Type, "_", "-")

	if q.PromptDe == "" {
		return errors.New("prompt_de is required")
	}
	if q.CorrectAnswer == "" {
		return errors.New("correct_answer is required")
	}
	if q.Type == "" {
		return errors.New("type is required")
	}

	switch q.Type {
	case "reading-comprehension":
		if strings.TrimSpace(q.PassageDe) == "" {
			return errors.New("reading-comprehension requires passage_de")
		}
		if len(q.Options) < 2 {
			return errors.New("reading-comprehension requires at least 2 options")
		}
		found := false
		for _, opt := range q.Options {
			if strings.TrimSpace(opt) == strings.TrimSpace(q.CorrectAnswer) {
				found = true
				break
			}
		}
		if !found {
			return errors.New("correct_answer must be one of the options for reading-comprehension")
		}

	case "multiple-choice":
		if len(q.Options) < 2 {
			return errors.New("multiple-choice requires at least 2 options")
		}
		// Ensure correct answer is one of the options
		found := false
		for _, opt := range q.Options {
			if strings.TrimSpace(opt) == strings.TrimSpace(q.CorrectAnswer) {
				found = true
				break
			}
		}
		if !found {
			return errors.New("correct_answer must be one of the options for multiple-choice")
		}

	case "matching":
		if len(q.Options) < 2 {
			return errors.New("matching requires at least 2 pairs")
		}
		for _, opt := range q.Options {
			if !strings.Contains(opt, "|") {
				return errors.New("matching options must be in 'word|match' format")
			}
		}

	case "word-order":
		words := strings.Fields(q.CorrectAnswer)
		if len(words) < 2 {
			return errors.New("word-order requires at least 2 words in correct_answer")
		}

	case "fill-in-blank":
		// Already checked prompt and correct_answer
	}

	return nil
}
