package mock

import (
	"sync"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

// MockUser represents a user in the mock database
type MockUser struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email     string             `bson:"email"      json:"email"`
	Password  string             `bson:"password"   json:"-"`
	Name      string             `bson:"name"       json:"name"`
	Role      string             `bson:"role"       json:"role"`
	Language  string             `bson:"language"   json:"language"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}

// QuizOption holds a localized option for multiple-choice questions.
type QuizOption struct {
	De string `bson:"de" json:"de"`
	En string `bson:"en" json:"en"`
	Vi string `bson:"vi" json:"vi"`
}

// MockQuizQuestion is the in-memory representation of a quiz question.
type MockQuizQuestion struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Category      string             `bson:"category"       json:"category"`
	Subcategory   string             `bson:"subcategory"    json:"subcategory"`
	Level         string             `bson:"level"          json:"level"`
	Type          string             `bson:"type"           json:"type"`
	PromptDe      string             `bson:"prompt_de"      json:"prompt_de"`
	BlankIndex    *int               `bson:"blank_index"    json:"blank_index,omitempty"`
	Options       []QuizOption       `bson:"options"        json:"options,omitempty"`
	CorrectAnswer string             `bson:"correct_answer" json:"correct_answer"`
	ExplanationDe string             `bson:"explanation_de" json:"explanation_de"`
	ExplanationEn string             `bson:"explanation_en" json:"explanation_en"`
	ExplanationVi string             `bson:"explanation_vi" json:"explanation_vi"`
	HintDe        string             `bson:"hint_de"        json:"hint_de,omitempty"`
	HintEn        string             `bson:"hint_en"        json:"hint_en,omitempty"`
	HintVi        string             `bson:"hint_vi"        json:"hint_vi,omitempty"`
	Tags          []string           `bson:"tags"           json:"tags"`
	CreatedAt     time.Time          `bson:"created_at"     json:"created_at"`
	UpdatedAt     time.Time          `bson:"updated_at"     json:"updated_at"`
}

// MockQuizSession records a completed user quiz session.
type MockQuizSession struct {
	ID          primitive.ObjectID  `bson:"_id,omitempty" json:"id"`
	UserID      *primitive.ObjectID `bson:"user_id"      json:"user_id,omitempty"` // nil = guest
	Category    string              `bson:"category"     json:"category"`
	Level       string              `bson:"level"        json:"level"`
	Score       float64             `bson:"score"        json:"score"`
	TotalQ      int                 `bson:"total_q"      json:"total_q"`
	CorrectQ    int                 `bson:"correct_q"    json:"correct_q"`
	CompletedAt time.Time           `bson:"completed_at" json:"completed_at"`
}

// MockDB is the in-memory database.
type MockDB struct {
	users     map[primitive.ObjectID]*MockUser
	questions map[primitive.ObjectID]*MockQuizQuestion
	sessions  map[primitive.ObjectID]*MockQuizSession
	mu        sync.RWMutex
}

var (
	mockDBInstance *MockDB
	once           sync.Once
)

// GetMockDB returns the singleton mock database instance.
func GetMockDB() *MockDB {
	once.Do(func() {
		mockDBInstance = &MockDB{
			users:     make(map[primitive.ObjectID]*MockUser),
			questions: make(map[primitive.ObjectID]*MockQuizQuestion),
			sessions:  make(map[primitive.ObjectID]*MockQuizSession),
		}
		mockDBInstance.seedData()
	})
	return mockDBInstance
}

// ResetMockDB resets the mock database (useful for testing).
func ResetMockDB() {
	mockDBInstance = nil
	once = sync.Once{}
}

func (db *MockDB) seedData() {
	// Seed admin user
	adminPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	adminID := primitive.NewObjectID()
	db.users[adminID] = &MockUser{
		ID:        adminID,
		Email:     "admin@egaldeutsch.com",
		Password:  string(adminPassword),
		Name:      "Admin",
		Role:      "admin",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Seed test user
	userPassword, _ := bcrypt.GenerateFromPassword([]byte("user123"), bcrypt.DefaultCost)
	userID := primitive.NewObjectID()
	db.users[userID] = &MockUser{
		ID:        userID,
		Email:     "user@example.com",
		Password:  string(userPassword),
		Name:      "Test User",
		Role:      "user",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Seed quiz questions
	seedQuizQuestions(db)
}
