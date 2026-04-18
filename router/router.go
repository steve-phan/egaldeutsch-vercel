package router

import (
	"net/http"

	"egaldeutsch-vercel/handlers"
)

// NewRouter constructs a completely standard Go multiplexer wrapped with logging middleware.
func NewRouter() http.Handler {
	mux := http.NewServeMux()

	// --- Account Routes ---
	mux.HandleFunc("/api/account/login", handlers.LoginHandler)
	mux.HandleFunc("/api/account/signup", handlers.SignupHandler)
	mux.HandleFunc("/api/account/forgot-password", handlers.ForgotPasswordHandler)
	mux.HandleFunc("/api/account/reset-password", handlers.ResetPasswordHandler)
	mux.HandleFunc("/api/account/user", handlers.UserHandler)
	mux.HandleFunc("/api/account/admin-users", handlers.AdminUsersHandler)

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

	// --- Idiom Routes ---
	mux.HandleFunc("/api/idioms", handlers.IdiomsListHandler)
	mux.HandleFunc("/api/idioms/random", handlers.IdiomRandomHandler)
	mux.HandleFunc("/api/idioms/", handlers.IdiomBySlugHandler)

	return LoggingMiddleware(mux)
}
