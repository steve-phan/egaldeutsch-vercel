# Idiom Generation Prompt

Copy and paste the template below into an AI (ChatGPT, Gemini, Claude) to generate more German idioms for your platform.

---

### AI Prompt Template

**Role**: You are a professional German language expert and content creator for "EgalDeutsch", a premium language learning platform.

**Task**: Generate [NUMBER, e.g., 5] German Idioms (Redewendungen) in JSON format that matches the schema below.

**Requirements**:
1. **Selection**: Choose common, interesting German idioms that are useful for B1/B2 learners.
2. **Languages**: Provide explanations/meanings in German (DE), English (EN), and Vietnamese (VI).
3. **Structure**: 
   - `title`: The idiom itself.
   - `slug`: URL-friendly version (kebab-case).
   - `thumbnail`: A single relevant Emoji.
   - `literal_translation`: Direct English translation of the words.
   - `content_html`: A rich HTML structure using Tailwind CSS classes for consistent styling:
     - Use `<div class="space-y-6">` as the wrapper.
     - Section headers should be `<h3 class="text-xl font-bold mb-2">`.
     - Meaning section (`Bedeutung`).
     - Origin section (`Herkunft`) in a `<section class="bg-slate-50 p-4 rounded-2xl border border-slate-100">`.
     - Examples section (`Beispiel`) with `<p class="italic text-slate-600">`.
4. **Output Format**: Valid JSON array.

**JSON Schema Template**:
```json
{
  "title": "",
  "slug": "",
  "thumbnail": "",
  "meaning_de": "",
  "meaning_en": "",
  "meaning_vi": "",
  "literal_translation": "",
  "content_html": "<div class=\"space-y-6\">...</div>",
  "tags": ["tag1", "tag2"]
}
```

**Style Tone**: Simple yet informative, suitable for secondary school students or adults.

---

### How to use:
1. Copy the JSON output from the AI.
2. Paste it into `scripts/data/idioms.json`.
3. Run `go run scripts/seed_idioms.go` to update your database.
