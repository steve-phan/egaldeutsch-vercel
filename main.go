package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"egaldeutsch-vercel/db"
	"egaldeutsch-vercel/mock"
	"egaldeutsch-vercel/router"
	"github.com/joho/godotenv"
)

func main() {
	// Securely load NextJS adjacent ENV keys when running locally
	if err := godotenv.Load(".env.local"); err != nil {
		log.Println("No .env.local file found, relying on system vars")
	}

	// Verify if BREVO_API_KEY is loaded
	if os.Getenv("BREVO_API_KEY") == "" {
		log.Println("WARNING: BREVO_API_KEY is not set. Emails will not be sent.")
	} else {
		log.Println("BREVO_API_KEY is successfully loaded.")
	}

	// Initialize mock database for localhost development
	// You can also initialize real Mongo here if ENV is set
	if mock.IsMockMode() {
		log.Println("Initializing standalone Mock DB...")
		mock.GetMockDB() // Triggers initialization
	} else {
		log.Println("Initializing standalone MongoDB connection...")
		db.GetClient() // Fails gracefully if no uri
	}

	mux := router.NewRouter()

	port := ":8080"
	fmt.Printf("Locally serving EgalDeutsch API on http://localhost%s...\n", port)
	
	// Start standalone HTTP Server
	err := http.ListenAndServe(port, mux)
	if err != nil {
		log.Fatalf("Failed to start localhost server: %v", err)
	}
}
