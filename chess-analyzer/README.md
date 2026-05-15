# 🔍 BlunderLens - AI-Powered Chess Analyzer

Website analisis catur berbasis AI yang memberikan penjelasan manusiawi tentang permainan catur Anda.

## ✨ Fitur (MVP - Versi 1)

- ✅ **Upload PGN** - Paste atau upload file PGN
- ✅ **Interactive Chess Board** - Replay permainan dengan kontrol lengkap
- ✅ **Move Navigation** - Next, Previous, First, Last move
- ✅ **Move List** - Daftar semua langkah yang dapat diklik
- ✅ **Modern UI** - Dark theme dengan gradient purple/blue
- 🔄 **Stockfish Analysis** - (Coming Soon) Analisis dengan engine Stockfish
- 🤖 **AI Explanation** - (Coming Soon) Penjelasan manusiawi dari AI lokal

## 🚀 Cara Menjalankan

### Prerequisites

- Node.js 18+ 
- npm atau yarn
- (Opsional) Ollama untuk AI explanation - [Panduan Setup](./OLLAMA_SETUP.md)

### Instalasi

```bash
cd chess-analyzer
npm install
```

### Development

```bash
npm run dev
```

Buka browser di `http://localhost:3000`

### Build Production

```bash
npm run build
npm start
```

## 🤖 Setup AI (Opsional)

Website ini bisa berjalan tanpa AI, tapi untuk mendapatkan penjelasan yang lebih baik, Anda bisa setup Ollama (AI lokal gratis):

1. Install Ollama - [Panduan Lengkap](./OLLAMA_SETUP.md)
2. Download model: `ollama pull llama2`
3. Jalankan service: `ollama serve`
4. Copy `.env.local.example` ke `.env.local`
5. Restart development server

**Tanpa Ollama:** Website tetap bisa digunakan dengan penjelasan template sederhana.

## 📦 Teknologi yang Digunakan

- **Framework**: Next.js 15 + React 19
- **Styling**: Tailwind CSS
- **Chess Logic**: chess.js
- **Chess Board UI**: react-chessboard
- **Chess Engine**: stockfish.js (akan diimplementasikan)
- **AI**: Ollama (lokal, gratis) - akan diimplementasikan

## 🎮 Cara Menggunakan

1. **Upload PGN**
   - Paste PGN di textarea, atau
   - Upload file .pgn, atau
   - Klik "Load Sample Game" untuk mencoba

2. **Navigasi Permainan**
   - Gunakan tombol ⏮️ ◀️ ▶️ ⏭️ untuk navigasi
   - Atau klik langsung pada move di daftar langkah

3. **Analisis** (Coming Soon)
   - Klik tombol "🔍 Analisis Permainan"
   - Tunggu Stockfish menganalisis setiap langkah
   - Lihat penjelasan AI di panel kanan

## 🗺️ Roadmap

### ✅ Versi 1 (MVP) - Current
- [x] Upload PGN (paste & file)
- [x] Interactive chess board
- [x] Move navigation & replay
- [x] Modern UI dengan dark theme
- [ ] Stockfish integration
- [ ] AI explanation system

### 📋 Versi 2 (Planned)
- [ ] Blunder/Mistake/Inaccuracy detection
- [ ] Accuracy score calculation
- [ ] Opening recognition
- [ ] Best move suggestions
- [ ] Visual indicators (red/yellow/green)

### 🚀 Versi 3 (Future)
- [ ] Account system
- [ ] Save analysis history
- [ ] AI Coach personalities
- [ ] Player style analysis
- [ ] Export analysis as PDF

## 🎨 Design

- **Theme**: Dark modern dengan cyber chess aesthetic
- **Colors**: 
  - Background: Gray-900 dengan gradient purple
  - Primary: Purple-500/600
  - Secondary: Blue-400/500
  - Accent: Cyan, Green, Red untuk indicators

## 📝 Contoh PGN

```pgn
[Event "Sample Game"]
[Site "Online"]
[Date "2024.01.01"]
[White "Player1"]
[Black "Player2"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 
6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 1-0
```

## 🤝 Kontribusi

Project ini masih dalam tahap development aktif. Kontribusi dan saran sangat diterima!

## 📄 License

MIT License

---

**Dibuat dengan ❤️ untuk komunitas catur Indonesia**
