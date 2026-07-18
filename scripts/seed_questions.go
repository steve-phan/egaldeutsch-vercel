package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"egaldeutsch-vercel/models"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	fmt.Println("🚀 Starting incremental question seeding...")

	if err := godotenv.Load(".env.local"); err != nil {
		log.Println("No .env.local file found, checking system environment...")
	}

	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		log.Fatal("MONGODB_URI not set")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}
	defer client.Disconnect(ctx)

	collection := client.Database("egaldeutsch").Collection("questions")
	categoryFilter := os.Getenv("QUESTION_CATEGORY")
	questionsFile := os.Getenv("QUESTIONS_FILE")
	if questionsFile == "" {
		questionsFile = "scripts/data/questions.json"
	}
	shouldUpdateExisting := os.Getenv("UPDATE_EXISTING_QUESTIONS") == "true"

	data, err := os.ReadFile(questionsFile)
	if err != nil {
		log.Fatalf("Failed to read %s: %v", questionsFile, err)
	}

	var questions []models.QuizQuestion
	if err := json.Unmarshal(data, &questions); err != nil {
		log.Fatalf("Failed to parse %s: %v", questionsFile, err)
	}

	fmt.Printf("📚 Loaded %d questions from %s\n", len(questions), questionsFile)

	added := 0
	updated := 0
	skipped := 0
	existingSkipped := 0

	for _, question := range questions {
		if categoryFilter != "" && question.Category != categoryFilter {
			skipped++
			continue
		}

		if err := question.Validate(); err != nil {
			log.Printf("⚠️ Skipping invalid question %q: %v", question.PromptDe, err)
			skipped++
			continue
		}

		var existing models.QuizQuestion
		filter := bson.M{"prompt_de": question.PromptDe}
		err := collection.FindOne(ctx, filter).Decode(&existing)

		now := time.Now()
		question.UpdatedAt = now

		if err == mongo.ErrNoDocuments {
			question.ID = primitive.NewObjectID()
			question.CreatedAt = now
			if question.Status == "" {
				question.Status = "published"
			}

			if _, err := collection.InsertOne(ctx, question); err != nil {
				log.Printf("❌ Failed to insert %q: %v", question.PromptDe, err)
				skipped++
				continue
			}

			added++
			continue
		}

		if err != nil {
			log.Printf("❌ Failed to check %q: %v", question.PromptDe, err)
			skipped++
			continue
		}

		if !shouldUpdateExisting {
			existingSkipped++
			continue
		}

		question.ID = existing.ID
		question.CreatedAt = existing.CreatedAt
		if question.Status == "" {
			question.Status = existing.Status
		}

		update := bson.M{"$set": question}
		result, err := collection.UpdateOne(ctx, filter, update)
		if err != nil {
			log.Printf("❌ Failed to update %q: %v", question.PromptDe, err)
			skipped++
			continue
		}

		if result.ModifiedCount > 0 {
			updated++
		}
	}

	fmt.Printf(
		"✅ Question seeding complete. Added: %d, Updated: %d, Existing skipped: %d, Other skipped: %d\n",
		added,
		updated,
		existingSkipped,
		skipped,
	)
}
