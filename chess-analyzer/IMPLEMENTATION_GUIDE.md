# 📘 Implementation Guide - BlunderLens

Panduan lengkap untuk melanjutkan development website analisis catur ini.

## ✅ Yang Sudah Diimplementasikan (MVP v1)

### 1. Frontend Structure
- ✅ Next.js 15 + React 19 + TypeScript
- ✅ Tailwind CSS dengan dark theme
- ✅ Responsive layout (3 kolom: Upload, Board, Analysis)

### 2. Components
- ✅ **ChessAnalyzer** - Main component orchestrator
- ✅ **PGNUploader** - Upload PGN via paste atau file
- ✅ **ChessBoard** - Interactive chess board dengan replay
- ✅ **AnalysisPanel** - Panel untuk menampilkan hasil analisis

### 3. Features
- ✅ Upload PGN (paste text & file upload)
- ✅ Sample game loader
- ✅ Interactive chess board visualization
- ✅ Move navigation (First, Previous, Next, Last)
- ✅ Clickable move list
- ✅ FEN position display
- ✅ Modern UI dengan gradient purple/blue

## 🔄 Yang Perlu Diimplementasikan Selanjutnya

### Phase 1: Stockfish Integration

#### 1.1 Setup Stockfish WASM

```bash
npm install stockfish.wasm
```

#### 1.2 Update `lib/stockfish.ts`

Implementasi fungsi-fungsi berikut:

```typescript
// Initialize Stockfish engine
async initialize() {
  const Stockfish = await import('stockfish.wasm');
  this.engine = await Stockfish.default();
  
  this.engine.addMessageListener((message: string) => {
    // Handle engine messages
    if (message.includes('readyok')) {
      this.isReady = true;
    }
  });
  
  this.engine.postMessage('uci');
  this.engine.postMessage('isready');
}

// Analyze position
async analyzePosition(fen: string, depth: number = 15): Promise<EngineAnalysis> {
  return new Promise((resolve) => {
    let bestMove = '';
    let evaluation = 0;
    
    this.engine.addMessageListener((message: string) => {
      // Parse UCI output
      if (message.includes('bestmove')) {
        bestMove = message.split(' ')[1];
      }
      if (message.includes('score cp')) {
        const match = message.match(/score cp (-?\d+)/);
        if (match) {
          evaluation = parseInt(match[1]) / 100;
        }
      }
      if (message.includes('depth ' + depth)) {
        resolve({ evaluation, bestMove, depth, nodes: 0 });
      }
    });
    
    this.engine.postMessage(`position fen ${fen}`);
    this.engine.postMessage(`go depth ${depth}`);
  });
}
```

#### 1.3 Update `components/ChessAnalyzer.tsx`

Implementasi fungsi `handleAnalyze`:

```typescript
const handleAnalyze = async () => {
  if (!game) return;
  
  setIsAnalyzing(true);
  const results: MoveAnalysis[] = [];
  
  // Initialize engine
  await stockfishEngine.initialize();
  
  // Analyze each move
  const history = game.history();
  const tempGame = new Chess();
  let previousEval = 0;
  
  for (let i = 0; i < history.length; i++) {
    const move = history[i];
    tempGame.move(move);
    
    // Get engine analysis
    const analysis = await stockfishEngine.analyzePosition(tempGame.fen());
    
    // Get AI explanation
    const explanation = await aiExplainer.generateExplanation({
      move,
      evaluation: analysis.evaluation,
      previousEvaluation: previousEval,
      bestMove: analysis.bestMove,
      position: tempGame.fen(),
      moveNumber: i + 1
    });
    
    results.push({
      moveNumber: i + 1,
      move,
      fen: tempGame.fen(),
      evaluation: analysis.evaluation,
      bestMove: analysis.bestMove,
      classification: explanation.classification,
      explanation: explanation.explanation
    });
    
    previousEval = analysis.evaluation;
    
    // Update progress
    setAnalysis([...results]);
  }
  
  setIsAnalyzing(false);
  await stockfishEngine.quit();
};
```

### Phase 2: AI Explanation dengan Ollama

