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
	fmt.Println("🚀 Starting Idioms Incremental Seeding...")

	// Load env
	if err := godotenv.Load(".env.local"); err != nil {
		log.Println("No .env.local file found, checking system environment...")
	}

	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		log.Fatal("MONGODB_URI not set")
	}

	// Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}
	defer client.Disconnect(ctx)

	dbName := "egaldeutsch"
	collection := client.Database(dbName).Collection("idioms")

	// Read idioms from JSON
	dataPath := "scripts/data/idioms.json"
	data, err := os.ReadFile(dataPath)
	if err != nil {
		log.Fatalf("Failed to read %s: %v", dataPath, err)
	}

	var jsonIdioms []models.Idiom
	if err := json.Unmarshal(data, &jsonIdioms); err != nil {
		log.Fatalf("Failed to parse JSON: %v", err)
	}

	fmt.Printf("📚 Loaded %d idioms from JSON\n", len(jsonIdioms))

	countAdded := 0
	countUpdated := 0

	for _, idiom := range jsonIdioms {
		// Prepare data
		if idiom.Slug == "" {
			log.Printf("⚠️ Skipping idiom without slug: %s", idiom.Title)
			continue
		}

		// Check if it exists to provide better logs
		filter := bson.M{"slug": idiom.Slug}
		var existing models.Idiom
		err := collection.FindOne(ctx, filter).Decode(&existing)

		// Set timestamps
		now := time.Now()
		idiom.UpdatedAt = now
		if err == mongo.ErrNoDocuments {
			idiom.ID = primitive.NewObjectID()
			idiom.CreatedAt = now
		} else if err == nil {
			idiom.ID = existing.ID
			idiom.CreatedAt = existing.CreatedAt
		} else {
			log.Printf("❌ Error checking idiom %s: %v", idiom.Slug, err)
			continue
		}

		// Upsert
		update := bson.M{"$set": idiom}
		opts := options.Update().SetUpsert(true)

		res, err := collection.UpdateOne(ctx, filter, update, opts)
		if err != nil {
			log.Printf("❌ Failed to seed idiom %s: %v", idiom.Title, err)
			continue
		}

		if res.UpsertedCount > 0 {
			fmt.Printf("✅ ADDED: %s\n", idiom.Title)
			countAdded++
		} else if res.ModifiedCount > 0 {
			fmt.Printf("🔄 UPDATED: %s\n", idiom.Title)
			countUpdated++
		} else {
			fmt.Printf("➖ SKIPPED (No changes): %s\n", idiom.Title)
		}
	}

	fmt.Printf("\n🚀 Seeding complete! Added: %d, Updated: %d\n", countAdded, countUpdated)
}
