// AI Explanation System using local LLM (Ollama)
import { 
  calculateExpectedPointsLoss, 
  classifyMoveByExpectedPoints,
  isBrilliantMove,
  isGreatMove,
  isMissedOpportunity,
  calculateExpectedPoints
} from './expectedPoints';

export interface ExplanationRequest {
  move: string;
  evaluation: number;
  previousEvaluation: number;
  bestMove: string;
  bestMoveEvaluation?: number; // Evaluation after best move
  position: string;
  moveNumber: number;
  isWhite: boolean;
  playerRating?: number; // Optional: for Expected Points adjustment
  isBookMove?: boolean; // Optional: is this a theory move?
}

export interface ExplanationResponse {
  explanation: string;
  classification: 'brilliant' | 'great' | 'best' | 'excellent' | 'good' | 'book' | 'inaccuracy' | 'mistake' | 'miss' | 'blunder';
  expectedPointsLoss?: number;
  winProbability?: number;
}

export class AIExplainer {
  private ollamaUrl: string;
  private model: string;
  private useOllama: boolean = false;

  constructor() {
    this.ollamaUrl = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434';
    this.model = process.env.NEXT_PUBLIC_OLLAMA_MODEL || 'llama2';
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/tags`, {
        method: 'GET',
      });
      this.useOllama = response.ok;
      return response.ok;
    } catch (error) {
      console.log('Ollama not available, using fallback explanations');
      this.useOllama = false;
      return false;
    }
  }

  async generateExplanation(request: ExplanationRequest): Promise<ExplanationResponse> {
    // Check if this is a book move (opening theory)
    // Book moves are typically in the first 10-15 moves
    if (request.isBookMove || (request.moveNumber <= 10 && Math.abs(request.evaluation) < 0.5)) {
      return {
        explanation: `📚 ${request.move} adalah langkah teori opening yang umum dimainkan. Ini mengikuti prinsip pembukaan yang baik.`,
        classification: 'book',
        expectedPointsLoss: 0,
        winProbability: 0.5
      };
    }
    
    // Convert evaluations to centipawns
    const prevEvalCp = request.previousEvaluation * 100;
    const currEvalCp = request.evaluation * 100;
    const bestMoveEvalCp = request.bestMoveEvaluation ? request.bestMoveEvaluation * 100 : currEvalCp;
    
    // Calculate Expected Points Loss (Chess.com style)
    const expectedPointsLoss = calculateExpectedPointsLoss(
      prevEvalCp,
      currEvalCp,
      request.isWhite
    );
    
    // Calculate win probability
    const { winProbability } = calculateExpectedPoints(
      request.isWhite ? currEvalCp : -currEvalCp
    );
    
    // Check for Miss (missed opportunity/tactic)
    if (isMissedOpportunity(currEvalCp, bestMoveEvalCp, request.isWhite) && expectedPointsLoss < 0.05) {
      return {
        explanation: `✗ Miss! ${request.move} melewatkan kesempatan yang lebih baik. ${request.bestMove} akan memberikan keuntungan signifikan.`,
        classification: 'miss',
        expectedPointsLoss,
        winProbability
      };
    }
    
    // Classify move using Expected Points Model
    let classification = classifyMoveByExpectedPoints(
      expectedPointsLoss,
      request.playerRating
    );
    
    // Check for Brilliant move (special case)
    if (isBrilliantMove(expectedPointsLoss, currEvalCp, prevEvalCp)) {
      classification = 'brilliant';
    }
    // Check for Great move
    else if (isGreatMove(expectedPointsLoss, currEvalCp)) {
      classification = 'great';
    }
    
    // Calculate centipawn loss for explanation
    const evalDiff = request.evaluation - request.previousEvaluation;
    const adjustedDiff = request.isWhite ? evalDiff : -evalDiff;
    const centipawnLoss = Math.max(0, -adjustedDiff * 100);

    // Try Ollama first if available
    if (this.useOllama) {
      try {
        const explanation = await this.generateOllamaExplanation(request, classification, adjustedDiff);
        return { 
          explanation, 
          classification,
          expectedPointsLoss,
          winProbability
        };
      } catch (error) {
        console.error('Ollama generation failed, using fallback:', error);
      }
    }

    // Fallback to template-based explanation
    const explanation = this.generateTemplateExplanation(
      request, 
      classification, 
      adjustedDiff, 
      centipawnLoss,
      expectedPointsLoss,
      winProbability
    );
    
    return { 
      explanation, 
      classification,
      expectedPointsLoss,
      winProbability
    };
  }

  private async generateOllamaExplanation(
    request: ExplanationRequest,
    classification: string,
    evalDiff: number
  ): Promise<string> {
    const prompt = `Kamu adalah pelatih catur yang ramah dan membantu pemain belajar.

Analisis langkah catur berikut:
- Langkah: ${request.move}
- Nomor: ${request.moveNumber}
- Pemain: ${request.isWhite ? 'Putih' : 'Hitam'}
- Evaluasi sebelum: ${request.previousEvaluation.toFixed(2)}
- Evaluasi sesudah: ${request.evaluation.toFixed(2)}
- Perubahan: ${evalDiff.toFixed(2)}
- Langkah terbaik: ${request.bestMove}
- Klasifikasi: ${classification}

Berikan penjelasan singkat (2-3 kalimat) dalam bahasa Indonesia yang:
1. Menjelaskan apa yang terjadi dengan langkah ini
2. Mengapa ini ${classification}
3. Saran perbaikan (jika ada kesalahan)

Gunakan bahasa santai dan mudah dipahami. Jangan gunakan notasi teknis yang rumit.`;

    const response = await fetch(`${this.ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 150,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Ollama API request failed');
    }

    const data = await response.json();
    return data.response.trim();
  }

