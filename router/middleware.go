package router

import (
	"log"
	"net/http"
	"time"
)

// responseWriter is a minimal wrapper for http.ResponseWriter that allows us to
// capture the HTTP status code and the response size.
type responseWriter struct {
	http.ResponseWriter
	status      int
	skipped     bool
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
