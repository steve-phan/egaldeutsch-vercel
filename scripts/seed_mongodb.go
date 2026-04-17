package main

import (
	"context"
	"encoding/json"
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

	fmt.Println("🚀 Starting Incremental Seeding...")

	// 3. Handle Admin User (Upsert)
	fmt.Println("👤 Checking admin account...")
	adminEmail := "admin@egaldeutsch.de"
	adminPassword := "admin123"

	// Check if admin exists
	var existingAdmin models.User
	err = usersCol.FindOne(ctx, bson.M{"email": adminEmail}).Decode(&existingAdmin)

	if err == mongo.ErrNoDocuments {
		fmt.Println("   Creating default admin account...")
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
		fmt.Printf("✅ Admin created: %s\n", adminEmail)
	} else if err != nil {
		log.Fatalf("Error checking admin: %v", err)
	} else {
		fmt.Printf("✅ Admin already exists: %s\n", adminEmail)
	}

	// 4. Seed Questions incrementally
	fmt.Println("📚 Loading questions from JSON...")
	questionsFile, err := os.ReadFile("scripts/data/questions.json")
	if err != nil {
		log.Fatalf("Failed to read questions file: %v", err)
	}

	var jsonQuestions []models.QuizQuestion
	if err := json.Unmarshal(questionsFile, &jsonQuestions); err != nil {
		log.Fatalf("Failed to unmarshal questions: %v", err)
	}

	fmt.Println("🔍 Filtering for new questions...")

	// Load existing prompts to avoid duplicates
	cursor, err := questionsCol.Find(ctx, bson.M{}, options.Find().SetProjection(bson.M{"prompt_de": 1}))
	if err != nil {
		log.Fatalf("Failed to fetch existing questions: %v", err)
	}
	defer cursor.Close(ctx)

	existingPrompts := make(map[string]bool)
	for cursor.Next(ctx) {
		var q struct {
			PromptDe string `bson:"prompt_de"`
		}
		if err := cursor.Decode(&q); err == nil {
			existingPrompts[q.PromptDe] = true
		}
	}

	var newQuestions []interface{}
	for _, q := range jsonQuestions {
		if !existingPrompts[q.PromptDe] {
			// Populate ID and Timestamps for new items
			q.ID = primitive.NewObjectID()
			q.CreatedAt = time.Now()
			q.UpdatedAt = time.Now()
			newQuestions = append(newQuestions, q)
		}
	}

	if len(newQuestions) > 0 {
		_, err := questionsCol.InsertMany(ctx, newQuestions)
		if err != nil {
			log.Fatalf("Failed to insert new questions: %v", err)
		}
		fmt.Printf("✅ Successfully added %d NEW questions to the database!\n", len(newQuestions))
	} else {
		fmt.Println("ℹ️ No new questions found in JSON. Database is up to date.")
	}

	fmt.Println("🚀 Incremental seeding complete!")
}
