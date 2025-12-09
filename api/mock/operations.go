package mock

import (
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrNotFound      = errors.New("not found")
	ErrAlreadyExists = errors.New("already exists")
	ErrUnauthorized  = errors.New("unauthorized")
)

// User operations

func (db *MockDB) CreateUser(name, email, password string) (*MockUser, error) {
	db.mu.Lock()
	defer db.mu.Unlock()

	// Check if user exists
	for _, u := range db.users {
		if u.Email == email {
			return nil, ErrAlreadyExists
		}
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &MockUser{
		ID:        primitive.NewObjectID(),
		Name:      name,
		Email:     email,
		Password:  string(hashedPassword),
		Role:      "user",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	db.users[user.ID] = user
	return user, nil
}

func (db *MockDB) GetUserByEmail(email string) (*MockUser, error) {
	db.mu.RLock()
	defer db.mu.RUnlock()

	for _, u := range db.users {
		if u.Email == email {
			return u, nil
		}
	}
	return nil, ErrNotFound
}

func (db *MockDB) GetUserByID(id primitive.ObjectID) (*MockUser, error) {
	db.mu.RLock()
	defer db.mu.RUnlock()

	user, exists := db.users[id]
	if !exists {
		return nil, ErrNotFound
	}
	return user, nil
}

func (db *MockDB) GetAllUsers() []*MockUser {
	db.mu.RLock()
	defer db.mu.RUnlock()

	users := make([]*MockUser, 0, len(db.users))
	for _, u := range db.users {
		users = append(users, u)
	}
	return users
}

func (db *MockDB) UpdateUser(id primitive.ObjectID, name, email string) (*MockUser, error) {
	db.mu.Lock()
	defer db.mu.Unlock()

	user, exists := db.users[id]
	if !exists {
		return nil, ErrNotFound
	}

	// Check if email is taken by another user
	for _, u := range db.users {
		if u.Email == email && u.ID != id {
			return nil, ErrAlreadyExists
		}
	}

	user.Name = name
	user.Email = email
	user.UpdatedAt = time.Now()
	return user, nil
}

func (db *MockDB) UpdateUserPassword(id primitive.ObjectID, newPassword string) error {
	db.mu.Lock()
	defer db.mu.Unlock()

	user, exists := db.users[id]
	if !exists {
		return ErrNotFound
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.Password = string(hashedPassword)
	user.UpdatedAt = time.Now()
	return nil
}

func (db *MockDB) DeleteUser(id primitive.ObjectID) error {
	db.mu.Lock()
	defer db.mu.Unlock()

	if _, exists := db.users[id]; !exists {
		return ErrNotFound
	}

	delete(db.users, id)
	return nil
}

func (db *MockDB) ValidatePassword(email, password string) (*MockUser, error) {
	user, err := db.GetUserByEmail(email)
	if err != nil {
		return nil, ErrUnauthorized
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, ErrUnauthorized
	}

	return user, nil
}

// Lesson operations

func (db *MockDB) CreateLesson(title, description, audioURL, videoURL string, transcript []TranscriptSentence, quizType, quizQuestion string, quizOptions []string, correctAnswer, scrambleWord string, matchingPairs []MatchingPair) (*MockLesson, error) {
	db.mu.Lock()
	defer db.mu.Unlock()

	// Default quiz type to multiple-choice if not specified
	if quizType == "" {
		quizType = QuizTypeMultipleChoice
	}

	lesson := &MockLesson{
		ID:            primitive.NewObjectID(),
		Title:         title,
		Description:   description,
		AudioURL:      audioURL,
		VideoURL:      videoURL,
		Transcript:    transcript,
		QuizType:      quizType,
		QuizQuestion:  quizQuestion,
		QuizOptions:   quizOptions,
		CorrectAnswer: correctAnswer,
		ScrambleWord:  scrambleWord,
		MatchingPairs: matchingPairs,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	db.lessons[lesson.ID] = lesson
	return lesson, nil
}

func (db *MockDB) GetLessonByID(id primitive.ObjectID) (*MockLesson, error) {
	db.mu.RLock()
	defer db.mu.RUnlock()

	lesson, exists := db.lessons[id]
	if !exists {
		return nil, ErrNotFound
	}
	return lesson, nil
}

func (db *MockDB) GetAllLessons() []*MockLesson {
	db.mu.RLock()
	defer db.mu.RUnlock()

	lessons := make([]*MockLesson, 0, len(db.lessons))
	for _, l := range db.lessons {
		lessons = append(lessons, l)
	}
	return lessons
}

func (db *MockDB) UpdateLesson(id primitive.ObjectID, title, description, audioURL, videoURL string, transcript []TranscriptSentence, quizType, quizQuestion string, quizOptions []string, correctAnswer, scrambleWord string, matchingPairs []MatchingPair) (*MockLesson, error) {
	db.mu.Lock()
	defer db.mu.Unlock()

	lesson, exists := db.lessons[id]
	if !exists {
		return nil, ErrNotFound
	}

	lesson.Title = title
	lesson.Description = description
	lesson.AudioURL = audioURL
	lesson.VideoURL = videoURL
	lesson.Transcript = transcript
	lesson.QuizType = quizType
	lesson.QuizQuestion = quizQuestion
	lesson.QuizOptions = quizOptions
	lesson.CorrectAnswer = correctAnswer
	lesson.ScrambleWord = scrambleWord
	lesson.MatchingPairs = matchingPairs
	lesson.UpdatedAt = time.Now()

	return lesson, nil
}

func (db *MockDB) DeleteLesson(id primitive.ObjectID) error {
	db.mu.Lock()
	defer db.mu.Unlock()

	if _, exists := db.lessons[id]; !exists {
		return ErrNotFound
	}

	delete(db.lessons, id)

	// Also delete associated comments and progress
	for cid, c := range db.comments {
		if c.LessonID == id {
			delete(db.comments, cid)
		}
	}
	for pid, p := range db.lessonProgress {
		if p.LessonID == id {
			delete(db.lessonProgress, pid)
		}
	}

	return nil
}

func (db *MockDB) CheckAnswer(lessonID primitive.ObjectID, answer string) (bool, error) {
	lesson, err := db.GetLessonByID(lessonID)
	if err != nil {
		return false, err
	}
	return lesson.CorrectAnswer == answer, nil
}

// Comment operations

func (db *MockDB) CreateComment(lessonID, userID primitive.ObjectID, userName, content string) (*MockComment, error) {
	db.mu.Lock()
	defer db.mu.Unlock()

	// Verify lesson exists
	if _, exists := db.lessons[lessonID]; !exists {
		return nil, ErrNotFound
	}

	comment := &MockComment{
		ID:        primitive.NewObjectID(),
		LessonID:  lessonID,
		UserID:    userID,
		UserName:  userName,
		Content:   content,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	db.comments[comment.ID] = comment
	return comment, nil
}

func (db *MockDB) GetCommentsByLessonID(lessonID primitive.ObjectID) []*MockComment {
	db.mu.RLock()
	defer db.mu.RUnlock()

	comments := make([]*MockComment, 0)
	for _, c := range db.comments {
		if c.LessonID == lessonID {
			comments = append(comments, c)
		}
	}
	return comments
}

func (db *MockDB) DeleteComment(id primitive.ObjectID) error {
	db.mu.Lock()
	defer db.mu.Unlock()

	if _, exists := db.comments[id]; !exists {
		return ErrNotFound
	}

	delete(db.comments, id)
	return nil
}

// Lesson Progress operations

func (db *MockDB) GetOrCreateLessonProgress(userID, lessonID primitive.ObjectID) (*MockLessonProgress, error) {
	db.mu.Lock()
	defer db.mu.Unlock()

	// Check if progress already exists
	for _, p := range db.lessonProgress {
		if p.UserID == userID && p.LessonID == lessonID {
			return p, nil
		}
	}

	// Create new progress
	progress := &MockLessonProgress{
		ID:        primitive.NewObjectID(),
		UserID:    userID,
		LessonID:  lessonID,
		Completed: false,
		QuizPassed: false,
		Attempts:  0,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	db.lessonProgress[progress.ID] = progress
	return progress, nil
}

func (db *MockDB) UpdateLessonProgress(id primitive.ObjectID, completed, quizPassed bool) (*MockLessonProgress, error) {
	db.mu.Lock()
	defer db.mu.Unlock()

	progress, exists := db.lessonProgress[id]
	if !exists {
		return nil, ErrNotFound
	}

	progress.Completed = completed
	progress.QuizPassed = quizPassed
	progress.Attempts++
	progress.UpdatedAt = time.Now()

	if completed && progress.CompletedAt == nil {
		now := time.Now()
		progress.CompletedAt = &now
	}

	return progress, nil
}

func (db *MockDB) GetUserProgress(userID primitive.ObjectID) []*MockLessonProgress {
	db.mu.RLock()
	defer db.mu.RUnlock()

	progress := make([]*MockLessonProgress, 0)
	for _, p := range db.lessonProgress {
		if p.UserID == userID {
			progress = append(progress, p)
		}
	}
	return progress
}

func (db *MockDB) GetUserStats(userID primitive.ObjectID) map[string]interface{} {
	db.mu.RLock()
	defer db.mu.RUnlock()

	totalLessons := len(db.lessons)
	completedLessons := 0
	quizzesPassed := 0
	totalAttempts := 0

	for _, p := range db.lessonProgress {
		if p.UserID == userID {
			if p.Completed {
				completedLessons++
			}
			if p.QuizPassed {
				quizzesPassed++
			}
			totalAttempts += p.Attempts
		}
	}

	return map[string]interface{}{
		"total_lessons":     totalLessons,
		"completed_lessons": completedLessons,
		"quizzes_passed":    quizzesPassed,
		"total_attempts":    totalAttempts,
		"completion_rate":   float64(completedLessons) / float64(max(totalLessons, 1)) * 100,
	}
}
