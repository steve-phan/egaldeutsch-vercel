package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"egaldeutsch-vercel/db"
	"egaldeutsch-vercel/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// IdiomsListHandler returns a list of all idioms.
func IdiomsListHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := db.GetClient().Database("egaldeutsch").Collection("idioms")

	// Options for sorting by creation date
	findOptions := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := collection.Find(ctx, bson.M{}, findOptions)
	if err != nil {
		http.Error(w, "Failed to fetch idioms", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var idioms []models.Idiom
	if err = cursor.All(ctx, &idioms); err != nil {
		http.Error(w, "Failed to decode idioms", http.StatusInternalServerError)
		return
	}

	if idioms == nil {
		idioms = []models.Idiom{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(idioms)
}

// IdiomBySlugHandler returns a single idiom by its slug.
func IdiomBySlugHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extract slug from URL /api/idioms/{slug}
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 4 {
		http.Error(w, "Missing slug", http.StatusBadRequest)
		return
	}
	slug := parts[len(parts)-1]

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := db.GetClient().Database("egaldeutsch").Collection("idioms")

	var idiom models.Idiom
	err := collection.FindOne(ctx, bson.M{"slug": slug}).Decode(&idiom)
	if err != nil {
		http.Error(w, "Idiom not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(idiom)
}

// IdiomRandomHandler returns a single random idiom.
func IdiomRandomHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := db.GetClient().Database("egaldeutsch").Collection("idioms")

	// Use aggregation to pick 1 random document
	pipeline := bson.A{bson.M{"$sample": bson.M{"size": 1}}}
	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		http.Error(w, "Failed to fetch random idiom", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var idioms []models.Idiom
	if err = cursor.All(ctx, &idioms); err != nil {
		http.Error(w, "Failed to decode random idiom", http.StatusInternalServerError)
		return
	}

	if len(idioms) == 0 {
		http.Error(w, "No idioms found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(idioms[0])
}
