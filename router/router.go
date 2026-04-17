package router

import (
	"net/http"

	"egaldeutsch-vercel/handlers"
)

// NewRouter constructs a completely standard Go multiplexer
// that maps all the previously detached Vercel endpoints to a given package handler.
func NewRouter() *http.ServeMux {
	mux := http.NewServeMux()

	// --- Auth Routes ---
	mux.HandleFunc("/api/auth/login", handlers.LoginHandler)
	mux.HandleFunc("/api/auth/signup", handlers.SignupHandler)
	mux.HandleFunc("/api/auth/forgot-password", handlers.ForgotPasswordHandler)
	mux.HandleFunc("/api/auth/reset-password", handlers.ResetPasswordHandler)
	mux.HandleFunc("/api/auth/user", handlers.UserHandler)
	mux.HandleFunc("/api/auth/admin-users", handlers.AdminUsersHandler)

	// --- User Profile Routes ---
	mux.HandleFunc("/api/user/profile", handlers.UpdateProfileHandler)

	// --- Dashboard Routes ---
	mux.HandleFunc("/api/dashboard", handlers.DashboardHandler)

	// --- Quiz Routes ---
	mux.HandleFunc("/api/quiz/questions", handlers.QuizQuestionsHandler)
	mux.HandleFunc("/api/quiz/categories", handlers.QuizCategoriesHandler)
	mux.HandleFunc("/api/quiz/submit", handlers.QuizSubmitHandler)

	// --- Admin Routes ---
	mux.HandleFunc("/api/admin/questions", handlers.AdminQuestionsHandler)

	return mux
}
