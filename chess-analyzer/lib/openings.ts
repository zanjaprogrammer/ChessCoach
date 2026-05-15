/**
 * Opening Book Integration
 * Identifies chess openings from positions
 */

export interface OpeningInfo {
  name: string;
  eco: string; // ECO code (e.g., "B90")
  variation?: string;
  moves: string;
}

// Comprehensive opening database with ECO codes
// Based on Encyclopedia of Chess Openings (ECO)
export const openingDatabase: Record<string, OpeningInfo> = {
  // King's Pawn Openings (C00-C99, B00-B99)
  'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1': {
    name: "King's Pawn Opening",
    eco: 'B00',
    moves: 'e4'
  },
  'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2': {
    name: "King's Pawn Game",
    eco: 'C20',
    moves: 'e4 e5'
  },
  'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2': {
    name: "King's Knight Opening",
    eco: 'C40',
    moves: 'e4 e5 Nf3'
  },
  'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3': {
    name: 'Three Knights Opening',
    eco: 'C46',
    moves: 'e4 e5 Nf3 Nc6'
  },
  'r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 4 4': {
    name: 'Four Knights Game',
    eco: 'C47',
    moves: 'e4 e5 Nf3 Nc6 Nc3 Nf6'
  },
  'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 5 4': {
    name: 'Italian Game',
    eco: 'C50',
    moves: 'e4 e5 Nf3 Nc6 Bc4'
  },
  'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 6 5': {
    name: 'Italian Game: Giuoco Piano',
    eco: 'C53',
    moves: 'e4 e5 Nf3 Nc6 Bc4 Bc5'
  },
  'r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3': {
    name: 'Scotch Game',
    eco: 'C45',
    moves: 'e4 e5 Nf3 Nc6 d4'
  },
  'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3': {
    name: 'Ruy Lopez',
    eco: 'C60',
    variation: 'Spanish Opening',
    moves: 'e4 e5 Nf3 Nc6 Bb5'
  },
  'r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4': {
    name: 'Ruy Lopez: Morphy Defense',
    eco: 'C78',
    moves: 'e4 e5 Nf3 Nc6 Bb5 a6'
  },
  
  // Sicilian Defense (B20-B99)
  'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2': {
    name: 'Sicilian Defense',
    eco: 'B20',
    moves: 'e4 c5'
  },
  'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2': {
    name: 'Sicilian Defense: Open',
    eco: 'B20',
    moves: 'e4 c5 Nf3'
  },
  'rnbqkbnr/pp1ppppp/8/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 3': {
    name: 'Sicilian Defense: Open',
    eco: 'B20',
    moves: 'e4 c5 Nf3 d5'
  },
  'rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 4': {
    name: 'Sicilian Defense: Najdorf Variation',
    eco: 'B90',
    moves: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6'
  },
  'rnbqkb1r/pp2pppp/3p1n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 2 5': {
    name: 'Sicilian Defense: Dragon Variation',
    eco: 'B70',
    moves: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6'
  },
  
  // French Defense (C00-C19)
  'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2': {
    name: 'French Defense',
    eco: 'C00',
    moves: 'e4 e6'
  },
  'rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq d3 0 2': {
    name: 'French Defense: Advance Variation',
    eco: 'C02',
    moves: 'e4 e6 d4 d5 e5'
  },
  
  // Caro-Kann Defense (B10-B19)
  'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2': {
    name: 'Caro-Kann Defense',
    eco: 'B10',
    moves: 'e4 c6'
  },
  
  // Pirc Defense (B07-B09)
  'rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2': {
    name: 'Pirc Defense',
    eco: 'B07',
    moves: 'e4 d6'
  },
  
  // Queen's Pawn Openings (D00-D99, A40-A99)
  'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1': {
    name: "Queen's Pawn Opening",
    eco: 'D00',
    moves: 'd4'
  },
  'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6 0 2': {
    name: "Queen's Pawn Game",
    eco: 'D00',
    moves: 'd4 d5'
  },
  'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2': {
    name: "Queen's Gambit",
    eco: 'D06',
    moves: 'd4 d5 c4'
  },
  'rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3': {
    name: "Queen's Gambit Declined",
    eco: 'D30',
    moves: 'd4 d5 c4 e6'
  },
  'rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3': {
    name: "Queen's Gambit Declined: Orthodox Defense",
    eco: 'D63',
    moves: 'd4 d5 c4 e6 Nc3'
  },
  'rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4': {
    name: "Queen's Gambit Declined: Orthodox Defense",
    eco: 'D63',
    moves: 'd4 d5 c4 e6 Nc3 Nf6'
  },
  'rnbqkbnr/ppp1pppp/8/8/2pP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3': {
    name: "Queen's Gambit Accepted",
    eco: 'D20',
    moves: 'd4 d5 c4 dxc4'
  },
  
  // Indian Defenses
  'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2': {
    name: 'Indian Defense',
    eco: 'A45',
    moves: 'd4 Nf6'
  },
  'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2': {
    name: 'Indian Defense',
    eco: 'E00',
    moves: 'd4 Nf6 c4'
  },
  'rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3': {
    name: 'Indian Defense: Nimzo-Indian',
    eco: 'E20',
    moves: 'd4 Nf6 c4 e6'
  },
  'rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4': {
    name: 'Nimzo-Indian Defense',
    eco: 'E20',
    moves: 'd4 Nf6 c4 e6 Nc3 Bb4'
  },
  'rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3': {
    name: "King's Indian Defense",
    eco: 'E60',
    moves: 'd4 Nf6 c4 g6'
  },
  'rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR w KQkq - 0 5': {
    name: "King's Indian Defense: Classical Variation",
    eco: 'E90',
    moves: 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6'
  },
  
  // English Opening (A10-A39)
  'rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1': {
    name: 'English Opening',
    eco: 'A10',
    moves: 'c4'
  },
  'rnbqkbnr/pppp1ppp/8/4p3/2P5/8/PP1PPPPP/RNBQKBNR w KQkq e6 0 2': {
    name: 'English Opening: Symmetrical Variation',
    eco: 'A30',
    moves: 'c4 e5'
  },
  
  // Reti Opening (A04-A09)
  'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1': {
    name: 'Reti Opening',
    eco: 'A04',
    moves: 'Nf3'
  },
  'rnbqkbnr/ppp1pppp/8/3p4/8/5N2/PPPPPPPP/RNBQKB1R w KQkq d6 0 2': {
    name: 'Reti Opening',
    eco: 'A09',
    moves: 'Nf3 d5'
  },
  
  // Other Popular Openings
  'rnbqkbnr/pppppppp/8/8/8/6P1/PPPPPP1P/RNBQKBNR b KQkq - 0 1': {
    name: "King's Fianchetto Opening",
    eco: 'A00',
    moves: 'g3'
  },
  'rnbqkbnr/pppppppp/8/8/8/7P/PPPPPPP1/RNBQKBNR b KQkq - 0 1': {
    name: 'Grob Opening',
    eco: 'A00',
    moves: 'g4'
  },
  'rnbqkbnr/pppppppp/8/8/5P2/8/PPPPP1PP/RNBQKBNR b KQkq f3 0 1': {
    name: "Bird's Opening",
    eco: 'A02',
    moves: 'f4'
  },
  'rnbqkbnr/pppppppp/8/8/1P6/8/P1PPPPPP/RNBQKBNR b KQkq b3 0 1': {
    name: 'Polish Opening',
    eco: 'A00',
    variation: "Sokolsky Opening",
    moves: 'b4'
  }
};

