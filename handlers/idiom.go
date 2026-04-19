package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"egaldeutsch-vercel/db"
	"egaldeutsch-vercel/mock"
	"egaldeutsch-vercel/models"
	"egaldeutsch-vercel/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
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

	w.Header().Set("Content-Type", "application/json")

	// Optional User ID via JWT
	var userID *primitive.ObjectID
	claims, err := utils.GetClaimsFromRequest(r)
	if err == nil {
		if id, err := primitive.ObjectIDFromHex(claims.UserID); err == nil {
			userID = &id
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Logic for Mock Mode
	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		var excludeSlugs []string
		if userID != nil {
			u, err := mockDB.GetUserByID(*userID)
			if err == nil {
				excludeSlugs = u.SeenIdioms
			}
		}
		
		idiom := mockDB.GetRandomIdiom(excludeSlugs)
		if idiom == nil {
			http.Error(w, "No idioms found", http.StatusNotFound)
			return
		}

		// Record seen idiom for logged-in user
		if userID != nil {
			mockDB.MarkIdiomSeen(*userID, idiom.Slug)
		}

		json.NewEncoder(w).Encode(idiom)
		return
	}

	collection := db.GetCollection("idioms")
	userColl := db.GetCollection("users")

	matchStage := bson.M{}

	// If logged in, fetch seen idioms to exclude
	if userID != nil {
		var user models.User
		err := userColl.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
		if err == nil && len(user.SeenIdioms) > 0 {
			matchStage["slug"] = bson.M{"$nin": user.SeenIdioms}
		}
	}

	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: matchStage}},
		{{Key: "$sample", Value: bson.M{"size": 1}}},
	}

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

	// FALLBACK: If we have zero results (user seen everything), try again WITHOUT the filter
	if len(idioms) == 0 && len(matchStage) > 0 {
		pipeline = mongo.Pipeline{
			{{Key: "$sample", Value: bson.M{"size": 1}}},
		}
		cursor, err = collection.Aggregate(ctx, pipeline)
		if err == nil {
			defer cursor.Close(ctx)
			cursor.All(ctx, &idioms)
		}
	}

	if len(idioms) == 0 {
		http.Error(w, "No idioms found", http.StatusNotFound)
		return
	}

	selected := idioms[0]

	// Record seen idiom for logged-in user (async)
	if userID != nil {
		go func(uid primitive.ObjectID, slug string) {
			bgCtx, bgCancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer bgCancel()
			userColl.UpdateOne(bgCtx, bson.M{"_id": uid}, bson.M{
				"$addToSet": bson.M{"seen_idioms": slug},
			})
		}(*userID, selected.Slug)
	}

	json.NewEncoder(w).Encode(selected)
}
