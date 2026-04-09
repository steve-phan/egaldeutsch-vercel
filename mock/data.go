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
	Email     string             `bson:"email" json:"email"`
	Password  string             `bson:"password" json:"-"`
	Name      string             `bson:"name" json:"name"`
	Role      string             `bson:"role" json:"role"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}

// QuizType constants
const (
	QuizTypeMultipleChoice = "multiple-choice"
	QuizTypeWordScramble   = "word-scramble"
	QuizTypeMatchingPairs  = "matching-pairs"
)

// MatchingPair represents a word-match pair for matching quiz
type MatchingPair struct {
	ID    int    `bson:"id" json:"id"`
	Word  string `bson:"word" json:"word"`
	Match string `bson:"match" json:"match"`
}

// TranscriptSentence represents a single sentence in the transcript with its translation
type TranscriptSentence struct {
	Text        string `bson:"text" json:"text"`
	Translation string `bson:"translation" json:"translation"`
}

// MockLesson represents a lesson in the mock database
type MockLesson struct {
	ID            primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	Title         string               `bson:"title" json:"title"`
	Description   string               `bson:"description" json:"description"`
	AudioURL      string               `bson:"audio_url" json:"audio_url"`
	VideoURL      string               `bson:"video_url,omitempty" json:"video_url,omitempty"`
	Transcript    []TranscriptSentence `bson:"transcript" json:"transcript"`
	QuizType      string               `bson:"quiz_type" json:"quiz_type"`
	QuizQuestion  string               `bson:"quiz_question" json:"quiz_question"`
	QuizOptions   []string             `bson:"quiz_options" json:"quiz_options"`
	CorrectAnswer string               `bson:"correct_answer" json:"correct_answer"`
	ScrambleWord  string               `bson:"scramble_word,omitempty" json:"scramble_word,omitempty"`
	MatchingPairs []MatchingPair       `bson:"matching_pairs,omitempty" json:"matching_pairs,omitempty"`
	CreatedAt     time.Time            `bson:"created_at" json:"created_at"`
	UpdatedAt     time.Time            `bson:"updated_at" json:"updated_at"`
}

// MockComment represents a comment on a lesson
type MockComment struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	LessonID  primitive.ObjectID `bson:"lesson_id" json:"lesson_id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"user_id"`
	UserName  string             `bson:"user_name" json:"user_name"`
	Content   string             `bson:"content" json:"content"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}

// MockLessonProgress tracks user progress on lessons
type MockLessonProgress struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID      primitive.ObjectID `bson:"user_id" json:"user_id"`
	LessonID    primitive.ObjectID `bson:"lesson_id" json:"lesson_id"`
	Completed   bool               `bson:"completed" json:"completed"`
	QuizPassed  bool               `bson:"quiz_passed" json:"quiz_passed"`
	Attempts    int                `bson:"attempts" json:"attempts"`
	CompletedAt *time.Time         `bson:"completed_at,omitempty" json:"completed_at,omitempty"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time          `bson:"updated_at" json:"updated_at"`
}

// MockDB is an in-memory database for testing
type MockDB struct {
	users          map[primitive.ObjectID]*MockUser
	lessons        map[primitive.ObjectID]*MockLesson
	comments       map[primitive.ObjectID]*MockComment
	lessonProgress map[primitive.ObjectID]*MockLessonProgress
	mu             sync.RWMutex
}

var (
	mockDBInstance *MockDB
	once           sync.Once
)

// GetMockDB returns the singleton mock database instance
func GetMockDB() *MockDB {
	once.Do(func() {
		mockDBInstance = &MockDB{
			users:          make(map[primitive.ObjectID]*MockUser),
			lessons:        make(map[primitive.ObjectID]*MockLesson),
			comments:       make(map[primitive.ObjectID]*MockComment),
			lessonProgress: make(map[primitive.ObjectID]*MockLessonProgress),
		}
		mockDBInstance.seedData()
	})
	return mockDBInstance
}

