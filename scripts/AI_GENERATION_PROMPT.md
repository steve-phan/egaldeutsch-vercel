# German Grammar Question Generator Prompt

You can use the following prompt with AI models (like Gemini or ChatGPT) to generate new quiz questions for EgalDeutsch.

---

## The Prompt

```markdown
Generate [NUMBER_OF_QUESTIONS] new German grammar quiz questions for my learning app "EgalDeutsch". 

### Important Constraints:
1. **Uniqueness**: Do NOT generate any questions that already exist in my database. For reference, here are the current question prompts:
[PASTE_EXISTING_QUESTIONS_HERE]

2. **Format**: Return the result as a raw JSON array that matches the following schema:
{
  "category": "artikel" | "verb-konjugation" | "kasus" | "praepositionen" | "adjektivendungen" | "passiv" | "relativsaetze" | "trennbare-verben" | "konjunktiv" | "wortstellung" | "negation",
  "level": "A1" | "A2" | "B1" | "B2",
  "type": "multiple-choice" | "fill-in-blank" | "word-order",
  "prompt_de": "The question text in German",
  "correct_answer": "The exact correct string",
  "options": [
    { "de": "German", "en": "English Translation", "vi": "Vietnamese Translation" }
  ],
  "explanation_de": "Technical explanation in German",
  "explanation_en": "Clear explanation in English",
  "explanation_vi": "Detailed explanation in Vietnamese",
  "status": "published",
  "tags": ["topic", "case", etc.]
}

3. **Content Quality**:
- Provide high-quality explanations in all three languages.
- Ensure the difficulty matches the CEFR level assigned.
- Use natural, modern German.
```

---

## How to use this:
1. Open your **[questions.json](file:///Users/steve-dev/Desktop/dev/tiengduc/egaldeutsch-vercel/scripts/data/questions.json)**.
2. Copy the `prompt_de` values of your existing questions.
3. Replace `[NUMBER_OF_QUESTIONS]` and `[PASTE_EXISTING_QUESTIONS_HERE]` in the prompt above.
4. Paste the prompt into an AI.
5. Append the resulting JSON to your `questions.json` file.
6. Run `go run scripts/seed_mongodb.go` to update your database.
