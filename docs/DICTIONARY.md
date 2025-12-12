# German Noun Dictionary

## Overview

The German Noun Dictionary is a comprehensive, search-optimized dictionary system for learning German nouns. It provides fast lookups by German word, English translation, Vietnamese translation, and grammatical artikel (der/die/das).

## Features

- **266+ German nouns** organized alphabetically across 29 letter files (A1-A2 level)
- **Complete alphabet coverage**: a-z plus German umlauts (ä, ö, ü)
- **Trilingual support**: German, English, Vietnamese
- **Fast search** by word, English, or Vietnamese translation
- **Artikel filtering**: Filter by der (masculine), die (feminine), or das (neuter)
- **Color-coded artikel badges**: Blue for "der", red for "die", green for "das"
- **Comprehensive entries**: Each noun includes plural form, definitions, and example sentences
- **Mobile-first responsive design**
- **Alphabetical organization**: Each letter has its own file for efficient loading and scalability

## Data Structure

The dictionary uses a search-optimized structure for fast lookups:

```json
{
  "byWord": {
    "haus": "ID001"
  },
  "byEnglish": {
    "house": ["ID001"]
  },
  "byVietnamese": {
    "ngôi nhà": ["ID001"]
  },
  "byArtikel": {
    "der": [],
    "die": [],
    "das": ["ID001"]
  },
  "entries": {
    "ID001": {
      "word": "Haus",
      "artikel": "das",
      "plural": "Häuser",
      "english": "house",
      "vietnamese": "ngôi nhà",
      "definition_en": "A building used for living.",
      "definition_vi": "Một tòa nhà dùng để ở.",
      "examples": [
        {
          "de": "Das Haus ist groß.",
          "en": "The house is big.",
          "vi": "Ngôi nhà thì lớn."
        }
      ]
    }
  }
}
```

## File Structure

```
/public/data/dictionary/
  ├── letters/              # Alphabetically organized dictionary files
  │   ├── a.json           # All nouns starting with 'A' (10 entries)
  │   ├── b.json           # All nouns starting with 'B' (22 entries)
  │   ├── c.json           # All nouns starting with 'C' (3 entries)
  │   ├── d.json           # All nouns starting with 'D' (13 entries) ✨ NEW
  │   ├── e.json           # All nouns starting with 'E' (8 entries)
  │   ├── f.json           # All nouns starting with 'F' (20 entries)
  │   ├── g.json           # All nouns starting with 'G' (13 entries)
  │   ├── h.json           # All nouns starting with 'H' (14 entries)
  │   ├── i.json           # All nouns starting with 'I' (2 entries)
  │   ├── j.json           # All nouns starting with 'J' (2 entries)
  │   ├── k.json           # All nouns starting with 'K' (17 entries)
  │   ├── l.json           # All nouns starting with 'L' (8 entries)
  │   ├── m.json           # All nouns starting with 'M' (17 entries)
  │   ├── n.json           # All nouns starting with 'N' (6 entries)
  │   ├── o.json           # All nouns starting with 'O' (5 entries)
  │   ├── p.json           # All nouns starting with 'P' (11 entries)
  │   ├── q.json           # All nouns starting with 'Q' (2 entries) ✨ NEW
  │   ├── r.json           # All nouns starting with 'R' (10 entries)
  │   ├── s.json           # All nouns starting with 'S' (35 entries)
  │   ├── t.json           # All nouns starting with 'T' (13 entries)
  │   ├── u.json           # All nouns starting with 'U' (1 entry)
  │   ├── v.json           # All nouns starting with 'V' (3 entries)
  │   ├── w.json           # All nouns starting with 'W' (12 entries)
  │   ├── x.json           # All nouns starting with 'X' (1 entry) ✨ NEW
  │   ├── y.json           # All nouns starting with 'Y' (2 entries) ✨ NEW
  │   ├── z.json           # All nouns starting with 'Z' (7 entries)
  │   ├── ä.json           # German umlaut Ä (4 entries) ✨ NEW
  │   ├── ö.json           # German umlaut Ö (3 entries) ✨ NEW
  │   └── ü.json           # German umlaut Ü (1 entry) ✨ NEW
  └── batch-001.json       # Legacy batch files (for reference)

/src/types/
  └── dictionary.ts         # TypeScript type definitions

/src/lib/
  └── dictionary.ts         # Utility functions for search, merge, and letter-based loading

/src/app/dictionary/
  └── page.tsx             # Main dictionary page component

/api/dictionary/
  └── lookup.go            # Go API endpoint for lookups

/scripts/
  └── reorganize-dictionary.js  # Script to reorganize batches into letter files
```

