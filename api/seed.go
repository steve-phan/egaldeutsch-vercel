package handler

import (
	"context"
	"net/http"
	"time"

	"egaldeutsch-vercel/api/mock"
	"egaldeutsch-vercel/db"

	"go.mongodb.org/mongo-driver/bson"
)

func SeedHandler(w http.ResponseWriter, r *http.Request) {
	// In mock mode, data is already seeded
	if mock.IsMockMode() {
		w.Write([]byte("Mock database is ready with seeded data"))
		return
	}

	collection := db.GetCollection("lessons")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check if data exists
	count, err := collection.CountDocuments(ctx, bson.M{})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if count > 0 {
		w.Write([]byte("Database already seeded"))
		return
	}

	lessons := []interface{}{
		bson.M{
			"title":          "The Break Room",
			"description":    "Learn how to start a conversation in the break room.",
			"audio_url":      "https://s3.amazonaws.com/freecodecamp/curriculum/english-for-developers/break-room.mp3", // Placeholder URL
			"transcript":     "Hey, how's it going? \nGood, thanks. How about you? \nNot bad. Did you catch the game last night?",
			"quiz_question":  "What is a common way to ask how someone is doing?",
			"quiz_options":   []string{"How's it going?", "What is your function?", "Execute order 66"},
			"correct_answer": "How's it going?",
		},
		bson.M{
			"title":          "Daily Standup",
			"description":    "Common phrases used during daily standup meetings.",
			"audio_url":      "https://s3.amazonaws.com/freecodecamp/curriculum/english-for-developers/standup.mp3", // Placeholder URL
			"transcript":     "Yesterday I worked on the API. \nToday I will continue with the frontend. \nNo blockers.",
			"quiz_question":  "What should you mention if you are stuck?",
			"quiz_options":   []string{"I have a blocker", "I am broken", "System failure"},
			"correct_answer": "I have a blocker",
		},
	}

	_, err = collection.InsertMany(ctx, lessons)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write([]byte("Database seeded successfully"))
}