// ResetMockDB resets the mock database (useful for testing)
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
		Name:      "Admin User",
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

	// Seed lessons
	lesson1ID := primitive.NewObjectID()
	db.lessons[lesson1ID] = &MockLesson{
		ID:          lesson1ID,
		Title:       "The Break Room",
		Description: "Learn how to start a conversation in the break room.",
		AudioURL:    "https://s3.amazonaws.com/freecodecamp/curriculum/english-for-developers/break-room.mp3",
		VideoURL:    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		Transcript: []TranscriptSentence{
			{Text: "Hey, how's it going?", Translation: "A casual greeting asking about someone's well-being"},
			{Text: "Good, thanks. How about you?", Translation: "Responding positively and returning the question"},
			{Text: "Not bad. Did you catch the game last night?", Translation: "Responding neutrally and starting a conversation about sports"},
		},
		QuizType:      QuizTypeMultipleChoice,
		QuizQuestion:  "What is a common way to ask how someone is doing?",
		QuizOptions:   []string{"How's it going?", "What is your function?", "Execute order 66"},
		CorrectAnswer: "How's it going?",
		ScrambleWord:  "GOING",
		MatchingPairs: []MatchingPair{
			{ID: 1, Word: "Greeting", Match: "How's it going?"},
			{ID: 2, Word: "Question", Match: "What is your function?"},
			{ID: 3, Word: "Command", Match: "Execute order 66"},
		},
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	lesson2ID := primitive.NewObjectID()
	db.lessons[lesson2ID] = &MockLesson{
		ID:          lesson2ID,
		Title:       "Daily Standup",
		Description: "Common phrases used during daily standup meetings.",
		AudioURL:    "https://s3.amazonaws.com/freecodecamp/curriculum/english-for-developers/standup.mp3",
		Transcript: []TranscriptSentence{
			{Text: "Yesterday I worked on the API.", Translation: "Reporting what was accomplished in the previous work day"},
			{Text: "Today I will continue with the frontend.", Translation: "Stating today's planned work"},
			{Text: "No blockers.", Translation: "Confirming there are no obstacles preventing progress"},
		},
		QuizType:      QuizTypeMultipleChoice,
		QuizQuestion:  "What should you mention if you are stuck?",
		QuizOptions:   []string{"I have a blocker", "I am broken", "System failure"},
		CorrectAnswer: "I have a blocker",
		ScrambleWord:  "BLOCKER",
		MatchingPairs: []MatchingPair{
			{ID: 1, Word: "Obstacle", Match: "I have a blocker"},
			{ID: 2, Word: "Error", Match: "I am broken"},
			{ID: 3, Word: "Crash", Match: "System failure"},
		},
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	lesson3ID := primitive.NewObjectID()
	db.lessons[lesson3ID] = &MockLesson{
		ID:          lesson3ID,
		Title:       "Code Review",
		Description: "Learn how to give and receive code review feedback professionally.",
		AudioURL:    "https://s3.amazonaws.com/freecodecamp/curriculum/english-for-developers/code-review.mp3",
		VideoURL:    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		Transcript: []TranscriptSentence{
			{Text: "Could you take a look at my pull request?", Translation: "Politely asking someone to review your code"},
			{Text: "Sure, I'll review it this afternoon.", Translation: "Agreeing to review and providing a timeframe"},
			{Text: "Thanks, let me know if you have any questions.", Translation: "Expressing gratitude and offering to help"},
		},
		QuizType:      QuizTypeMultipleChoice,
		QuizQuestion:  "How do you politely ask someone to review your code?",
		QuizOptions:   []string{"Could you take a look at my pull request?", "Review my code now!", "You must check this"},
		CorrectAnswer: "Could you take a look at my pull request?",
		ScrambleWord:  "REVIEW",
		MatchingPairs: []MatchingPair{
			{ID: 1, Word: "Polite Request", Match: "Could you take a look at my pull request?"},
			{ID: 2, Word: "Demand", Match: "Review my code now!"},
			{ID: 3, Word: "Order", Match: "You must check this"},
		},
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Seed comments
	comment1ID := primitive.NewObjectID()
	db.comments[comment1ID] = &MockComment{
		ID:        comment1ID,
		LessonID:  lesson1ID,
		UserID:    userID,
		UserName:  "Test User",
		Content:   "Great lesson! Very helpful for beginners.",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	comment2ID := primitive.NewObjectID()
	db.comments[comment2ID] = &MockComment{
		ID:        comment2ID,
		LessonID:  lesson1ID,
		UserID:    adminID,
		UserName:  "Admin User",
		Content:   "Thanks for the feedback! More lessons coming soon.",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Seed lesson progress
	progressID := primitive.NewObjectID()
	completedAt := time.Now()
	db.lessonProgress[progressID] = &MockLessonProgress{
		ID:          progressID,
		UserID:      userID,
		LessonID:    lesson1ID,
		Completed:   true,
		QuizPassed:  true,
		Attempts:    2,
		CompletedAt: &completedAt,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
}

