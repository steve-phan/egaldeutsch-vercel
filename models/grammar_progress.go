package models

import "time"

type GrammarChapterProgress struct {
	ReadAt       *time.Time `bson:"read_at,omitempty" json:"readAt,omitempty"`
	QuizScore    int        `bson:"quiz_score,omitempty" json:"quizScore,omitempty"`
	QuizTotal    int        `bson:"quiz_total,omitempty" json:"quizTotal,omitempty"`
	QuizPassedAt *time.Time `bson:"quiz_passed_at,omitempty" json:"quizPassedAt,omitempty"`
}

type GrammarProgress struct {
	Chapters     map[string]GrammarChapterProgress `bson:"chapters,omitempty" json:"chapters,omitempty"`
	LastReadSlug string                            `bson:"last_read_slug,omitempty" json:"lastReadSlug,omitempty"`
	UpdatedAt    time.Time                         `bson:"updated_at,omitempty" json:"updatedAt,omitempty"`
}