package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Idiom represents a German idiomatic expression (Redewendung).
type Idiom struct {
	ID                primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title             string             `bson:"title"          json:"title"`
	Slug              string             `bson:"slug"           json:"slug"`
	Thumbnail         string             `bson:"thumbnail"      json:"thumbnail,omitempty"`
	MeaningDe         string             `bson:"meaning_de"     json:"meaning_de"`
	MeaningEn         string             `bson:"meaning_en"     json:"meaning_en"`
	MeaningVi         string             `bson:"meaning_vi"     json:"meaning_vi"`
	ContentHTML       string             `bson:"content_html"   json:"content_html"` // Raw HTML content for detailed explanation
	LiteralTranslation string            `bson:"literal"        json:"literal"`
	Origin            string             `bson:"origin"         json:"origin,omitempty"`
	Example           string             `bson:"example"        json:"example,omitempty"`
	Tags              []string           `bson:"tags"           json:"tags"`
	CreatedAt         time.Time          `bson:"created_at"     json:"created_at"`
	UpdatedAt         time.Time          `bson:"updated_at"     json:"updated_at"`
}