## Usage

### Frontend

Visit `/dictionary` to access the dictionary interface.

**Search by word:**
1. Type a German word in the search box (e.g., "haus")
2. Click "Search" or press Enter

**Search by English:**
1. Click the "English" button
2. Type an English word (e.g., "house")
3. Click "Search"

**Search by Vietnamese:**
1. Click the "Vietnamese" button
2. Type a Vietnamese word (e.g., "ngôi nhà")
3. Click "Search"

**Filter by artikel:**
1. Click "der", "die", or "das" to show only nouns with that artikel
2. Click "All" to show all nouns

### API

**GET** `/api/dictionary/lookup`

Query parameters:
- `word` - Search by German word
- `english` - Search by English translation
- `vietnamese` - Search by Vietnamese translation
- `artikel` - Filter by artikel (der/die/das)

Example:
```
GET /api/dictionary/lookup?word=haus
GET /api/dictionary/lookup?english=house
GET /api/dictionary/lookup?artikel=das
```

## Adding New Entries

To add more nouns to the dictionary:

### Option 1: Add to Existing Letter File

1. Open the appropriate letter file: `/public/data/dictionary/letters/{letter}.json`
2. Follow the same data structure as existing entries
3. Use sequential IDs (e.g., if the last ID is ID240, start with ID241)
4. Add the new noun to all four sections:
   - `byWord`: lowercase German word → ID
   - `byEnglish`: English translation → array of IDs
   - `byVietnamese`: Vietnamese translation → array of IDs
   - `byArtikel`: der/die/das → array of IDs
   - `entries`: ID → complete entry object

### Option 2: Create New Letter File

If adding entries for a letter that doesn't exist yet:

1. Create `/public/data/dictionary/letters/{letter}.json`
2. Follow the same structure as existing letter files
3. The frontend will automatically load it

### Example: Adding "Apfel" (apple) to a.json

```json
{
  "byWord": {
    "apfel": "ID999"
  },
  "byEnglish": {
    "apple": ["ID999"]
  },
  "byVietnamese": {
    "quả táo": ["ID999"]
  },
  "byArtikel": {
    "der": ["ID999"],
    "die": [],
    "das": []
  },
  "entries": {
    "ID999": {
      "word": "Apfel",
      "artikel": "der",
      "plural": "Äpfel",
      "english": "apple",
      "vietnamese": "quả táo",
      "definition_en": "A round fruit with red or green skin.",
      "definition_vi": "Một loại trái cây tròn có vỏ đỏ hoặc xanh.",
      "examples": [
        {
          "de": "Der Apfel ist rot.",
          "en": "The apple is red.",
          "vi": "Quả táo màu đỏ."
        }
      ]
    }
  }
}
```

## Batch Generation Rules

When creating new batches:

1. **Sequential IDs**: Start from the last ID of the previous batch + 1
2. **Lowercase keys**: All keys in `byWord` must be lowercase
3. **Unique entries**: No duplicate IDs or words
4. **Complete entries**: Every entry must have all required fields
5. **Consistent format**: Follow the exact structure shown above
6. **Example sentences**: Include at least one example per entry

## TypeScript Types

