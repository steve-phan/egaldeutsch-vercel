# German Noun Dictionary

## Overview

The German Noun Dictionary is a comprehensive, search-optimized dictionary system for learning German nouns. It provides fast lookups by German word, English translation, Vietnamese translation, and grammatical artikel (der/die/das).

## Features

- **200 German nouns** across 5 batches (A1-A2 level)
- **Trilingual support**: German, English, Vietnamese
- **Fast search** by word, English, or Vietnamese translation
- **Artikel filtering**: Filter by der (masculine), die (feminine), or das (neuter)
- **Color-coded artikel badges**: Blue for "der", red for "die", green for "das"
- **Comprehensive entries**: Each noun includes plural form, definitions, and example sentences
- **Mobile-first responsive design**

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
  ├── batch-001.json        # First batch of 40 nouns (ID001-ID040)
  ├── batch-002.json        # Second batch of 40 nouns (ID041-ID080)
  ├── batch-003.json        # Third batch of 40 nouns (ID081-ID120)
  ├── batch-004.json        # Fourth batch of 40 nouns (ID121-ID160)
  └── batch-005.json        # Fifth batch of 40 nouns (ID161-ID200)

/src/types/
  └── dictionary.ts         # TypeScript type definitions

/src/lib/
  └── dictionary.ts         # Utility functions for search and merge

/src/app/dictionary/
  └── page.tsx             # Main dictionary page component

/api/dictionary/
  └── lookup.go            # Go API endpoint for lookups
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

## Adding New Batches

To add more nouns to the dictionary:

1. Create a new batch file: `/public/data/dictionary/batch-006.json`
2. Follow the same data structure as previous batches
3. Use sequential IDs starting from ID201
4. Update the frontend to load the new batch in `/src/app/dictionary/page.tsx`:

```typescript
const batches = await Promise.all([
  loadDictionaryBatch(1),
  loadDictionaryBatch(2),
  loadDictionaryBatch(3),
  loadDictionaryBatch(4),
  loadDictionaryBatch(5),
  loadDictionaryBatch(6), // Add new batch
]);
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

## Current Nouns (Batches 001-005)

The dictionary contains 200 nouns across 5 batches covering common A1-A2 level topics:

**Batch 001 (ID001-ID040)**: Basic nouns
- **Home**: Haus, Tisch, Stuhl, Tür, Fenster
- **People**: Mann, Frau, Kind, Mutter, Lehrer, Schüler, Freund
- **Food**: Brot, Wasser, Apfel, Ei, Milch, Kaffee, Tee
- **Animals**: Hund, Katze
- **Time**: Tag, Nacht, Zeit, Jahr, Monat, Woche
- **Places**: Stadt, Land, Straße, Schule, Garten
- **Objects**: Buch, Auto, Bild, Name
- **Nature**: Baum, Blume
- **Social**: Familie

**Batch 002 (ID041-ID080)**: Family & Body & Food
- **Family**: Vater, Mutter, Bruder, Schwester, Sohn, Tochter, Großmutter, Großvater, Baby
- **Body parts**: Kopf, Auge, Ohr, Nase, Mund, Zahn, Fuß, Bein, Arm, Finger, Herz, Körper
- **Food & Drink**: Essen, Trinken, Fleisch, Fisch, Gemüse, Obst, Salat, Suppe, Käse, Butter, Zucker, Salz, Reis, Nudel, Kuchen, Schokolade, Eis, Saft, Bier, Wein

**Batch 003 (ID081-ID120)**: Home & Work & Places
- **Home**: Zimmer, Wohnung, Küche, Bad, Schlafzimmer, Wohnzimmer, Toilette, Bett, Sofa, Lampe
- **Electronics**: Fernseher, Radio, Computer, Telefon, Uhr
- **Money**: Geld, Euro, Preis
- **Work**: Arbeit, Beruf, Büro, Chef, Kollege
- **Professions**: Arzt, Krankenschwester, Polizist, Verkäufer, Student, Professor, Ingenieur, Kellner, Koch, Fahrer
- **Places**: Geschäft, Laden, Markt, Supermarkt, Restaurant, Café, Hotel

**Batch 004 (ID121-ID160)**: Travel & Clothing & Colors
- **Places**: Bank, Post, Bahnhof, Flughafen
- **Transportation**: Zug, Bus, Taxi, Fahrrad, Motorrad, Flugzeug, Schiff
- **Travel items**: Ticket, Koffer, Tasche, Rucksack, Geldbörse, Schlüssel, Brille
- **Clothing**: Kleidung, Hemd, Hose, Rock, Kleid, Jacke, Mantel, Schuhe, Socke, Hut, Mütze, Handschuh
- **Colors**: Farbe, Rot, Blau, Grün, Gelb, Schwarz, Weiß, Grau, Braun, Orange

**Batch 005 (ID161-ID200)**: Nature & Weather & Animals
- **Seasons**: Frühling, Sommer, Herbst, Winter
- **Weather**: Wetter, Sonne, Mond, Stern, Himmel, Wolke, Regen, Schnee, Wind, Luft
- **Nature**: Erde, Feuer, Berg, See, Fluss, Meer, Strand, Wald, Wiese
- **Animals**: Tier, Vogel, Pferd, Kuh, Schwein, Schaf, Ziege, Huhn, Fisch, Maus, Hase, Bär, Löwe, Elefant, Affe, Schlange, Insekt

## Future Enhancements

- Audio pronunciation for each word
- Image illustrations for visual learning
- Spaced repetition system (SRS) for vocabulary practice
- Quiz mode to test knowledge
- User favorites and bookmarks
- Progress tracking
- Additional batches covering A2, B1, B2, C1, C2 levels
