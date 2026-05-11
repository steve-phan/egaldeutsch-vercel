package mock

import (
	"errors"
	"math/rand"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrNotFound      = errors.New("not found")
	ErrAlreadyExists = errors.New("already exists")
	ErrUnauthorized  = errors.New("unauthorized")
)

// ─────────────────────────────────────────────────────────────────────────────
// User operations
// ─────────────────────────────────────────────────────────────────────────────

func (db *MockDB) CreateUser(name, email, password string) (*MockUser, error) {
	db.mu.Lock()
	defer db.mu.Unlock()

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

func (db *MockDB) ChangePassword(id primitive.ObjectID, currentPassword, newPassword string) error {
	db.mu.Lock()
	defer db.mu.Unlock()

	user, exists := db.users[id]
	if !exists {
		return ErrNotFound
	}

	// Verify current password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(currentPassword)); err != nil {
		return ErrUnauthorized
	}

	// Hash and update new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	user.UpdatedAt = time.Now()
	return nil
}

func (db *MockDB) ValidatePassword(email, password string) (*MockUser, error) {
	user, err := db.GetUserByEmail(email)
	if err != nil {
		return nil, ErrUnauthorized
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, ErrUnauthorized
	}
	return user, nil
}

// ─────────────────────────────────────────────────────────────────────────────
// Quiz Question operations
// ─────────────────────────────────────────────────────────────────────────────

// GetQuestions returns up to `limit` random questions for a given category and level.
// If category or level is empty, it is not used as a filter.
func (db *MockDB) GetQuestions(category, level string, limit int) []*MockQuizQuestion {
	db.mu.RLock()
	defer db.mu.RUnlock()

	var pool []*MockQuizQuestion
	cats := []string{}
	if category != "" {
		cats = strings.Split(category, ",")
	}

	for _, q := range db.questions {
		if len(cats) > 0 {
			match := false
			for _, c := range cats {
				if q.Category == c {
					match = true
					break
				}
			}
			if !match {
				continue
			}
		}
		if level != "" && q.Level != level {
			continue
		}
		pool = append(pool, q)
	}

	// Shuffle
	rand.Shuffle(len(pool), func(i, j int) { pool[i], pool[j] = pool[j], pool[i] })

	if limit > 0 && len(pool) > limit {
		return pool[:limit]
	}
	return pool
}

// GetAllQuestions returns all questions (for admin).
func (db *MockDB) GetAllQuestions(category, level string) []*MockQuizQuestion {
	return db.GetQuestions(category, level, 0)
}

// GetQuestionByID returns a single question.
func (db *MockDB) GetQuestionByID(id primitive.ObjectID) (*MockQuizQuestion, error) {
	db.mu.RLock()
	defer db.mu.RUnlock()

	q, exists := db.questions[id]
	if !exists {
		return nil, ErrNotFound
	}
	return q, nil
}

// CreateQuestion creates a new quiz question.
func (db *MockDB) CreateQuestion(q *MockQuizQuestion) *MockQuizQuestion {
	db.mu.Lock()
	defer db.mu.Unlock()

	q.ID = primitive.NewObjectID()
	q.CreatedAt = time.Now()
	q.UpdatedAt = time.Now()
	db.questions[q.ID] = q
	return q
}

// UpdateQuestion updates an existing question.
func (db *MockDB) UpdateQuestion(id primitive.ObjectID, update *MockQuizQuestion) (*MockQuizQuestion, error) {
	db.mu.Lock()
	defer db.mu.Unlock()

	existing, exists := db.questions[id]
	if !exists {
		return nil, ErrNotFound
	}

	update.ID = existing.ID
	update.CreatedAt = existing.CreatedAt
	update.UpdatedAt = time.Now()
	db.questions[id] = update
	return update, nil
}

// DeleteQuestion removes a question.
func (db *MockDB) DeleteQuestion(id primitive.ObjectID) error {
	db.mu.Lock()
	defer db.mu.Unlock()

	if _, exists := db.questions[id]; !exists {
		return ErrNotFound
	}
	delete(db.questions, id)
	return nil
}

