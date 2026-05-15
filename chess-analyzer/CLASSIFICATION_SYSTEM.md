# Chess Move Classification System

## Overview
BlunderLens menggunakan **Expected Points Model** (seperti Chess.com) untuk mengklasifikasikan setiap langkah dalam permainan catur. Sistem ini mengukur **win probability loss** (kehilangan peluang menang) daripada hanya centipawn loss.

---

## 10 Kategori Klasifikasi

### 1. ⭐ Brilliant (!!)
**Kriteria**:
- Expected Points Loss: <0.5%
- Improvement: >1.5 pawns (150 cp)
- Position remains good (eval > -100 cp)
- Biasanya melibatkan sacrifice atau taktik kompleks

**Contoh**: Sacrifice queen untuk checkmate, brilliant tactical blow

**Warna**: Cyan (#1baca6)

---

### 2. ! Great
**Kriteria**:
- Expected Points Loss: <1%
- Position evaluation: |eval| < 300 cp (posisi masih bagus)
- Salah satu langkah terbaik, tapi bukan satu-satunya

**Contoh**: Strong move yang mempertahankan keuntungan dengan sempurna

**Warna**: Blue (#5c9fc8)

---

### 3. 📚 Book
**Kriteria**:
- Move number ≤ 10
- Evaluation: |eval| < 0.5 (posisi seimbang)
- Langkah teori opening yang umum dimainkan

**Contoh**: e4, d4, Nf3, Sicilian Defense moves, dll

**Warna**: Brown (#a88865)

---

### 4. ★ Best
**Kriteria**:
- Expected Points Loss: <1%
- Langkah terbaik menurut engine
- Optimal continuation

**Contoh**: Engine's top choice

**Warna**: Green (#96bc4b)

---

### 5. ✓+ Excellent
**Kriteria**:
- Expected Points Loss: 1-2%
- Hampir sempurna, presisi tinggi

**Contoh**: Very accurate move, minimal loss

**Warna**: Light Green (#96af8b)

---

### 6. ✓ Good
**Kriteria**:
- Expected Points Loss: 2-5%
- Solid move, mengikuti prinsip catur yang baik

**Contoh**: Reasonable move, no major issues

**Warna**: Green (#96bc4b)

---

### 7. ?! Inaccuracy
**Kriteria**:
- Expected Points Loss: 5-10%
- Kehilangan sedikit keuntungan
- Memberikan counterplay kepada lawan

**Contoh**: Passive move, missed better continuation

**Warna**: Yellow (#f0c15c)

---

### 8. ? Mistake
**Kriteria**:
- Expected Points Loss: 10-20%
- Kesalahan yang merugikan
- Memberikan keuntungan signifikan kepada lawan

**Contoh**: Tactical oversight, positional error

**Warna**: Orange (#e58f2a)

---

### 9. ✗ Miss
**Kriteria**:
- Best move is >200 cp (2 pawns) better
- Expected Points Loss: <5% (move itself not terrible)
- Melewatkan kesempatan taktik atau winning continuation

**Contoh**: Missed checkmate in 3, missed winning tactic, missed forced win

**Warna**: Dark Orange (#e07c3e)

**Catatan**: "Miss" berbeda dengan "Mistake" karena langkah yang dimainkan tidak buruk, tapi ada langkah yang JAUH lebih baik yang terlewatkan.

---

### 10. ?? Blunder
**Kriteria**:
- Expected Points Loss: ≥20%
- Kesalahan kritis
- Kehilangan material atau posisi secara signifikan

**Contoh**: Hanging piece, checkmate in 1 missed, losing position

**Warna**: Red (#b33430)

---

## Expected Points Model Formula

### Win Probability Calculation
```typescript
winProbability = 1 / (1 + 10^(-evaluation/4))
```

**Contoh**:
- Eval = +1.00 (1 pawn) → Win Prob = 64%
- Eval = +2.00 (2 pawns) → Win Prob = 76%
- Eval = +3.00 (3 pawns) → Win Prob = 85%
- Eval = 0.00 (equal) → Win Prob = 50%
- Eval = -1.00 → Win Prob = 36%

### Expected Points Loss
```typescript
expectedPointsLoss = max(0, prevWinProb - currWinProb)
```

**Contoh**:
- Prev: 70% → Curr: 65% → Loss = 5% (Inaccuracy)
- Prev: 60% → Curr: 40% → Loss = 20% (Blunder)
- Prev: 50% → Curr: 48% → Loss = 2% (Good)

---

## Accuracy Calculation

### Formula
```typescript
accuracy = 100 - (avgExpectedPointsLoss * 100)
```

**Contoh**:
- Avg Loss = 0% → Accuracy = 100%
- Avg Loss = 5% → Accuracy = 95%
- Avg Loss = 15% → Accuracy = 85%
- Avg Loss = 25% → Accuracy = 75%

### Rating Adjustment (Optional)
Untuk player dengan rating tinggi, threshold lebih ketat:
```typescript
ratingFactor = max(0.7, min(1.3, 1 - (rating - 1500) / 3000))
```

**Contoh**:
- Rating 1500: factor = 1.0 (normal)
- Rating 2000: factor = 0.83 (stricter)
- Rating 2500: factor = 0.67 (very strict)
- Rating 1000: factor = 1.17 (more lenient)

---

## Perbedaan dengan Centipawn Loss

### Centipawn Loss (Old Method)
- Linear: 100 cp loss = 100 cp loss (tidak peduli posisi)
- Tidak memperhitungkan win probability
- Kurang akurat di posisi winning/losing

### Expected Points Model (New Method)
- Non-linear: 100 cp loss di posisi equal ≠ 100 cp loss di posisi winning
- Memperhitungkan win probability
- Lebih akurat mencerminkan dampak sebenarnya dari sebuah langkah

**Contoh**:
- Posisi equal (50% win): -100 cp loss = ~6% win prob loss (Inaccuracy)
- Posisi winning (90% win): -100 cp loss = ~2% win prob loss (Good)
- Posisi losing (10% win): -100 cp loss = ~1% win prob loss (Excellent)

---

## Comparison: BlunderLens vs Chess.com

### Similarities
- ✅ Expected Points Model
- ✅ Win probability calculation
- ✅ 10 classification categories
- ✅ Book moves detection
- ✅ Miss detection (missed opportunities)
- ✅ Rating-adjusted thresholds

### Differences
- ⚠️ Chess.com uses proprietary algorithms for Brilliant detection
- ⚠️ Chess.com has access to opening database (millions of games)
- ⚠️ Chess.com uses cloud-based Stockfish (higher depth)
- ⚠️ BlunderLens uses Stockfish depth 14 (local, faster)
- ⚠️ BlunderLens uses simplified Brilliant criteria

### Why Results May Differ
1. **Analysis Depth**: Chess.com may use depth 18-20+, we use depth 14
2. **Opening Database**: Chess.com has extensive opening theory, we use simple heuristic
3. **Brilliant Detection**: Chess.com uses complex ML models, we use simplified rules
4. **Time Control**: Chess.com considers time spent on moves, we don't (yet)
5. **Position Complexity**: Chess.com evaluates position complexity, we don't (yet)

---

## Future Improvements

### Phase 1 (High Priority)
- [ ] Integrate opening book database (Lichess/ECO)
- [ ] Improve Brilliant move detection (sacrifice detection)
- [ ] Add player rating input for personalized analysis
- [ ] Implement multi-PV analysis for Miss detection

### Phase 2 (Medium Priority)
- [ ] Add position complexity evaluation
- [ ] Implement tactical pattern recognition
- [ ] Add time control consideration
- [ ] Improve Book move detection with real database

### Phase 3 (Low Priority)
- [ ] Machine learning for Brilliant detection
- [ ] Cloud-based analysis option (higher depth)
- [ ] Compare with multiple engines (Stockfish, Leela)
- [ ] Add endgame tablebase integration

---

## Technical Implementation

### Files
- `lib/expectedPoints.ts` - Expected Points Model calculations
- `lib/aiExplainer.ts` - Classification logic & explanations
- `components/AnalysisPanel.tsx` - Display classifications
- `components/GameSummary.tsx` - Accuracy & statistics

### Key Functions
```typescript
// Calculate win probability from evaluation
evaluationToWinProbability(evaluation: number): number

// Calculate expected points loss
calculateExpectedPointsLoss(prevEval, currEval, isWhite): number

// Classify move
classifyMoveByExpectedPoints(loss, rating?): Classification

// Check for special cases
isBrilliantMove(loss, eval, prevEval): boolean
isGreatMove(loss, eval): boolean
isMissedOpportunity(playedEval, bestEval, isWhite): boolean
```

---

## References

1. **Chess.com Classification V2**
   - https://www.chess.com/article/view/how-chess-com-analyzes-your-games

2. **Expected Points Model**
   - Formula: `1 / (1 + 10^(-eval/4))`
   - Based on logistic regression of chess outcomes

3. **Stockfish Evaluation**
   - https://github.com/official-stockfish/Stockfish
   - Depth 14 = ~1-2 seconds per position

4. **Lichess Opening Database**
   - https://lichess.org/api
   - Millions of master games

---

**Last Updated**: May 15, 2026  
**Version**: 2.0.0 (Expected Points Model)
