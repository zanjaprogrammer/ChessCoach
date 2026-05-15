// Stockfish Engine Integration
export interface EngineAnalysis {
  evaluation: number;
  bestMove: string;
  depth: number;
  mate?: number;
}

export class StockfishEngine {
  private worker: Worker | null = null;
  private isReady: boolean = false;
  private messageHandlers: ((message: string) => void)[] = [];

  async initialize(): Promise<void> {
    return new Promise((resolve) => {
      // Use CDN-hosted Stockfish
      this.worker = new Worker('/stockfish-worker.js');
      
      this.worker.onmessage = (event) => {
        const message = event.data;
        
        if (message === 'readyok') {
          this.isReady = true;
          resolve();
        }
        
        // Notify all handlers
        this.messageHandlers.forEach(handler => handler(message));
      };

      // Initialize UCI
      this.worker.postMessage('uci');
      this.worker.postMessage('isready');
    });
  }

  async analyzePosition(fen: string, depth: number = 15): Promise<EngineAnalysis> {
    if (!this.worker || !this.isReady) {
      throw new Error('Engine not initialized');
    }

    return new Promise((resolve) => {
      let bestMove = '';
      let evaluation = 0;
      let mate: number | undefined;

      const handler = (message: string) => {
        // Parse best move
        if (message.startsWith('bestmove')) {
          const parts = message.split(' ');
          bestMove = parts[1];
          
          // Remove handler and resolve
          this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
          resolve({ evaluation, bestMove, depth, mate });
        }
        
        // Parse evaluation
        if (message.includes('score')) {
          if (message.includes('mate')) {
            const mateMatch = message.match(/mate (-?\d+)/);
            if (mateMatch) {
              mate = parseInt(mateMatch[1]);
              evaluation = mate > 0 ? 100 : -100;
            }
          } else if (message.includes('cp')) {
            const cpMatch = message.match(/cp (-?\d+)/);
            if (cpMatch) {
              evaluation = parseInt(cpMatch[1]) / 100;
            }
          }
        }
      };

      this.messageHandlers.push(handler);
      
      // Send position and analyze (worker is guaranteed to exist here)
      if (this.worker) {
        this.worker.postMessage(`position fen ${fen}`);
        this.worker.postMessage(`go depth ${depth}`);
      }
    });
  }

  stop(): void {
    if (this.worker) {
      this.worker.postMessage('stop');
    }
  }

  quit(): void {
    if (this.worker) {
      this.worker.postMessage('quit');
      this.worker.terminate();
      this.worker = null;
      this.isReady = false;
      this.messageHandlers = [];
    }
  }
}

export const stockfishEngine = new StockfishEngine();
