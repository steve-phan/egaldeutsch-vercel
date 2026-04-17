package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"

	"egaldeutsch-vercel/models"
)

func main() {
	// 1. Load env
	err := godotenv.Load(".env.local")
	if err != nil {
		log.Println("Note: Error loading .env.local file, using system env")
	}

	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		log.Fatal("MONGODB_URI not set in .env.local or environment")
	}

	// 2. Connect
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	dbName := "egaldeutsch"
	
	// Collections
	questionsCol := client.Database(dbName).Collection("questions")
	usersCol := client.Database(dbName).Collection("users")
	resultsCol := client.Database(dbName).Collection("results")

	// 3. Purge Existing Data
	fmt.Println("🧹 Purging existing data (questions, users, results)...")
	questionsCol.DeleteMany(ctx, bson.M{})
	usersCol.DeleteMany(ctx, bson.M{})
	resultsCol.DeleteMany(ctx, bson.M{})

	// 4. Create Admin User
	fmt.Println("👤 Creating default admin account...")
	adminEmail := "admin@egaldeutsch.de"
	adminPassword := "admin123"
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(adminPassword), bcrypt.DefaultCost)

	adminUser := models.User{
		ID:       primitive.NewObjectID(),
		Name:     "System Admin",
		Email:    adminEmail,
		Password: string(hashedPassword),
		Role:     "admin",
	}
	_, err = usersCol.InsertOne(ctx, adminUser)
	if err != nil {
		log.Fatalf("Failed to create admin user: %v", err)
	}
	fmt.Printf("✅ Admin created: %s (Password: %s)\n", adminEmail, adminPassword)

	// 5. Seed Questions
	fmt.Println("📚 Seeding quiz questions...")
	questions := []models.QuizQuestion{
		// ARTIKEL (A1)
		{
			ID:            primitive.NewObjectID(),
			Category:      "artikel",
			Level:         "A1",
			Type:          "multiple-choice",
			PromptDe:      "Was ist der richtige Artikel für 'Tisch'?",
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
			Status:        "published",
		},
		{
			ID:            primitive.NewObjectID(),
			Category:      "artikel",
			Level:         "A1",
			Type:          "fill-in-blank",
			PromptDe:      "___ Apfel ist rot.",
			CorrectAnswer: "Der",
			ExplanationDe: "Apfel ist maskulin. Im Nominativ ist der Artikel 'der'.",
			ExplanationEn: "Apfel is masculine. In the Nominative case, the article is 'der'.",
			ExplanationVi: "Apfel là giống đực. Trong cách Nominative, mạo từ là 'der'.",
			CreatedAt:     time.Now(),
			Status:        "published",
		},
		// PRÄPOSITIONEN (A2)
		{
			ID:            primitive.NewObjectID(),
			Category:      "praepositionen",
			Level:         "A2",
			Type:          "multiple-choice",
			PromptDe:      "Ich fahre mit ___ Bus (m).",
			CorrectAnswer: "dem",
			Options: []models.QuizOption{
				{De: "den", En: "the (Accusative)", Vi: "biến cách 4"},
				{De: "dem", En: "the (Dative)", Vi: "biến cách 3"},
				{De: "das", En: "the (Nominative)", Vi: "biến cách 1"},
			},
			ExplanationDe: "'mit' benutzt man immer mit dem Dativ. 'Der Bus' wird im Dativ zu 'dem Bus'.",
			ExplanationEn: "'mit' is always used with the Dative case. 'Der Bus' becomes 'dem Bus'.",
			ExplanationVi: "'mit' luôn đi với cách Dative. 'Der Bus' trở thành 'dem Bus'.",
			CreatedAt:     time.Now(),
			Status:        "published",
		},
		// ADJEKTIV-ENDUNGEN (B1)
		{
			ID:            primitive.NewObjectID(),
			Category:      "adjektivendungen",
			Level:         "B1",
			Type:          "fill-in-blank",
			PromptDe:      "Ein gut___ Kaffee ist wichtig.",
			CorrectAnswer: "er",
			ExplanationDe: "Maskulin, Nominativ, unbestimmter Artikel (gemischte Deklination).",
			ExplanationEn: "Masculine, Nominative, indefinite article (mixed declension).",
			ExplanationVi: "Giống đực, Nominative, mạo từ không xác định.",
			CreatedAt:     time.Now(),
			Status:        "published",
		},
		// KONJUNKTIV 2 (B2)
		{
			ID:            primitive.NewObjectID(),
			Category:      "konjunktiv",
			Level:         "B2",
			Type:          "multiple-choice",
			PromptDe:      "Wenn ich mehr Zeit ___, würde ich mehr lernen.",
			CorrectAnswer: "hätte",
			Options: []models.QuizOption{
				{De: "habe", En: "have (Indicative)", Vi: "có (hiện tại)"},
				{De: "hätte", En: "had (Subjunctive)", Vi: "có (giả định)"},
				{De: "hatte", En: "had (Past)", Vi: "đã có (quá khứ)"},
			},
			ExplanationDe: "Konjunktiv II drückt eine irreale Bedingung in der Gegenwart aus.",
			ExplanationEn: "Subjunctive II expresses an unreal condition in the present.",
			ExplanationVi: "Konjunktiv II diễn tả một điều kiện không có thật ở hiện tại.",
			CreatedAt:     time.Now(),
			Status:        "published",
		},
		// WORD ORDER (A1)
		{
			ID:            primitive.NewObjectID(),
			Category:      "wortstellung",
			Level:         "A1",
			Type:          "word-order",
			PromptDe:      "Bauen Sie den Satz: (schön, ist, heute, Das Wetter)",
			CorrectAnswer: "Das Wetter ist heute schön",
			ExplanationDe: "Regel: Subjekt + Verb + Zeit + Adjektiv.",
			ExplanationEn: "Rule: Subject + Verb + Time + Adjective.",
			ExplanationVi: "Quy tắc: Chủ ngữ + Động từ + Thời gian + Tính từ.",
			CreatedAt:     time.Now(),
			Status:        "published",
		},
	}

	var docs []interface{}
	for _, q := range questions {
		docs = append(docs, q)
	}

	result, err := questionsCol.InsertMany(ctx, docs)
	if err != nil {
		log.Fatalf("Failed to seed questions: %v", err)
	}

	fmt.Printf("✅ Successfully seeded %d questions into MongoDB!\n", len(result.InsertedIDs))
	fmt.Println("🚀 Database reset and seeding complete!")
}
