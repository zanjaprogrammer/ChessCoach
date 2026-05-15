# ⚡ Quick Start Guide - BlunderLens

Panduan cepat untuk mulai menggunakan BlunderLens dalam 5 menit!

## 🎯 Langkah 1: Install Dependencies

```bash
cd chess-analyzer
npm install
```

⏱️ Waktu: ~2 menit

## 🚀 Langkah 2: Jalankan Development Server

```bash
npm run dev
```

Buka browser di: **http://localhost:3000**

⏱️ Waktu: ~10 detik

## 🎮 Langkah 3: Coba Aplikasi

### Option A: Load Sample Game (Tercepat)

1. Klik tombol **"🎮 Load Sample Game"**
2. Board akan menampilkan permainan sample
3. Gunakan tombol ⏮️ ◀️ ▶️ ⏭️ untuk navigasi
4. Klik langkah di daftar untuk jump ke posisi tertentu

⏱️ Waktu: ~30 detik

### Option B: Upload PGN Sendiri

1. Copy PGN dari Chess.com atau Lichess
2. Paste di textarea
3. Klik **"Load PGN"**
4. Navigasi permainan Anda!

⏱️ Waktu: ~1 menit

## ✅ Selesai!

Anda sudah bisa menggunakan fitur dasar BlunderLens:
- ✅ Upload PGN
- ✅ Replay permainan
- ✅ Navigasi langkah
- ✅ Lihat FEN position

## 🔮 Next Steps (Opsional)

### Aktifkan Analisis AI

Untuk mendapatkan analisis dan penjelasan AI:

1. **Install Ollama** (AI lokal gratis)
   ```bash
   # macOS
   brew install ollama
   
   # Linux
   curl -fsSL https://ollama.com/install.sh | sh
   ```

2. **Download Model**
   ```bash
   ollama pull llama2
   ```

3. **Jalankan Ollama**
   ```bash
   ollama serve
   ```

4. **Setup Environment**
   ```bash
   cp .env.local.example .env.local
   ```

5. **Restart Dev Server**
   ```bash
   npm run dev
   ```

📖 Panduan lengkap: [OLLAMA_SETUP.md](./OLLAMA_SETUP.md)

⏱️ Waktu: ~10 menit (termasuk download model)

## 🎨 Fitur yang Tersedia Sekarang

| Fitur | Status | Cara Pakai |
|-------|--------|------------|
| Upload PGN (Paste) | ✅ | Paste di textarea → Load PGN |
| Upload PGN (File) | ✅ | Klik tab "Upload File" → Pilih .pgn |
| Sample Game | ✅ | Klik "Load Sample Game" |
| Interactive Board | ✅ | Otomatis muncul setelah load PGN |
| Move Navigation | ✅ | Gunakan tombol ⏮️ ◀️ ▶️ ⏭️ |
| Move List | ✅ | Klik langkah untuk jump |
| FEN Display | ✅ | Lihat di bawah board |
| Stockfish Analysis | 🔄 | Coming Soon |
| AI Explanation | 🔄 | Coming Soon |

## 📝 Contoh PGN untuk Testing

### Game Pendek (Testing Cepat)
```
1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O 1-0
```

### Game dengan Blunder (Testing Analisis)
```
1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Nc3 Nxe4 8. O-O Bxc3 9. bxc3 d5 10. Ba3 dxc4 11. Re1 Be6 12. Rxe4 Qd5 13. Rg4 O-O-O 14. Rxg7 Rhg8 15. Rxf7 Bxf7 16. Ng5 Rde8 17. Nxf7 Qxf7 18. Qf3 Qxf3 19. gxf3 Re2 20. Kf1 Rxa2 21. Rxa2 1-0
```

### Game Kompleks (Testing Navigasi)
```
[Event "World Championship"]
[Site "Moscow"]
[Date "1985.11.09"]
[White "Kasparov, Garry"]
[Black "Karpov, Anatoly"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7 11. Nbd2 Bb7 12. Bc2 Re8 13. Nf1 Bf8 14. Ng3 g6 15. a4 c5 16. d5 c4 17. Bg5 h6 18. Be3 Nc5 19. Qd2 h5 20. Bh6 Bxh6 21. Qxh6 Qf8 22. Qd2 Qg7 23. axb5 axb5 24. Rxa8 Rxa8 25. Nh4 Kh7 26. Nhf5 gxf5 27. Nxf5 Qf8 28. Qg5 Rg8 29. Qh6+ Kg6 30. Qh4 Kh7 31. Re3 Nfd7 32. Rg3 Rxg3 33. Qxg3 Qg8 34. Qh4+ Kg6 35. Nh6 1-0
```

## 🐛 Troubleshooting

### Port 3000 sudah digunakan?
```bash
# Gunakan port lain
npm run dev -- -p 3001
```

### Error saat npm install?
```bash
# Clear cache dan install ulang
rm -rf node_modules package-lock.json
npm install
```

### Board tidak muncul?
- Refresh browser (Cmd/Ctrl + R)
- Clear browser cache
- Coba browser lain

### PGN tidak bisa di-load?
- Pastikan format PGN valid
- Coba dengan sample game dulu
- Check console untuk error message

## 💡 Tips

1. **Keyboard Shortcuts** (Coming Soon)
   - `←` Previous move
   - `→` Next move
   - `Home` First move
   - `End` Last move

2. **Copy PGN dari Chess.com**
   - Buka game → Share → Copy PGN
   - Paste di BlunderLens

3. **Copy PGN dari Lichess**
   - Buka game → Share & Export → PGN
   - Paste di BlunderLens

4. **Performance**
   - Untuk game panjang (>50 moves), analisis akan memakan waktu
   - Close tab lain untuk performa lebih baik

## 📚 Dokumentasi Lengkap

- [README.md](./README.md) - Overview & features
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Development guide
- [OLLAMA_SETUP.md](./OLLAMA_SETUP.md) - AI setup
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Code structure

## 🆘 Butuh Bantuan?

- Check dokumentasi di atas
- Lihat console browser untuk error
- Check terminal untuk server error

---

**Selamat bermain catur! ♟️**
