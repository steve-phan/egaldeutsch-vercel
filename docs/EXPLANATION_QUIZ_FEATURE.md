# Explanation Quiz Feature - Complete Setup

## Overview

A new learning system that helps students understand not just the correct answer, but **why** each option is right or wrong. This is a complete redesign with new backend (Go) and frontend (React/Next.js) components.

## Features

### For Learners

- **Phase 1: Answer Selection** - Students choose their answer without seeing explanations
- **Phase 2: Show Explanation** - After submission, see detailed explanation for their chosen answer
- **Phase 3: Learn from All Options** - Expand to see why all options were right/wrong, including common mistakes
- **Deep Learning Focus** - Reduced scrolling, progressive disclosure of information

### For Admins

- **Easy Quiz Creation** - Simple admin form to create questions with explanations
- **Option Management** - Add/remove options with full explanations for each
- **mistake Tracking** - Explain common mistakes for wrong answers
- **Quiz Management** - View, edit, and delete all quizzes

## Project Structure

### Backend (Go)

```
api/
├── models/
│   └── explanation-quiz.go      # Data models
└── explanation-quiz.go          # API handlers (CRUD operations)
```

### Frontend (React/Next.js)

```
src/
├── app/
│   ├── explanation-quiz/            # Learner page
│   │   └── page.tsx
│   └── admin/
│       └── explanation-quiz/        # Admin dashboard
│           └── page.tsx
├── components/
│   ├── explanation-quiz-player.tsx  # Quiz UI for learners
│   └── admin/
│       ├── explanation-quiz-form.tsx    # Create/edit form
│       ├── explanation-quiz-list.tsx    # Quiz list view
│       └── explanation-quiz-admin.tsx   # Main admin component
├── hooks/
│   └── use-explanation-quiz-admin.ts   # Admin API hook
└── types/
    └── explanation-quiz.ts           # TypeScript types
```

## API Endpoints

All endpoints use MongoDB and are accessible at `/api/explanation-quiz`:

| Method | Endpoint                       | Description      |
| ------ | ------------------------------ | ---------------- |
| GET    | `/api/explanation-quiz`        | List all quizzes |
| GET    | `/api/explanation-quiz?id=:id` | Get single quiz  |
| POST   | `/api/explanation-quiz`        | Create new quiz  |
| PUT    | `/api/explanation-quiz?id=:id` | Update quiz      |
| DELETE | `/api/explanation-quiz?id=:id` | Delete quiz      |

### Example Request (Create Quiz)

```bash
curl -X POST http://localhost:3000/api/explanation-quiz \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Phrasal Verbs - Lesson 1",
    "question": "Felix wollte seinen Augen nicht ___",
    "context": ": Sein Fahrrad war weg!",
    "category": "phrasen",
    "options": [
      {
        "text": "trauen",
        "explanation": "seinen Augen nicht trauen bedeutet...",
        "isCorrect": true,
        "commonMistake": ""
      },
      {
        "text": "vertrauen",
        "explanation": "Man benutzt vertrauen eher für Personen...",
        "isCorrect": false,
        "commonMistake": "Viele Lerner verwechseln..."
      }
    ]
  }'
```

## Database Schema

**Collection**: `explanation_quizzes`

```typescript
{
  _id: ObjectId,
  title: String,              // Optional title
  question: String,           // Main question (required)
  context: String,            // Additional context (optional)
  category: String,           // "phrasen", "vocab", "grammar", etc.
  options: [
    {
      _id: ObjectId,
      text: String,              // Answer option text
      explanation: String,       // Full explanation
      isCorrect: Boolean,        // Mark correct answer
      commonMistake: String      // Why this is a common mistake (optional)
    }
  ],
  created_at: DateTime,
  updated_at: DateTime
}
```

## Usage

### For Learners

1. Navigate to `/explanation-quiz`
2. Select a question from the list on the left
3. Read the question and choose an answer
4. Click "Check Answer" to reveal explanation
5. Compare all options or try again

### For Admins

1. Navigate to `/admin/explanation-quiz`
2. Fill in the form with:
   - **Title** (optional): A name for the quiz
   - **Question**: The main question (e.g., "Felix wollte seinen Augen nicht \_\_\_")
   - **Context**: Additional sentence context (optional)
   - **Category**: Select from predefined categories
   - **Options**: At least 2 options with explanations
3. Mark one option as correct
4. Optionally add "common mistake" explanations
5. Click "Create Quiz"
6. View all created quizzes in the list below
7. Edit or delete quizzes as needed

## Key Components

### ExplanationQuizPlayer

Main component for learners to take quizzes. Implements the three-phase learning approach.

**Props**:

```typescript
interface ExplanationQuizPlayerProps {
  quiz: ExplanationQuiz;
  onComplete?: (selectedOptionId: string, isCorrect: boolean) => void;
}
```

### ExplanationQuizAdmin

Main admin dashboard component combining form and list views.

### useExplanationQuizAdmin Hook

Custom hook for managing quiz CRUD operations.

```typescript
const {
  quizzes, // Array of all quizzes
  loading, // Loading state
  error, // Error message
  fetchQuizzes, // Fetch all quizzes
  createQuiz, // Create new quiz
  updateQuiz, // Update existing quiz
  deleteQuiz, // Delete quiz
} = useExplanationQuizAdmin();
```

## New UI Components Added

- **Textarea**: For multi-line text input
- **Checkbox**: For marking correct answers

Both components are in `src/components/ui/` and follow your existing component patterns.

## Environment Requirements

- MongoDB database with `explanation_quizzes` collection access
- `MONGODB_URI` environment variable configured
- Node.js 18+ for build
- Go 1.24.5+ for backend

## Development

### Start Development Server

```bash
npm run dev
```

### Build Production

```bash
npm run build
npm start
```

### Test the API Locally

```bash
# Create a quiz
curl -X POST http://localhost:3000/api/explanation-quiz \
  -H "Content-Type: application/json" \
  -d '{ ... }'

# Get all quizzes
curl http://localhost:3000/api/explanation-quiz

# Get single quiz
curl http://localhost:3000/api/explanation-quiz?id=YOUR_QUIZ_ID
```

## Next Steps (Optional Enhancements)

1. **Add Statistics**: Track learner performance
2. **Add Categories**: Filter quizzes by category
3. **Add Difficulty Levels**: Mark beginner/intermediate/advanced
4. **Add Images**: Support for visual explanations
5. **Add Audio**: Pronunciation examples
6. **Analytics Dashboard**: See which questions students struggle with most

## Files Changed/Added

### Added Files

- `api/models/explanation-quiz.go` - Data models
- `api/explanation-quiz.go` - API endpoints
- `src/types/explanation-quiz.ts` - TypeScript types
- `src/hooks/use-explanation-quiz-admin.ts` - Admin hook
- `src/components/explanation-quiz-player.tsx` - Learner UI
- `src/components/admin/explanation-quiz-form.tsx` - Create form
- `src/components/admin/explanation-quiz-list.tsx` - Quiz list
- `src/components/admin/explanation-quiz-admin.tsx` - Admin dashboard
- `src/components/ui/textarea.tsx` - UI component
- `src/components/ui/checkbox.tsx` - UI component
- `src/app/explanation-quiz/page.tsx` - Learner page
- `src/app/admin/explanation-quiz/page.tsx` - Admin page

### Modified Files

- `package.json` - Added @radix-ui/react-checkbox dependency

## Support

For questions or issues, check:

1. MongoDB connection (`MONGODB_URI` env var)
2. Browser console for client-side errors
3. Vercel function logs for server-side errors