#### 2.1 Install Ollama

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# Download dari https://ollama.com/download
```

#### 2.2 Download Model

```bash
ollama pull llama2
# atau model lain seperti:
# ollama pull mistral
# ollama pull codellama
```

#### 2.3 Update `lib/aiExplainer.ts`

```typescript
async generateExplanation(request: ExplanationRequest): Promise<ExplanationResponse> {
  const evalDiff = request.evaluation - request.previousEvaluation;
  
  // Classify move
  let classification: ExplanationResponse['classification'] = 'good';
  if (evalDiff < -3) classification = 'blunder';
  else if (evalDiff < -1.5) classification = 'mistake';
  else if (evalDiff < -0.5) classification = 'inaccuracy';
  else if (evalDiff > 2) classification = 'brilliant';
  
  // Create prompt for LLM
  const prompt = `
Kamu adalah seorang pelatih catur yang ramah dan membantu.
Jelaskan langkah catur berikut dengan bahasa yang mudah dipahami:

Langkah: ${request.move}
Nomor Langkah: ${request.moveNumber}
Evaluasi Sebelum: ${request.previousEvaluation.toFixed(2)}
Evaluasi Sesudah: ${request.evaluation.toFixed(2)}
Perubahan: ${evalDiff.toFixed(2)}
Langkah Terbaik: ${request.bestMove}
Klasifikasi: ${classification}

Berikan penjelasan singkat (2-3 kalimat) yang menjelaskan:
1. Apa yang terjadi dengan langkah ini
2. Mengapa ini ${classification}
3. Apa yang seharusnya dilakukan (jika ada kesalahan)

Gunakan bahasa Indonesia yang santai dan mudah dipahami.
`;

  try {
    const response = await fetch(`${this.ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: prompt,
        stream: false
      })
    });
    
    const data = await response.json();
    
    return {
      explanation: data.response,
      classification
    };
  } catch (error) {
    console.error('Ollama API error:', error);
    // Fallback to placeholder
    return {
      explanation: this.generatePlaceholderExplanation(request, classification),
      classification
    };
  }
}
```

### Phase 3: Advanced Features

#### 3.1 Opening Recognition

```typescript
// lib/openings.ts
export const openingDatabase = {
  'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1': 'King\'s Pawn Opening',
  'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1': 'Queen\'s Pawn Opening',
  // Add more openings...
};

export function recognizeOpening(fen: string): string | null {
  return openingDatabase[fen] || null;
}
```

#### 3.2 Accuracy Score Calculation

```typescript
export function calculateAccuracy(analysis: MoveAnalysis[]): number {
  const goodMoves = analysis.filter(a => 
    a.classification === 'brilliant' || 
    a.classification === 'good' || 
    !a.classification
  ).length;
  
  return Math.round((goodMoves / analysis.length) * 100);
}
```

#### 3.3 Player Style Analysis

```typescript
export function analyzePlayerStyle(analysis: MoveAnalysis[]): string {
  const blunders = analysis.filter(a => a.classification === 'blunder').length;
  const brilliant = analysis.filter(a => a.classification === 'brilliant').length;
  const avgEval = analysis.reduce((sum, a) => sum + Math.abs(a.evaluation), 0) / analysis.length;
  
  if (brilliant > 3 && blunders > 2) return 'Tactical/Aggressive';
  if (avgEval < 0.5) return 'Positional/Solid';
  if (blunders < 1) return 'Careful/Defensive';
  return 'Balanced';
}
```

## 🎨 UI Improvements

### Progress Bar untuk Analisis

```typescript
// Add to ChessAnalyzer
const [analysisProgress, setAnalysisProgress] = useState(0);

// Update in handleAnalyze loop
setAnalysisProgress((i + 1) / history.length * 100);
```

### Visual Indicators di Board

```typescript
// Add arrows for best moves
// Add highlighting for blunders
// Add evaluation bar
```

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd chess-analyzer
vercel
```

### Environment Variables

Buat file `.env.local`:

```env
NEXT_PUBLIC_OLLAMA_URL=http://localhost:11434
NEXT_PUBLIC_OLLAMA_MODEL=llama2
```

## 📝 Testing

### Manual Testing Checklist

- [ ] Upload PGN via paste
- [ ] Upload PGN via file
- [ ] Load sample game
- [ ] Navigate moves (First, Prev, Next, Last)
- [ ] Click moves in list
- [ ] Analyze game
- [ ] View analysis results
- [ ] Check accuracy score
- [ ] Responsive design (mobile, tablet, desktop)

## 🐛 Known Issues & TODOs

- [ ] Stockfish WASM integration
- [ ] Ollama API integration
- [ ] Progress indicator during analysis
- [ ] Error handling for invalid PGN
- [ ] Loading states
- [ ] Mobile optimization
- [ ] Export analysis as PDF
- [ ] Save analysis history
- [ ] User accounts
- [ ] Multiple AI coach personalities

## 📚 Resources

- [Stockfish.js Documentation](https://github.com/nmrugg/stockfish.js)
- [Ollama Documentation](https://github.com/ollama/ollama)
- [Chess.js Documentation](https://github.com/jhlywa/chess.js)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Happy Coding! ♟️**
