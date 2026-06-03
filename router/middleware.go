package router

import (
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

// responseWriter is a minimal wrapper for http.ResponseWriter that allows us to
// capture the HTTP status code and the response size.
type responseWriter struct {
	http.ResponseWriter
	status  int
	skipped bool
}

func (rw *responseWriter) WriteHeader(code int) {
	if rw.skipped {
		return
	}
	rw.status = code
	rw.ResponseWriter.WriteHeader(code)
	rw.skipped = true
}

func (rw *responseWriter) Write(b []byte) (int, error) {
	if !rw.skipped {
		rw.WriteHeader(http.StatusOK)
	}
	return rw.ResponseWriter.Write(b)
}

// LoggingMiddleware logs the incoming HTTP request and its processing time.
func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Wrap the response writer to capture the status code
		rw := &responseWriter{
			ResponseWriter: w,
			status:         http.StatusOK,
		}

		// Process the request
		next.ServeHTTP(rw, r)

		// Log the results
		duration := time.Since(start)
		log.Printf(
			"[%s] %s %s | Status: %d | Duration: %v",
			r.Method,
			r.RequestURI,
			r.RemoteAddr,
			rw.status,
			duration,
		)
	})
}

// CORSMiddleware allows the browser app to call the Go API from approved origins.
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if origin := r.Header.Get("Origin"); isAllowedOrigin(origin) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Vary", "Origin")
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, Origin, X-Requested-With")
		w.Header().Set("Access-Control-Max-Age", "86400")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func isAllowedOrigin(origin string) bool {
	if origin == "" {
		return false
	}

	origin = normalizeOrigin(origin)
	for _, allowedOrigin := range allowedOrigins() {
		if origin == normalizeOrigin(allowedOrigin) {
			return true
		}
	}

	return false
}

func allowedOrigins() []string {
	origins := []string{
		"http://localhost:3000",
		"http://127.0.0.1:3000",
		"http://localhost:5173",
		"http://127.0.0.1:5173",
		"https://egaldeutsch.com",
		"https://www.egaldeutsch.com",
	}

	for _, envKey := range []string{"CORS_ALLOWED_ORIGINS", "FRONTEND_URL", "NEXTAUTH_URL"} {
		if value := os.Getenv(envKey); value != "" {
			origins = append(origins, strings.Split(value, ",")...)
		}
	}

	return origins
}

func normalizeOrigin(origin string) string {
	return strings.TrimRight(strings.TrimSpace(origin), "/")
}
