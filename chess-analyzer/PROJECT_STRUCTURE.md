# 📁 Struktur Project BlunderLens

## Overview

```
chess-analyzer/
├── app/                      # Next.js App Router
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React Components
│   ├── ChessAnalyzer.tsx   # Main orchestrator component
│   ├── PGNUploader.tsx     # PGN upload interface
│   ├── ChessBoard.tsx      # Interactive chess board
│   └── AnalysisPanel.tsx   # Analysis results display
├── lib/                     # Utility libraries
│   ├── stockfish.ts        # Stockfish engine wrapper
│   └── aiExplainer.ts      # AI explanation system
├── public/                  # Static assets
├── .env.local.example      # Environment variables template
├── README.md               # Main documentation
├── IMPLEMENTATION_GUIDE.md # Development guide
├── OLLAMA_SETUP.md        # AI setup guide
└── PROJECT_STRUCTURE.md   # This file
```

## Detailed Component Structure

### 1. App Directory (`app/`)

#### `page.tsx`
- Entry point aplikasi
- Render header dan ChessAnalyzer component
- Styling: gradient background, centered layout

#### `layout.tsx`
- Root layout dengan metadata
- Import global CSS
- Setup fonts (jika ada)

#### `globals.css`
- Tailwind imports
- Custom scrollbar styling
- Dark theme variables
- Global CSS overrides

### 2. Components (`components/`)

#### `ChessAnalyzer.tsx`
**Purpose:** Main orchestrator yang mengatur state dan koordinasi antar komponen

**State:**
- `game: Chess | null` - Instance chess.js
- `currentMoveIndex: number` - Index langkah saat ini
- `analysis: MoveAnalysis[]` - Hasil analisis
- `isAnalyzing: boolean` - Status analisis

**Functions:**
- `handlePGNLoad(pgn: string)` - Load PGN dan initialize game
- `handleMoveChange(index: number)` - Update posisi board
- `handleAnalyze()` - Trigger analisis Stockfish + AI

**Props to Children:**
- PGNUploader: `onPGNLoad`
- ChessBoard: `game`, `currentMoveIndex`, `onMoveChange`
- AnalysisPanel: `analysis`, `currentMoveIndex`

#### `PGNUploader.tsx`
**Purpose:** Interface untuk upload PGN

**Features:**
- Tab switching (Paste / File Upload)
- Textarea untuk paste PGN
- File input untuk upload .pgn
- Sample game loader
- Validation feedback

**Props:**
- `onPGNLoad: (pgn: string) => void`

#### `ChessBoard.tsx`
**Purpose:** Display dan navigasi chess board

**Features:**
- Interactive chess board (chessboardjsx)
- Move navigation controls (First, Prev, Next, Last)
- Clickable move list
- FEN position display
- Custom styling (purple theme)

**Props:**
- `game: Chess | null`
- `currentMoveIndex: number`
- `onMoveChange: (index: number) => void`

**State:**
- `position: string` - Current FEN position
- `moves: string[]` - List of moves

#### `AnalysisPanel.tsx`
**Purpose:** Display hasil analisis

**Features:**
- Current move analysis detail
- Classification badges (brilliant, blunder, etc.)
- Evaluation bar
- Best move suggestion
- AI explanation
- Summary statistics
- Accuracy score

**Props:**
- `analysis: MoveAnalysis[]`
- `currentMoveIndex: number`

### 3. Library (`lib/`)

#### `stockfish.ts`
**Purpose:** Wrapper untuk Stockfish chess engine

**Class:** `StockfishEngine`

**Methods:**
- `initialize()` - Setup engine
- `analyzePosition(fen, depth)` - Analyze posisi
- `stop()` - Stop analisis
- `quit()` - Cleanup engine

**Return Type:** `EngineAnalysis`
```typescript
{
  evaluation: number;    // Centipawn evaluation
  bestMove: string;      // Best move in UCI format
  depth: number;         // Search depth
  nodes: number;         // Nodes searched
}
```

