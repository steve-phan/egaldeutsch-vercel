package handler

import (
	"egaldeutsch-vercel/api/utils/blog"
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

type BlogPost struct {
	Slug        string    `json:"slug"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Author      string    `json:"author"`
	Date        time.Time `json:"date"`
	Tags        []string  `json:"tags"`
	Image       string    `json:"image"`
}

// getBlogPosts reads all markdown files from public/blog directory
func getBlogPosts() ([]BlogPost, error) {
	blogDir := "public/blog"
	posts := []BlogPost{}

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

		frontmatter, _ := blog.ParseFrontMatter(string(content))

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

		post := BlogPost{
			Slug:        frontmatter["slug"],
			Title:       frontmatter["title"],
			Description: frontmatter["description"],
			Author:      frontmatter["author"],
			Date:        date,
			Tags:        tags,
			Image:       frontmatter["image"],
		}

		posts = append(posts, post)
	}

	// Sort by date (newest first)
	sort.Slice(posts, func(i, j int) bool {
		return posts[i].Date.After(posts[j].Date)
	})

	return posts, nil
}

func BlogHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	posts, err := getBlogPosts()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(posts)
}
