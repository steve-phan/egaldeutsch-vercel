package utils

import (
	"log"
	"net/http"
)

// LogError log an internal error message with context and sends a public error response to the client.
func LogError(w http.ResponseWriter, err error, message string, code int) {
	if err != nil {
		log.Printf("[ERROR] %s: %v", message, err)
	} else {
		log.Printf("[ERROR] %s", message)
	}
	http.Error(w, message, code)
}

// LogInfo logs an informational message.
func LogInfo(message string, args ...interface{}) {
	log.Printf("[INFO] "+message, args...)
}

// LogDebug logs a debug message if verbose logging were enabled (simplified for now).
func LogDebug(message string, args ...interface{}) {
	log.Printf("[DEBUG] "+message, args...)
}
