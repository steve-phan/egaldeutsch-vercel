package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"egaldeutsch-vercel/db"
	"egaldeutsch-vercel/models"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Levenshtein distance for string similarity
func levenshtein(s, t string) int {
	m, n := len(s), len(t)
	if m == 0 {
		return n
	}
	if n == 0 {
		return m
	}
	d := make([][]int, m+1)
	for i := range d {
		d[i] = make([]int, n+1)
		d[i][0] = i
	}
	for j := 0; j <= n; j++ {
		d[0][j] = j
	}
	for j := 1; j <= n; j++ {
		for i := 1; i <= m; i++ {
			cost := 1
			if s[i-1] == t[j-1] {
				cost = 0
			}
			d[i][j] = min(d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1]+cost)
		}
	}
	return d[m][n]
}

func min(a ...int) int {
	m := a[0]
	for _, x := range a {
		if x < m {
			m = x
		}
	}
	return m
}

func similarity(s, t string) float64 {
	dist := levenshtein(s, t)
	maxLen := len(s)
	if len(t) > maxLen {
		maxLen = len(t)
	}
	if maxLen == 0 {
		return 1.0
	}
	return 1.0 - float64(dist)/float64(maxLen)
}

func main() {
	// Load .env.local if exists
	_ = godotenv.Load(".env.local")

	collection := db.GetCollection("questions")
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	fmt.Println("Fetching questions from database...")
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		log.Fatalf("Failed to fetch questions: %v", err)
	}
	defer cursor.Close(ctx)

	var questions []models.QuizQuestion
	if err := cursor.All(ctx, &questions); err != nil {
		log.Fatalf("Failed to decode questions: %v", err)
	}

	fmt.Printf("Total questions: %d\n", len(questions))

	// Group by category
	byCategory := make(map[string][]models.QuizQuestion)
	for _, q := range questions {
		byCategory[string(q.Category)] = append(byCategory[string(q.Category)], q)
	}

	toRemove := make(map[primitive.ObjectID]bool)
	threshold := 0.88

	fmt.Println("Analyzing duplicates...")
	for cat, items := range byCategory {
		for i := 0; i < len(items); i++ {
			if toRemove[items[i].ID] {
				continue
			}

			promptI := strings.ToLower(strings.TrimSpace(items[i].PromptDe))
			answerI := strings.ToLower(strings.TrimSpace(items[i].CorrectAnswer))

			for j := i + 1; j < len(items); j++ {
				if toRemove[items[j].ID] {
					continue
				}

				promptJ := strings.ToLower(strings.TrimSpace(items[j].PromptDe))
				answerJ := strings.ToLower(strings.TrimSpace(items[j].CorrectAnswer))

				// Basic checks
				if answerI != answerJ {
					continue
				}

				// Special case for 'artikel'
				if cat == "artikel" {
					if promptI == promptJ {
						fmt.Printf("[%s] Exact duplicate found: %s\n", cat, items[j].PromptDe)
						toRemove[items[j].ID] = true
					}
					continue
				}

				// Similarity check for other categories
				sim := similarity(promptI, promptJ)
				if sim >= threshold {
					fmt.Printf("[%s] Similar found (%.2f): %s\n", cat, sim, items[j].PromptDe)
					toRemove[items[j].ID] = true
				}
			}
		}
	}

	if len(toRemove) == 0 {
		fmt.Println("No duplicates found.")
		return
	}

	fmt.Printf("\nFound %d duplicates to delete.\n", len(toRemove))
	
	// Check for dry run
	if os.Getenv("EXECUTE_CLEANUP") != "true" {
		fmt.Println("\nDRY RUN: Set EXECUTE_CLEANUP=true to actually delete from database.")
		return
	}

	fmt.Println("\nStarting deletion...")
	var ids []primitive.ObjectID
	for id := range toRemove {
		ids = append(ids, id)
	}

	deleteRes, err := collection.DeleteMany(ctx, bson.M{"_id": bson.M{"$in": ids}})
	if err != nil {
		log.Fatalf("Failed to delete duplicates: %v", err)
	}

	fmt.Printf("Successfully deleted %d questions.\n", deleteRes.DeletedCount)
}