/**
 * Recognize opening from FEN position
 */
export function recognizeOpening(fen: string): OpeningInfo | null {
  return openingDatabase[fen] || null;
}

/**
 * Get opening from move history
 * Tries to match the longest sequence of moves
 */
export function getOpeningFromMoves(moves: string[]): OpeningInfo | null {
  // Try to match from longest to shortest sequence
  for (let i = Math.min(moves.length, 10); i > 0; i--) {
    const moveSequence = moves.slice(0, i).join(' ');
    
    // Find matching opening
    for (const [fen, opening] of Object.entries(openingDatabase)) {
      if (opening.moves === moveSequence) {
        return opening;
      }
    }
  }
  
  return null;
}

/**
 * Check if position is still in opening theory
 * Generally, openings last 10-15 moves
 */
export function isInOpeningPhase(moveNumber: number): boolean {
  return moveNumber <= 15;
}

/**
 * Get opening statistics (placeholder - would need database)
 */
export interface OpeningStats {
  whiteWins: number;
  draws: number;
  blackWins: number;
  popularity: number; // 0-100
  avgRating: number;
}

export function getOpeningStats(eco: string): OpeningStats | null {
  // Placeholder - in production, this would query a database
  // For now, return null or mock data
  return null;
}

/**
 * Get Lichess opening explorer URL
 */
export function getLichessOpeningUrl(fen: string): string {
  const encodedFen = encodeURIComponent(fen);
  return `https://lichess.org/analysis/standard/${encodedFen}`;
}

/**
 * Get Chess.com opening explorer URL
 */
export function getChessComOpeningUrl(fen: string): string {
  const encodedFen = encodeURIComponent(fen);
  return `https://www.chess.com/analysis?fen=${encodedFen}`;
}
