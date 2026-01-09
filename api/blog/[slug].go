package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"egaldeutsch-vercel/api/utils/blog"
)

type BlogPostDetail struct {
	Slug        string    `json:"slug"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Author      string    `json:"author"`
	Date        time.Time `json:"date"`
	Tags        []string  `json:"tags"`
	Image       string    `json:"image"`
	Content     string    `json:"content"`
}

// getBlogPostBySlug reads a specific markdown file by slug
func getBlogPostBySlug(slug string) (*BlogPostDetail, error) {
	blogDir := "public/blog"

	// Try to read file directly using slug as filename first (optimized path)
	filePath := filepath.Join(blogDir, slug+".md")
	content, err := os.ReadFile(filePath)
	if err == nil {
		// File found directly, parse it
		frontmatter, bodyContent := blog.ParseFrontMatter(string(content))
		return buildBlogPostDetail(frontmatter, bodyContent), nil
	}

	// Fallback: Read all files to find the one with matching slug in frontmatter
	files, err := os.ReadDir(blogDir)
	if err != nil {
		return nil, err
	}

	for _, file := range files {
		if file.IsDir() || !strings.HasSuffix(file.Name(), ".md") {
			continue
		}

		filePath := filepath.Join(blogDir, file.Name())
		content, err := os.ReadFile(filePath)
		if err != nil {
			continue
		}

		frontmatter, bodyContent := blog.ParseFrontMatter(string(content))

		// Check if this is the post we're looking for
		if frontmatter["slug"] != slug {
			continue
		}

		return buildBlogPostDetail(frontmatter, bodyContent), nil
	}

	return nil, nil
}

// buildBlogPostDetail creates a BlogPostDetail from frontmatter and content
func buildBlogPostDetail(frontmatter map[string]string, bodyContent string) *BlogPostDetail {
	// Parse date
	dateStr := frontmatter["date"]
	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		date = time.Now()
	}

	// Parse tags
	tags := []string{}
	if tagsStr := frontmatter["tags"]; tagsStr != "" {
		for _, tag := range strings.Split(tagsStr, ",") {
			tags = append(tags, strings.TrimSpace(tag))
		}
	}

	return &BlogPostDetail{
		Slug:        frontmatter["slug"],
		Title:       frontmatter["title"],
		Description: frontmatter["description"],
		Author:      frontmatter["author"],
		Date:        date,
		Tags:        tags,
		Image:       frontmatter["image"],
		Content:     bodyContent,
	}
}

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extract slug from URL query parameter
	slug := r.URL.Query().Get("slug")
	if slug == "" {
		http.Error(w, "Slug is required", http.StatusBadRequest)
		return
	}

	// Sanitize slug to prevent directory traversal attacks
	// Only allow alphanumeric characters, hyphens, and underscores
	if !isValidSlug(slug) {
		http.Error(w, "Invalid slug format", http.StatusBadRequest)
		return
	}

	post, err := getBlogPostBySlug(slug)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if post == nil {
		http.Error(w, "Blog post not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(post)
}

// isValidSlug checks if the slug contains only safe characters
func isValidSlug(slug string) bool {
	if len(slug) == 0 || len(slug) > 200 {
		return false
	}
	for _, char := range slug {
		if !((char >= 'a' && char <= 'z') ||
			(char >= 'A' && char <= 'Z') ||
			(char >= '0' && char <= '9') ||
			char == '-' || char == '_') {
			return false
		}
	}
	return true
}