```typescript
interface DictionaryEntry {
  word: string;
  artikel: "der" | "die" | "das";
  plural: string;
  english: string;
  vietnamese: string;
  definition_en: string;
  definition_vi: string;
  examples: DictionaryExample[];
}

interface DictionaryExample {
  de: string;  // German sentence
  en: string;  // English translation
  vi: string;  // Vietnamese translation
}

interface Dictionary {
  byWord: Record<string, string>;
  byEnglish: Record<string, string[]>;
  byVietnamese: Record<string, string[]>;
  byArtikel: {
    der: string[];
    die: string[];
    das: string[];
  };
  entries: Record<string, DictionaryEntry>;
}
```

## Current Dictionary Coverage

The dictionary contains 266 nouns across 29 letters covering common A1-A2 level topics:

### By Letter (Complete Alphabet + Umlauts)
- **A** (10 entries): Abend, Affe, Anfang, Antwort, Apfel, Arbeit, Arm, Arzt, Auge, Auto
- **B** (22 entries): Baby, Bad, Bahnhof, Bank, Baum, Bein, Berg, Beruf, Bett, Bier, Bild, Blau, Blume, Braun, Brille, Brot, Bruder, Buch, Bus, Büro, Butter
- **C** (3 entries): Café, Chef, Computer
- **D** (13 entries): Dach, Dame, Dank, Daumen, Decke, Deutschland, Dienstag, Ding, Direktor, Donnerstag, Dorf, Dose, Dusche ✨ NEW
- **E** (8 entries): Ecke, Ei, Elefant, Ende, Erde, Essen, Euro
- **F** (20 entries): Fahrer, Fahrrad, Familie, Farbe, Fehler, Fenster, Fernseher, Feuer, Finger, Fisch, Fleisch, Flughafen, Flugzeug, Fluss, Form, Frage, Frau, Freund, Frühling, Fuß
- **G** (13 entries): Garten, Geld, Gelb, Geldbörse, Gemüse, Geschäft, Gesetz, Getränk, Glas, Grau, Grün, Größe, Gruppe
- **H** (14 entries): Hälfte, Hand, Handschuh, Hase, Haus, Hemd, Herbst, Herz, Hose, Hotel, Huhn, Hund, Hut
- **I** (2 entries): Ingenieur, Insekt
- **J** (2 entries): Jacke, Jahr
- **K** (17 entries): Kaffee, Käse, Katze, Kellner, Kind, Kleid, Kleidung, Koch, Koffer, Kollege, Komputer, Kopf, Körper, Krankenschwester, Kreis, Kuh, Küche
- **L** (8 entries): Laden, Lampe, Land, Lehrer, Linie, Lösung, Löwe, Luft
- **M** (17 entries): Mann, Mantel, Markt, Maus, Meer, Milch, Minute, Mitte, Monat, Moment, Mond, Morgen, Motorrad, Mund, Mutter, Mütze
- **N** (6 entries): Nacht, Name, Nase, Nudel, Nummer, Number
- **O** (5 entries): Obst, Ohr, Orange, Ordnung, Ort
- **P** (11 entries): Paar, Pferd, Pflicht, Platz, Polizist, Post, Preis, Problem, Professor, Prozent, Punkt
- **Q** (2 entries): Quelle, Quittung ✨ NEW
- **R** (10 entries): Radio, Recht, Regel, Regen, Reis, Restaurant, Rock, Rot, Rucksack
- **S** (35 entries): Saft, Salat, Salz, Schaf, Schiff, Schlafzimmer, Schlange, Schlüssel, Schnee, Schokolade, Schuh, Schule, Schüler, Schwarz, Schwein, Schwester, See, Seite, Sekunde, Sohn, Sommer, Sonne, Stadt, Stern, Strand, Straße, Student, Stuhl, Stück, Stunde, Suppe, System
- **T** (13 entries): Tag, Tasche, Taxi, Tee, Teil, Telefon, Ticket, Tier, Tisch, Tochter, Toilette, Tür
- **U** (1 entry): Uhr
- **V** (3 entries): Vater, Verkäufer, Vogel
- **W** (12 entries): Wald, Wasser, Wein, Wetter, Wiese, Wind, Winter, Woche, Wohnung, Wohnzimmer, Wolke
- **X** (1 entry): Xylophon ✨ NEW
- **Y** (2 entries): Yacht, Yoga ✨ NEW
- **Z** (7 entries): Zahn, Zahl, Zeit, Ziege, Zimmer, Zug, Zucker
- **Ä** (4 entries): Ärger, Ärmel, Ärzte, Äpfel ✨ NEW (German umlaut)
- **Ö** (3 entries): Öl, Öffentlichkeit, Österreich ✨ NEW (German umlaut)
- **Ü** (1 entry): Übung ✨ NEW (German umlaut)

