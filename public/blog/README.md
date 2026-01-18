# Blog Feature

This directory contains blog posts for the EgalDeutsch coding blog.

## Structure

```
public/blog/
├── images/              # Blog post images
│   ├── golang-basics.svg
│   └── golang-api.svg
├── getting-started-with-golang.md
└── building-rest-apis-golang.md
```

## Adding a New Blog Post

1. Create a new markdown file in `public/blog/`
2. Add frontmatter at the top:

```markdown
---
title: Your Blog Post Title
slug: your-blog-post-slug
description: A brief description
author: Author Name
date: 2024-01-15
tags: tag1, tag2, tag3
image: /blog/images/your-image.svg
---

# Your content starts here...
```

3. Add any images to `public/blog/images/`
4. The blog post will automatically appear in the blog list

## Supported Markdown Features

- Headings (H1-H6)
- Paragraphs
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Inline code
- Images
- Links
- Blockquotes
- Tables
- Bold and italic text
- Horizontal rules

## Viewing the Blog

- Blog list: `/blog`
- Individual post: `/blog/[slug]`
