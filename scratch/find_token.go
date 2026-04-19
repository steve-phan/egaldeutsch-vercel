package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		log.Fatal("MONGODB_URI not set")
	}

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	collection := client.Database("egaldeutsch").Collection("users")

	var result bson.M
	// Find user with a reset token, sorted by expiry descending
	opts := options.FindOne().SetSort(bson.D{{Key: "reset_token_expiry", Value: -1}})
	err = collection.FindOne(ctx, bson.M{"reset_token": bson.M{"$exists": true}}, opts).Decode(&result)
	if err != nil {
		fmt.Printf("Error or no token found: %v\n", err)
		return
	}

	fmt.Printf("Token: %v\n", result["reset_token"])
	fmt.Printf("Email: %v\n", result["email"])
}