### By Category
**Family & People**: Vater, Mutter, Bruder, Schwester, Sohn, Tochter, Großmutter, Großvater, Baby, Mann, Frau, Kind, Freund
**Body Parts**: Kopf, Auge, Ohr, Nase, Mund, Zahn, Hand, Fuß, Bein, Arm, Finger, Herz, Körper
**Food & Drink**: Essen, Trinken, Brot, Wasser, Milch, Kaffee, Tee, Fleisch, Fisch, Gemüse, Obst, Salat, Suppe, Käse, Butter, Zucker, Salz, Reis, Nudel, Kuchen, Schokolade, Eis, Saft, Bier, Wein, Apfel, Ei
**Home**: Haus, Zimmer, Wohnung, Küche, Bad, Schlafzimmer, Wohnzimmer, Toilette, Tür, Fenster, Bett, Tisch, Stuhl, Sofa, Lampe
**Work & Professions**: Arbeit, Beruf, Arzt, Krankenschwester, Polizist, Verkäufer, Lehrer, Schüler, Student, Professor, Ingenieur, Kellner, Koch, Fahrer, Chef, Kollege
**Places**: Stadt, Land, Straße, Schule, Garten, Bank, Post, Bahnhof, Flughafen, Geschäft, Laden, Markt, Supermarkt, Restaurant, Café, Hotel, Büro
**Transportation**: Auto, Zug, Bus, Taxi, Fahrrad, Motorrad, Flugzeug, Schiff
**Clothing**: Kleidung, Hemd, Hose, Rock, Kleid, Jacke, Mantel, Schuhe, Socke, Hut, Mütze, Handschuh
**Colors**: Farbe, Rot, Blau, Grün, Gelb, Schwarz, Weiß, Grau, Braun, Orange
**Nature & Weather**: Frühling, Sommer, Herbst, Winter, Wetter, Sonne, Mond, Stern, Himmel, Wolke, Regen, Schnee, Wind, Luft, Erde, Feuer, Berg, See, Fluss, Meer, Strand, Wald, Wiese, Baum, Blume
**Animals**: Hund, Katze, Tier, Vogel, Pferd, Kuh, Schwein, Schaf, Ziege, Huhn, Fisch, Maus, Hase, Bär, Löwe, Elefant, Affe, Schlange, Insekt
**Time**: Tag, Nacht, Morgen, Abend, Mittag, Nachmittag, Woche, Monat, Jahr, Zeit, Stunde, Minute, Sekunde, Moment
**Objects**: Buch, Bild, Geld, Telefon, Computer, Fernseher, Radio, Uhr, Koffer, Tasche, Rucksack, Geldbörse, Schlüssel, Brille

## Future Enhancements

- Audio pronunciation for each word
- Image illustrations for visual learning
- Spaced repetition system (SRS) for vocabulary practice
- Quiz mode to test knowledge
- User favorites and bookmarks
- Progress tracking
- Additional batches covering A2, B1, B2, C1, C2 levels
