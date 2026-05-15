// Expected Points Model - Convert engine evaluation to win probability
// Based on Chess.com's Classification V2 system

export interface ExpectedPointsResult {
  winProbability: number;
  expectedPoints: number;
}

/**
 * Convert centipawn evaluation to win probability
 * Formula: 1 / (1 + 10^(-eval/4))
 * 
 * @param evaluation - Centipawn evaluation (e.g., 100 = +1.00 pawn advantage)
 * @returns Win probability between 0 and 1
 */
export function evaluationToWinProbability(evaluation: number): number {
  // Convert centipawns to pawns
  const evalInPawns = evaluation / 100;
  
  // Apply sigmoid-like function
  // Formula from chess engines: 1 / (1 + 10^(-eval/4))
  const winProb = 1 / (1 + Math.pow(10, -evalInPawns / 4));
  
  return Math.max(0, Math.min(1, winProb));
}

/**
 * Calculate expected points (win probability) for a position
 * 
 * @param evaluation - Engine evaluation in centipawns
 * @returns Expected points result
 */
export function calculateExpectedPoints(evaluation: number): ExpectedPointsResult {
  const winProbability = evaluationToWinProbability(evaluation);
  
  return {
    winProbability,
    expectedPoints: winProbability
  };
}

/**
 * Calculate expected points loss after a move
 * 
 * @param previousEval - Evaluation before the move
 * @param currentEval - Evaluation after the move
 * @param isWhite - Is it white's move?
 * @returns Expected points lost (0 to 1)
 */
export function calculateExpectedPointsLoss(
  previousEval: number,
  currentEval: number,
  isWhite: boolean
): number {
  // Adjust evaluation based on whose turn it is
  const prevWinProb = evaluationToWinProbability(isWhite ? previousEval : -previousEval);
  const currWinProb = evaluationToWinProbability(isWhite ? currentEval : -currentEval);
  
  // Expected points loss (always positive)
  const loss = Math.max(0, prevWinProb - currWinProb);
  
  return loss;
}

/**
 * Classify move based on expected points loss
 * Thresholds based on Chess.com's system
 * 
 * @param expectedPointsLoss - Loss in expected points (0 to 1)
 * @param playerRating - Player's Elo rating (optional, for adjustment)
 * @returns Move classification
 */
export function classifyMoveByExpectedPoints(
  expectedPointsLoss: number,
  playerRating?: number
): 'brilliant' | 'great' | 'best' | 'excellent' | 'good' | 'book' | 'inaccuracy' | 'mistake' | 'miss' | 'blunder' {
  // Adjust thresholds based on player rating
  // Higher rated players have stricter standards
  const ratingFactor = playerRating ? Math.max(0.7, Math.min(1.3, 1 - (playerRating - 1500) / 3000)) : 1.0;
  
  // Chess.com-style thresholds (approximate)
  if (expectedPointsLoss >= 0.20 * ratingFactor) {
    return 'blunder';      // ~20%+ win chance lost
  } else if (expectedPointsLoss >= 0.10 * ratingFactor) {
    return 'mistake';      // ~10-20% win chance lost
  } else if (expectedPointsLoss >= 0.05 * ratingFactor) {
    return 'inaccuracy';   // ~5-10% win chance lost
  } else if (expectedPointsLoss >= 0.02) {
    return 'good';         // ~2-5% win chance lost
  } else if (expectedPointsLoss >= 0.01) {
    return 'excellent';    // ~1-2% win chance lost
  } else if (expectedPointsLoss < 0.01) {
    return 'best';         // <1% win chance lost
  }
  
  return 'good';
}

/**
 * Check if move is a "Miss" (missed opportunity/tactic)
 * Miss = there was a much better move available (significant improvement possible)
 * 
 * @param playedMoveEval - Evaluation after played move
 * @param bestMoveEval - Evaluation after best move
 * @param isWhite - Is it white's move?
 * @returns True if move is a "Miss"
 */
export function isMissedOpportunity(
  playedMoveEval: number,
  bestMoveEval: number,
  isWhite: boolean
): boolean {
  // Calculate how much better the best move would have been
  const improvement = isWhite 
    ? (bestMoveEval - playedMoveEval) * 100  // White wants higher eval
    : (playedMoveEval - bestMoveEval) * 100; // Black wants lower eval
  
  // Miss criteria:
  // 1. Best move is significantly better (>200 cp = 2 pawns)
  // 2. But played move is not a mistake/blunder (small loss)
  // 3. Missed a winning tactic or strong continuation
  
  return improvement > 200; // Missed a move that was 2+ pawns better
}

/**
 * Check if move qualifies as "Great" (strong move without being best)
 * 
 * @param expectedPointsLoss - Loss in expected points
 * @param evaluation - Current evaluation
 * @returns True if move is "Great"
 */
export function isGreatMove(expectedPointsLoss: number, evaluation: number): boolean {
  // Great move: very small loss (<1%) and position is good
  return expectedPointsLoss < 0.01 && Math.abs(evaluation) < 300;
}

/**
 * Check if move qualifies as "Brilliant" (sacrifice + best move)
 * Note: This is simplified - Chess.com uses more complex logic
 * 
 * @param expectedPointsLoss - Loss in expected points
 * @param evaluation - Current evaluation
 * @param previousEval - Previous evaluation
 * @returns True if move is potentially "Brilliant"
 */
export function isBrilliantMove(
  expectedPointsLoss: number,
  evaluation: number,
  previousEval: number
): boolean {
  // Brilliant criteria (simplified):
  // 1. Very small loss (<0.5%)
  // 2. Significant improvement in position (>1.5 pawns)
  // 3. Position remains good (not losing)
  
  const improvement = evaluation - previousEval;
  const isGoodPosition = evaluation > -100; // Not losing badly
  const isSignificantImprovement = improvement > 150; // >1.5 pawns
  const isMinimalLoss = expectedPointsLoss < 0.005;
  
  return isMinimalLoss && isSignificantImprovement && isGoodPosition;
}

/**
 * Get human-readable description of win probability
 * 
 * @param winProbability - Win probability (0 to 1)
 * @returns Description string
 */
export function getWinProbabilityDescription(winProbability: number): string {
  if (winProbability >= 0.95) return 'Winning';
  if (winProbability >= 0.75) return 'Much better';
  if (winProbability >= 0.60) return 'Better';
  if (winProbability >= 0.55) return 'Slightly better';
  if (winProbability >= 0.45) return 'Equal';
  if (winProbability >= 0.40) return 'Slightly worse';
  if (winProbability >= 0.25) return 'Worse';
  if (winProbability >= 0.05) return 'Much worse';
  return 'Losing';
}
