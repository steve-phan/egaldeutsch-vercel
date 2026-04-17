package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"egaldeutsch-vercel/models"
)

func main() {
	// 1. Load env
	err := godotenv.Load(".env.local")
	if err != nil {
		log.Fatal("Error loading .env.local file")
	}

	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		log.Fatal("MONGODB_URI not set in .env.local")
	}

	// 2. Connect
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	dbName := "egaldeutsch" // Adjust if your URI doesn't specify it
	collection := client.Database(dbName).Collection("questions")

	// 3. Clear existing (Optional - let's keep it safe and just append or clear?)
	// For a seed script, clearing is usually better for testing.
	fmt.Println("Clearing existing questions...")
	collection.DeleteMany(ctx, primitive.D{})

	// 4. Sample Questions
	questions := []models.QuizQuestion{
		// A1 Artikel
		{
			ID:            primitive.NewObjectID(),
			Category:      "artikel",
			Level:         "A1",
			Type:          "multiple-choice",
			PromptDe:      "Was ist der richtige Artikel für 'Tisch'?",
			PromptEn:      "What is the correct article for 'Tisch' (table)?",
			PromptVi:      "Mạo từ đúng cho 'Tisch' là gì?",
			CorrectAnswer: "der",
			Options: []models.QuizOption{
				{De: "der", En: "the (masculine)", Vi: "giống đực"},
				{De: "die", En: "the (feminine)", Vi: "giống cái"},
				{De: "das", En: "the (neuter)", Vi: "giống trung"},
			},
			ExplanationDe: "'Tisch' ist maskulin im Deutschen.",
			ExplanationEn: "'Tisch' is masculine in German.",
			ExplanationVi: "'Tisch' là giống đực trong tiếng Đức.",
			CreatedAt:     time.Now(),
		},
		{
			ID:            primitive.NewObjectID(),
			Category:      "artikel",
			Level:         "A1",
			Type:          "fill-in-blank",
			PromptDe:      "___ Apfel ist rot.",
			PromptEn:      "___ apple is red.",
			PromptVi:      "___ quả táo màu đỏ.",
			CorrectAnswer: "Der",
			ExplanationDe: "Apfel is masculine and in Nominative case here.",
			CreatedAt:     time.Now(),
		},
		// A2 Präpositionen
		{
			ID:            primitive.NewObjectID(),
			Category:      "praepositionen",
			Level:         "A2",
			Type:          "multiple-choice",
			PromptDe:      "Ich fahre mit ___ Bus.",
			PromptEn:      "I am going by bus.",
			PromptVi:      "Tôi đi bằng xe buýt.",
			CorrectAnswer: "dem",
			Options: []models.QuizOption{
				{De: "den", En: "the (Accusative)", Vi: "biến cách 4"},
				{De: "dem", En: "the (Dative)", Vi: "biến cách 3"},
				{De: "das", En: "the (Nominative)", Vi: "biến cách 1"},
			},
			ExplanationDe: "'mit' verlangt immer den Dativ. 'Der Bus' wird im Dativ zu 'dem Bus'.",
			CreatedAt:     time.Now(),
		},
		// B1 Adjektiv-Endungen
		{
			ID:            primitive.NewObjectID(),
			Category:      "adjektiv-endungen",
			Level:         "B1",
			Type:          "fill-in-blank",
			PromptDe:      "Ein gut___ Kaffee ist wichtig.",
			PromptEn:      "A good coffee is important.",
			PromptVi:      "Một tách cà phê ngon là quan trọng.",
			CorrectAnswer: "er",
			ExplanationDe: "Gemischte Deklination, Maskulin, Nominativ.",
			CreatedAt:     time.Now(),
		},
		// B2 Konjunktiv 2
		{
			ID:            primitive.NewObjectID(),
			Category:      "konjunktiv-2",
			Level:         "B2",
			Type:          "multiple-choice",
			PromptDe:      "Wenn ich mehr Zeit ___, würde ich mehr lernen.",
			PromptEn:      "If I had more time, I would learn more.",
			PromptVi:      "Nếu tôi có nhiều thời gian hơn, tôi sẽ học nhiều hơn.",
			CorrectAnswer: "hätte",
			Options: []models.QuizOption{
				{De: "habe", En: "have (Indicative)", Vi: "có (hiện tại)"},
				{De: "hätte", En: "had (Subjunctive)", Vi: "có (giả định)"},
				{De: "hatte", En: "had (Past)", Vi: "đã có (quá khứ)"},
			},
			ExplanationDe: "Konjunktiv II drückt eine irreale Bedingung aus.",
			CreatedAt:     time.Now(),
		},
		// Word Order Test
		{
			ID:            primitive.NewObjectID(),
			Category:      "artikel",
			Level:         "A1",
			Type:          "word-order",
			PromptDe:      "Bauen Sie den Satz: (schön, ist, heute, Das Wetter)",
			PromptEn:      "Build the sentence: (beautiful, is, today, The weather)",
			PromptVi:      "Sắp xếp câu: (đẹp, là, hôm nay, Thời tiết)",
			CorrectAnswer: "Das Wetter ist heute schön",
			ExplanationDe: "Subjekt + Verb + Zeit + Adjektiv.",
			CreatedAt:     time.Now(),
		},
	}

	// 5. Insert
	var docs []interface{}
	for _, q := range questions {
		docs = append(docs, q)
	}

	result, err := collection.InsertMany(ctx, docs)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Successfully seeded %d questions into MongoDB!\n", len(result.InsertedIDs))
}
