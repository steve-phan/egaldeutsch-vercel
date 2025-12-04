package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"egaldeutsch-vercel/api/db"
	"egaldeutsch-vercel/api/mock"
	"egaldeutsch-vercel/api/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CommentResponse struct {
	ID        string    `json:"id"`
	LessonID  string    `json:"lesson_id"`
	UserID    string    `json:"user_id"`
	UserName  string    `json:"user_name"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

type CreateCommentRequest struct {
	LessonID string `json:"lesson_id"`
	Content  string `json:"content"`
}

// CommentsHandler handles GET (list comments) and POST (create comment) operations
func CommentsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		getComments(w, r)
	case http.MethodPost:
		createComment(w, r)
	case http.MethodDelete:
		deleteComment(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getComments(w http.ResponseWriter, r *http.Request) {
	lessonIDStr := r.URL.Query().Get("lesson_id")
	if lessonIDStr == "" {
		http.Error(w, "Lesson ID required", http.StatusBadRequest)
		return
	}

	lessonID, err := primitive.ObjectIDFromHex(lessonIDStr)
	if err != nil {
		http.Error(w, "Invalid lesson ID", http.StatusBadRequest)
		return
	}

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		mockComments := mockDB.GetCommentsByLessonID(lessonID)

		comments := make([]CommentResponse, 0, len(mockComments))
		for _, c := range mockComments {
			comments = append(comments, CommentResponse{
				ID:        c.ID.Hex(),
				LessonID:  c.LessonID.Hex(),
				UserID:    c.UserID.Hex(),
				UserName:  c.UserName,
				Content:   c.Content,
				CreatedAt: c.CreatedAt,
			})
		}

		json.NewEncoder(w).Encode(comments)
		return
	}

	collection := db.GetCollection("comments")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"lesson_id": lessonID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var comments []CommentResponse
	if err = cursor.All(ctx, &comments); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if comments == nil {
		comments = []CommentResponse{}
	}

	json.NewEncoder(w).Encode(comments)
}

func createComment(w http.ResponseWriter, r *http.Request) {
	// Get user from token
	claims, err := utils.GetClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req CreateCommentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.LessonID == "" || req.Content == "" {
		http.Error(w, "Lesson ID and content are required", http.StatusBadRequest)
		return
	}

	lessonID, err := primitive.ObjectIDFromHex(req.LessonID)
	if err != nil {
		http.Error(w, "Invalid lesson ID", http.StatusBadRequest)
		return
	}

	userID, err := primitive.ObjectIDFromHex(claims.UserID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		
		// Get user name
		user, err := mockDB.GetUserByID(userID)
		if err != nil {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}

		comment, err := mockDB.CreateComment(lessonID, userID, user.Name, req.Content)
		if err != nil {
			if err == mock.ErrNotFound {
				http.Error(w, "Lesson not found", http.StatusNotFound)
				return
			}
			http.Error(w, "Failed to create comment", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(CommentResponse{
			ID:        comment.ID.Hex(),
			LessonID:  comment.LessonID.Hex(),
			UserID:    comment.UserID.Hex(),
			UserName:  comment.UserName,
			Content:   comment.Content,
			CreatedAt: comment.CreatedAt,
		})
		return
	}

	// Get user name from database
	usersCollection := db.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user struct {
		Name string `bson:"name"`
	}
	err = usersCollection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	commentsCollection := db.GetCollection("comments")
	
	now := time.Now()
	comment := bson.M{
		"lesson_id":  lessonID,
		"user_id":    userID,
		"user_name":  user.Name,
		"content":    req.Content,
		"created_at": now,
		"updated_at": now,
	}

	result, err := commentsCollection.InsertOne(ctx, comment)
	if err != nil {
		http.Error(w, "Failed to create comment", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(CommentResponse{
		ID:        result.InsertedID.(primitive.ObjectID).Hex(),
		LessonID:  req.LessonID,
		UserID:    claims.UserID,
		UserName:  user.Name,
		Content:   req.Content,
		CreatedAt: now,
	})
}

func deleteComment(w http.ResponseWriter, r *http.Request) {
	// Get user from token (for authorization)
	claims, err := utils.GetClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	commentIDStr := r.URL.Query().Get("id")
	if commentIDStr == "" {
		http.Error(w, "Comment ID required", http.StatusBadRequest)
		return
	}

	commentID, err := primitive.ObjectIDFromHex(commentIDStr)
	if err != nil {
		http.Error(w, "Invalid comment ID", http.StatusBadRequest)
		return
	}

	userID, err := primitive.ObjectIDFromHex(claims.UserID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	if mock.IsMockMode() {
		mockDB := mock.GetMockDB()
		
		// Check if user is admin or comment owner
		user, err := mockDB.GetUserByID(userID)
		if err != nil {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}

		// For simplicity, allow admin or any user to delete (you could add more logic)
		if user.Role != "admin" {
			// In a real app, check if the user owns the comment
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		err = mockDB.DeleteComment(commentID)
		if err != nil {
			http.Error(w, "Comment not found", http.StatusNotFound)
			return
		}

		json.NewEncoder(w).Encode(map[string]string{"message": "Comment deleted successfully"})
		return
	}

	collection := db.GetCollection("comments")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// For real DB, you would check ownership or admin status
	result, err := collection.DeleteOne(ctx, bson.M{"_id": commentID})
	if err != nil {
		http.Error(w, "Failed to delete comment", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "Comment not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Comment deleted successfully"})
}
