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
	mux.HandleFunc("/api/account/google-sync", handlers.GoogleSyncHandler)
	mux.HandleFunc("/api/account/change-password", handlers.ChangePasswordHandler)
	mux.HandleFunc("/api/account/delete-request", handlers.RequestAccountDeletionHandler)
	mux.HandleFunc("/api/account/delete-confirm", handlers.ConfirmAccountDeletionHandler)

	// --- User Profile Routes ---
	mux.HandleFunc("/api/user/profile", handlers.UpdateProfileHandler)

	// --- Dashboard Routes ---
	mux.HandleFunc("/api/dashboard", handlers.DashboardHandler)

	// --- Quiz Routes ---
	mux.HandleFunc("/api/quiz/questions", handlers.QuizQuestionsHandler)
	mux.HandleFunc("/api/quiz/categories", handlers.QuizCategoriesHandler)
	mux.HandleFunc("/api/quiz/submit", handlers.QuizSubmitHandler)
	mux.HandleFunc("/api/quiz/leaderboard", handlers.LeaderboardHandler)

	// --- Admin Routes ---
	mux.HandleFunc("/api/admin/questions", handlers.AdminQuestionsHandler)

	// --- Idiom Routes ---
	mux.HandleFunc("/api/idioms", handlers.IdiomsListHandler)
	mux.HandleFunc("/api/idioms/random", handlers.IdiomRandomHandler)
	mux.HandleFunc("/api/idioms/", handlers.IdiomBySlugHandler)

	// --- Feedback Routes ---
	mux.HandleFunc("/api/feedback", handlers.FeedbackHandler)
	mux.HandleFunc("/api/admin/feedback", handlers.AdminFeedbackHandler)

	// --- Notification Routes ---
	mux.HandleFunc("/api/user/notifications", handlers.GetNotificationsHandler)
	mux.HandleFunc("/api/user/notifications/read", handlers.MarkNotificationReadHandler)
	mux.HandleFunc("/api/user/grammar-progress", handlers.GrammarProgressHandler)

	return LoggingMiddleware(CORSMiddleware(mux))
}
