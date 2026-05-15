# 🤖 Setup Ollama untuk AI Explanation

Panduan lengkap untuk menginstall dan menggunakan Ollama sebagai AI lokal (gratis) untuk memberikan penjelasan catur.

## Apa itu Ollama?

Ollama adalah tool untuk menjalankan Large Language Model (LLM) secara lokal di komputer Anda. Ini berarti:
- ✅ **100% Gratis** - Tidak ada biaya API
- ✅ **Privacy** - Data tidak keluar dari komputer Anda
- ✅ **Offline** - Bisa jalan tanpa internet (setelah download model)
- ✅ **Cepat** - Response time lebih cepat dari cloud API

## Instalasi Ollama

### macOS

```bash
brew install ollama
```

Atau download installer dari: https://ollama.com/download/mac

### Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Windows

Download installer dari: https://ollama.com/download/windows

## Menjalankan Ollama

### 1. Start Ollama Service

```bash
ollama serve
```

Biarkan terminal ini tetap berjalan. Ollama akan listen di `http://localhost:11434`

### 2. Download Model (Terminal Baru)

Pilih salah satu model berikut:

#### Llama 2 (Recommended untuk pemula)
```bash
ollama pull llama2
```
- Size: ~3.8GB
- RAM: 8GB minimum
- Speed: Cepat
- Quality: Bagus untuk penjelasan umum

#### Mistral (Recommended untuk kualitas terbaik)
```bash
ollama pull mistral
```
- Size: ~4.1GB
- RAM: 8GB minimum
- Speed: Cepat
- Quality: Sangat bagus, lebih detail

#### Llama 2 7B (Untuk komputer dengan RAM terbatas)
```bash
ollama pull llama2:7b
```
- Size: ~3.8GB
- RAM: 6GB minimum
- Speed: Sangat cepat
- Quality: Cukup bagus

#### Llama 3 (Terbaru, paling canggih)
```bash
ollama pull llama3
```
- Size: ~4.7GB
- RAM: 10GB minimum
- Speed: Medium
- Quality: Excellent

### 3. Test Model

```bash
ollama run llama2
```

Coba tanya sesuatu:
```
>>> Jelaskan apa itu catur dalam 2 kalimat
```

Jika model menjawab dengan baik, berarti sudah siap digunakan!

Ketik `/bye` untuk keluar.

## Konfigurasi di BlunderLens

### 1. Copy Environment File

```bash
cp .env.local.example .env.local
```

### 2. Edit `.env.local`

```env
NEXT_PUBLIC_OLLAMA_URL=http://localhost:11434
NEXT_PUBLIC_OLLAMA_MODEL=llama2
```

Ganti `llama2` dengan model yang Anda download (mistral, llama3, dll)

### 3. Restart Development Server

```bash
npm run dev
```

## Testing Ollama Connection

Buka browser console dan test:

```javascript
fetch('http://localhost:11434/api/tags')
  .then(r => r.json())
  .then(data => console.log('Available models:', data));
```

Jika berhasil, Anda akan melihat list model yang terinstall.

## Troubleshooting

### Error: "Connection refused"

**Solusi:**
```bash
# Pastikan Ollama service berjalan
ollama serve
```

### Error: "Model not found"

**Solusi:**
```bash
# Download model terlebih dahulu
ollama pull llama2
```

### Error: "Out of memory"

**Solusi:**
- Gunakan model yang lebih kecil (llama2:7b)
- Tutup aplikasi lain yang memakan RAM
- Upgrade RAM komputer (minimum 8GB)

### Model terlalu lambat

**Solusi:**
- Gunakan model yang lebih kecil
- Pastikan tidak ada aplikasi berat lain yang berjalan
- Pertimbangkan upgrade hardware (CPU/GPU)

## Perbandingan Model

| Model | Size | RAM | Speed | Quality | Recommended For |
|-------|------|-----|-------|---------|-----------------|
| llama2:7b | 3.8GB | 6GB | ⚡⚡⚡ | ⭐⭐⭐ | Low-end PC |
| llama2 | 3.8GB | 8GB | ⚡⚡⚡ | ⭐⭐⭐⭐ | General use |
| mistral | 4.1GB | 8GB | ⚡⚡ | ⭐⭐⭐⭐⭐ | Best quality |
| llama3 | 4.7GB | 10GB | ⚡⚡ | ⭐⭐⭐⭐⭐ | Latest tech |

## Tips Optimasi

### 1. Keep Ollama Running

Jangan stop-start Ollama service terus menerus. Biarkan berjalan di background untuk response time yang lebih cepat.

### 2. Preload Model

```bash
# Preload model ke memory
ollama run llama2 <<< "test"
```

### 3. Adjust Context Length

Untuk response lebih cepat, kurangi context length di prompt.

### 4. Use GPU (jika ada)

Ollama otomatis menggunakan GPU jika tersedia (NVIDIA/AMD). Ini akan jauh lebih cepat.

## Alternative: Cloud API (Jika Ollama Tidak Bisa)

Jika komputer Anda tidak cukup kuat untuk menjalankan Ollama, Anda bisa gunakan:

### OpenAI API (Berbayar)
```env
NEXT_PUBLIC_AI_PROVIDER=openai
NEXT_PUBLIC_OPENAI_API_KEY=your-api-key
```

### Groq API (Gratis dengan limit)
```env
NEXT_PUBLIC_AI_PROVIDER=groq
NEXT_PUBLIC_GROQ_API_KEY=your-api-key
```

### Hugging Face (Gratis)
```env
NEXT_PUBLIC_AI_PROVIDER=huggingface
NEXT_PUBLIC_HF_API_KEY=your-api-key
```

## Resources

- [Ollama Official Website](https://ollama.com)
- [Ollama GitHub](https://github.com/ollama/ollama)
- [Model Library](https://ollama.com/library)
- [Ollama Discord Community](https://discord.gg/ollama)

---

**Selamat mencoba! 🚀**