#### `aiExplainer.ts`
**Purpose:** Generate human-friendly explanations menggunakan AI

**Class:** `AIExplainer`

**Methods:**
- `generateExplanation(request)` - Generate explanation
- `testConnection()` - Test Ollama connection
- `generatePlaceholderExplanation()` - Fallback explanation

**Input Type:** `ExplanationRequest`
```typescript
{
  move: string;
  evaluation: number;
  previousEvaluation: number;
  bestMove: string;
  position: string;
  moveNumber: number;
}
```

**Return Type:** `ExplanationResponse`
```typescript
{
  explanation: string;
  classification: 'brilliant' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
}
```

## Data Flow

```
User Action (Upload PGN)
    ↓
PGNUploader → onPGNLoad()
    ↓
ChessAnalyzer.handlePGNLoad()
    ↓
Update game state
    ↓
ChessBoard receives game prop
    ↓
Display initial position

User Action (Analyze)
    ↓
ChessAnalyzer.handleAnalyze()
    ↓
Loop through moves:
    ├→ StockfishEngine.analyzePosition()
    ├→ AIExplainer.generateExplanation()
    └→ Update analysis state
    ↓
AnalysisPanel receives analysis prop
    ↓
Display results

User Action (Navigate)
    ↓
ChessBoard.handleNext/Prev()
    ↓
ChessAnalyzer.handleMoveChange()
    ↓
Update currentMoveIndex
    ↓
ChessBoard updates position
    ↓
AnalysisPanel highlights current analysis
```

## State Management

### Global State (ChessAnalyzer)
- `game` - Chess game instance
- `currentMoveIndex` - Current position in game
- `analysis` - Analysis results for all moves
- `isAnalyzing` - Loading state

### Local State (Components)
- ChessBoard: `position`, `moves`
- PGNUploader: `pgnText`, `activeTab`
- AnalysisPanel: Computed from props

## Styling System

### Tailwind Classes
- Background: `bg-gray-800`, `bg-gray-900`
- Borders: `border-purple-500/30`
- Gradients: `from-blue-400 to-purple-400`
- Shadows: `shadow-xl`, `shadow-2xl`

### Color Palette
- **Primary:** Purple (#6B46C1, #7C3AED)
- **Secondary:** Blue (#3B82F6, #60A5FA)
- **Background:** Gray-900 (#111827)
- **Surface:** Gray-800 (#1F2937)
- **Text:** White, Gray-300
- **Accents:**
  - Brilliant: Cyan (#06B6D4)
  - Good: Green (#10B981)
  - Inaccuracy: Yellow (#F59E0B)
  - Mistake: Orange (#F97316)
  - Blunder: Red (#EF4444)

## Type Definitions

### MoveAnalysis
```typescript
interface MoveAnalysis {
  moveNumber: number;
  move: string;
  fen: string;
  evaluation: number;
  bestMove?: string;
  classification?: 'brilliant' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
  explanation?: string;
}
```

## Dependencies

### Production
- `next` - React framework
- `react` - UI library
- `react-dom` - React DOM renderer
- `chess.js` - Chess logic
- `chessboardjsx` - Chess board UI
- `stockfish.js` - Chess engine (to be added)

### Development
- `typescript` - Type checking
- `tailwindcss` - Styling
- `eslint` - Linting
- `@types/*` - Type definitions

## Future Additions

### Planned Components
- `OpeningRecognizer.tsx` - Display opening name
- `AccuracyMeter.tsx` - Visual accuracy gauge
- `PlayerStyleCard.tsx` - Style analysis display
- `ExportButton.tsx` - Export analysis as PDF
- `SettingsPanel.tsx` - User preferences

### Planned Libraries
- `lib/openings.ts` - Opening database
- `lib/accuracy.ts` - Accuracy calculation
- `lib/styleAnalyzer.ts` - Player style detection
- `lib/pdfExporter.ts` - PDF generation

### Planned Features
- User authentication
- Save analysis history
- Multiple AI personalities
- Voice commentary
- Animated review

---

**Last Updated:** May 2026