  private generateTemplateExplanation(
    request: ExplanationRequest,
    classification: string,
    evalDiff: number,
    centipawnLoss: number,
    expectedPointsLoss: number,
    winProbability: number
  ): string {
    const player = request.isWhite ? 'Putih' : 'Hitam';
    const cpLoss = Math.round(centipawnLoss);
    const epLossPercent = Math.round(expectedPointsLoss * 100);
    const winProbPercent = Math.round(winProbability * 100);

    const templates = {
      brilliant: [
        `⭐ Langkah cemerlang! ${request.move} adalah langkah terbaik yang meningkatkan posisi secara signifikan. Ini menunjukkan perhitungan yang mendalam.`,
        `⭐ Excellent! ${request.move} adalah langkah yang sangat kuat. ${player} menemukan langkah terbaik di posisi yang kompleks ini.`,
        `⭐ Brilian! ${request.move} adalah pilihan optimal yang membutuhkan visi taktik yang tajam. Win probability: ${winProbPercent}%`
      ],
      great: [
        `! Langkah yang sangat bagus! ${request.move} adalah salah satu langkah terbaik di posisi ini. Win probability: ${winProbPercent}%`,
        `! ${request.move} adalah pilihan yang sangat kuat. ${player} bermain dengan akurasi tinggi.`,
        `! Great move! ${request.move} mempertahankan keuntungan dengan sempurna. Loss: ${epLossPercent}%`
      ],
      best: [
        `★ Best move! ${request.move} adalah langkah terbaik menurut engine. Win probability: ${winProbPercent}%`,
        `★ ${request.move} adalah langkah optimal. ${player} menemukan continuation terbaik.`,
        `★ Perfect! ${request.move} adalah pilihan engine. Loss: <1%`
      ],
      excellent: [
        `✓ Excellent! ${request.move} adalah langkah yang sangat akurat. Loss: ${epLossPercent}%`,
        `✓ ${request.move} adalah pilihan yang hampir sempurna. ${player} bermain dengan presisi tinggi.`,
        `✓ ${request.move} mempertahankan posisi dengan sangat baik. Win probability: ${winProbPercent}%`
      ],
      good: [
        `✓ ${request.move} adalah langkah yang solid dan mengikuti prinsip catur yang baik. Posisi tetap seimbang.`,
        `✓ Langkah yang bagus. ${request.move} mempertahankan keuntungan tanpa memberikan kesempatan kepada lawan.`,
        `✓ ${request.move} adalah pilihan yang tepat. ${player} bermain dengan konsisten dan akurat.`
      ],
      book: [
        `📚 ${request.move} adalah langkah teori opening yang umum dimainkan. Ini mengikuti prinsip pembukaan yang baik.`,
        `📚 Book move! ${request.move} adalah bagian dari teori opening yang sudah dikenal.`,
        `📚 ${request.move} mengikuti teori. ${player} bermain sesuai dengan opening preparation.`
      ],
      inaccuracy: [
        `?! ${request.move} kurang akurat (${cpLoss} cp loss, ${epLossPercent}% EP loss). Langkah ${request.bestMove} akan mempertahankan posisi lebih baik.`,
        `?! Inaccuracy. ${request.move} kehilangan sedikit keuntungan. Pertimbangkan ${request.bestMove} untuk posisi yang lebih kuat.`,
        `?! ${request.move} membiarkan lawan mendapat sedikit counterplay. ${request.bestMove} akan mempertahankan tekanan lebih baik.`
      ],
      mistake: [
        `? Mistake! ${request.move} memberikan keuntungan signifikan kepada lawan (${cpLoss} cp loss, ${epLossPercent}% EP loss). Langkah terbaik adalah ${request.bestMove}.`,
        `? ${request.move} adalah kesalahan yang merugikan. Lawan mendapat kesempatan untuk counterplay. ${request.bestMove} akan mempertahankan posisi.`,
        `? ${request.move} terlalu lemah dan kehilangan keuntungan. ${request.bestMove} adalah pilihan yang jauh lebih baik.`
      ],
      miss: [
        `✗ Miss! ${request.move} melewatkan kesempatan yang lebih baik. ${request.bestMove} akan memberikan keuntungan signifikan (+${Math.round((request.bestMoveEvaluation || request.evaluation) * 100 - request.evaluation * 100)} cp).`,
        `✗ Missed opportunity! ${request.move} tidak buruk, tapi ${request.bestMove} jauh lebih kuat dan memberikan keuntungan besar.`,
        `✗ ${request.move} melewatkan taktik atau continuation yang lebih baik. ${request.bestMove} adalah langkah yang harus ditemukan.`
      ],
      blunder: [
        `?? Blunder! ${request.move} adalah kesalahan kritis yang kehilangan material atau posisi (${cpLoss} cp loss, ${epLossPercent}% EP loss). Langkah terbaik adalah ${request.bestMove}.`,
        `?? Kesalahan fatal! ${request.move} memberikan keuntungan besar kepada lawan. Selalu cek ancaman lawan sebelum bergerak.`,
        `?? ${request.move} adalah blunder yang mengubah hasil permainan. ${request.bestMove} akan mempertahankan posisi. Perhatikan taktik lawan!`
      ]
    };

    const options = templates[classification as keyof typeof templates];
    return options ? options[Math.floor(Math.random() * options.length)] : `${request.move} dimainkan.`;
  }
}

export const aiExplainer = new AIExplainer();
