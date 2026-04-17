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

	// 5. Seed Questions from JSON
	fmt.Println("📚 Loading quiz questions from JSON...")
	questionsFile, err := os.ReadFile("scripts/data/questions.json")
	if err != nil {
		log.Fatalf("Failed to read questions file: %v", err)
	}

	var questions []models.QuizQuestion
	if err := json.Unmarshal(questionsFile, &questions); err != nil {
		log.Fatalf("Failed to unmarshal questions: %v", err)
	}

	var docs []interface{}
	for i := range questions {
		if questions[i].ID.IsZero() {
			questions[i].ID = primitive.NewObjectID()
		}
		if questions[i].CreatedAt.IsZero() {
			questions[i].CreatedAt = time.Now()
		}
		if questions[i].UpdatedAt.IsZero() {
			questions[i].UpdatedAt = time.Now()
		}
		docs = append(docs, questions[i])
	}

	if len(docs) > 0 {
		result, err := questionsCol.InsertMany(ctx, docs)
		if err != nil {
			log.Fatalf("Failed to seed questions: %v", err)
		}
		fmt.Printf("✅ Successfully seeded %d questions into MongoDB!\n", len(result.InsertedIDs))
	} else {
		fmt.Println("⚠️ No questions found in JSON file to seed.")
	}

	fmt.Println("🚀 Database reset and seeding complete!")
}
