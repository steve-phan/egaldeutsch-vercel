package blog

import (
	"strings"
)

// ParseFrontMatter extracts YAML-like frontmatter from markdown file
// Note: This is a simple parser that treats all values as strings.
// For our use case with simple key:value pairs, this is sufficient.
// Tags and other list values are parsed by the caller using string splitting.
// For more complex YAML parsing, consider using gopkg.in/yaml.v2
func ParseFrontMatter(content string) (map[string]string, string) {
	frontmatter := make(map[string]string)

	lines := strings.Split(content, "\n")
	if len(lines) < 3 || lines[0] != "---" {
		return frontmatter, content
	}

	endIndex := -1
	for i := 1; i < len(lines); i++ {
		if lines[i] == "---" {
			endIndex = i
			break
		}

		parts := strings.SplitN(lines[i], ":", 2)
		if len(parts) == 2 {
			key := strings.TrimSpace(parts[0])
			value := strings.TrimSpace(parts[1])
			frontmatter[key] = value
		}
	}

	if endIndex == -1 {
		return frontmatter, content
	}

	// Return content without frontmatter
	bodyContent := strings.Join(lines[endIndex+1:], "\n")
	return frontmatter, strings.TrimSpace(bodyContent)
}
