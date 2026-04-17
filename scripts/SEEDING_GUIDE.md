# Database Seeding Guide

This guide explains how to manage and seed quiz questions for the EgalDeutsch platform.

## 1. Managing Questions

All quiz questions are stored in a structured JSON format to make them easy to edit without touching the Go backend code.

**File Location:** `scripts/data/questions.json`

### JSON Structure

Each question object in the JSON array follows this structure:

```json
{
  "category": "artikel",
  "level": "A1",
  "type": "multiple-choice",
  "prompt_de": "Was ist der richtige Artikel für 'Haus'?",
  "correct_answer": "das",
  "options": [
    { "de": "der", "en": "the (masculine)", "vi": "giống đực" },
    { "de": "die", "en": "the (feminine)", "vi": "giống cái" },
    { "de": "das", "en": "the (neuter)", "vi": "giống trung" }
  ],
  "explanation_de": "...",
  "explanation_en": "...",
  "explanation_vi": "...",
  "status": "published",
  "tags": ["basics", "articles"]
}
```

## 2. Running the Seed Script

The seeding script performs the following actions:
1. Loads environment variables from `.env.local`.
2. Connects to your MongoDB instance.
3. **Purges** existing questions, users, and results (Clean Slate).
4. Creates a default admin user.
5. Loads and inserts all questions from `scripts/data/questions.json`.

### Prerequisites

Ensure you have Go installed on your machine.

### Execution Command

Run the following command from the project root:

```bash
go run scripts/seed_mongodb.go
```

## 3. Important Notes

> [!WARNING]
> Running the seed script will **DELETE** all current data in the `questions`, `users`, and `results` collections. Use this primarily for development or initial project setup.

> [!TIP]
> Always validate your JSON format in `questions.json` before running the script to avoid unmarshaling errors.