// GetCategoryStats returns the count of questions per category and level.
func (db *MockDB) GetCategoryStats() map[string]map[string]int {
	db.mu.RLock()
	defer db.mu.RUnlock()

	// map[category]map[level]count
	stats := make(map[string]map[string]int)
	for _, q := range db.questions {
		if stats[q.Category] == nil {
			stats[q.Category] = make(map[string]int)
		}
		stats[q.Category][q.Level]++
	}
	return stats
}

// ─────────────────────────────────────────────────────────────────────────────
// Quiz Session operations
// ─────────────────────────────────────────────────────────────────────────────

// SaveSession persists a completed quiz session.
func (db *MockDB) SaveSession(s *MockQuizSession) *MockQuizSession {
	db.mu.Lock()
	defer db.mu.Unlock()

	s.ID = primitive.NewObjectID()
	s.CompletedAt = time.Now()
	db.sessions[s.ID] = s
	return s
}

// GetUserSessions returns all sessions for a user.
func (db *MockDB) GetUserSessions(userID primitive.ObjectID) []*MockQuizSession {
	db.mu.RLock()
	defer db.mu.RUnlock()

	var result []*MockQuizSession
	for _, s := range db.sessions {
		if s.UserID != nil && *s.UserID == userID {
			result = append(result, s)
		}
	}
	return result
}

// GetUserStats returns aggregated quiz stats for the dashboard.
func (db *MockDB) GetUserStats(userID primitive.ObjectID) map[string]interface{} {
	db.mu.RLock()
	defer db.mu.RUnlock()

	totalSessions := 0
	totalCorrect := 0
	totalQuestions := 0
	categoryScores := make(map[string][]float64)

	for _, s := range db.sessions {
		if s.UserID == nil || *s.UserID != userID {
			continue
		}
		totalSessions++
		totalCorrect += s.CorrectQ
		totalQuestions += s.TotalQ
		categoryScores[s.Category] = append(categoryScores[s.Category], s.Score)
	}

	accuracy := 0.0
	if totalQuestions > 0 {
		accuracy = float64(totalCorrect) / float64(totalQuestions) * 100
	}

	// Average score per category
	catAvg := make(map[string]float64)
	for cat, scores := range categoryScores {
		sum := 0.0
		for _, sc := range scores {
			sum += sc
		}
		catAvg[cat] = sum / float64(len(scores))
	}

	return map[string]interface{}{
		"total_sessions":    totalSessions,
		"total_questions":   totalQuestions,
		"total_correct":     totalCorrect,
		"accuracy":          accuracy,
		"category_averages": catAvg,
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Idiom operations
// ─────────────────────────────────────────────────────────────────────────────

// GetRandomIdiom returns a random idiom, optionally excluding some slugs.
func (db *MockDB) GetRandomIdiom(excludeSlugs []string) *MockIdiom {
	db.mu.RLock()
	defer db.mu.RUnlock()

	var pool []*MockIdiom
	excludeMap := make(map[string]bool)
	for _, s := range excludeSlugs {
		excludeMap[s] = true
	}

	for _, i := range db.idioms {
		if !excludeMap[i.Slug] {
			pool = append(pool, i)
		}
	}

	// Fallback if all idioms seen
	if len(pool) == 0 && len(db.idioms) > 0 {
		for _, i := range db.idioms {
			pool = append(pool, i)
		}
	}

	if len(pool) == 0 {
		return nil
	}

	rand.Shuffle(len(pool), func(i, j int) { pool[i], pool[j] = pool[j], pool[i] })
	return pool[0]
}

// MarkIdiomSeen records an idiom as seen by a user.
func (db *MockDB) MarkIdiomSeen(id primitive.ObjectID, slug string) {
	db.mu.Lock()
	defer db.mu.Unlock()

	user, exists := db.users[id]
	if !exists {
		return
	}

	// Check if already seen
	for _, s := range user.SeenIdioms {
		if s == slug {
			return
		}
	}

	user.SeenIdioms = append(user.SeenIdioms, slug)
}
