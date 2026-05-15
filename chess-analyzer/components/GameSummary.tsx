'use client';

import { MoveAnalysis } from './ChessAnalyzer';
import { PlayerProfile } from '@/lib/chessApi';

interface GameSummaryProps {
  analysis: MoveAnalysis[];
  playerProfile?: PlayerProfile | null;
}

export default function GameSummary({ analysis, playerProfile }: GameSummaryProps) {
  if (analysis.length === 0) return null;

  // Split moves by color
  const whiteMoves = analysis.filter((_, i) => i % 2 === 0);
  const blackMoves = analysis.filter((_, i) => i % 2 === 1);

  const calculateAccuracy = (moves: MoveAnalysis[]) => {
    if (moves.length === 0) return 0;
    
    // Chess.com-style accuracy calculation based on Expected Points Loss
    let totalExpectedPointsLoss = 0;
    let moveCount = 0;
    
    moves.forEach(move => {
      if (move.expectedPointsLoss !== undefined) {
        totalExpectedPointsLoss += move.expectedPointsLoss;
        moveCount++;
      }
    });
    
    if (moveCount === 0) return 100;
    
    // Average expected points loss per move
    const avgLoss = totalExpectedPointsLoss / moveCount;
    
    // Convert to accuracy percentage (Chess.com formula)
    // 0% loss = 100% accuracy
    // 5% loss = 95% accuracy
    // 20% loss = 80% accuracy
    const accuracy = Math.max(0, Math.min(100, 100 - (avgLoss * 100)));
    
    return Math.round(accuracy);
  };

  const countByClassification = (moves: MoveAnalysis[], classification: string) => {
    return moves.filter(m => m.classification === classification).length;
  };

  const whiteAccuracy = calculateAccuracy(whiteMoves);
  const blackAccuracy = calculateAccuracy(blackMoves);

  const whiteStats = {
    brilliant: countByClassification(whiteMoves, 'brilliant'),
    great: countByClassification(whiteMoves, 'great'),
    book: countByClassification(whiteMoves, 'book'),
    best: countByClassification(whiteMoves, 'best'),
    excellent: countByClassification(whiteMoves, 'excellent'),
    good: countByClassification(whiteMoves, 'good'),
    inaccuracy: countByClassification(whiteMoves, 'inaccuracy'),
    mistake: countByClassification(whiteMoves, 'mistake'),
    miss: countByClassification(whiteMoves, 'miss'),
    blunder: countByClassification(whiteMoves, 'blunder'),
  };

  const blackStats = {
    brilliant: countByClassification(blackMoves, 'brilliant'),
    great: countByClassification(blackMoves, 'great'),
    book: countByClassification(blackMoves, 'book'),
    best: countByClassification(blackMoves, 'best'),
    excellent: countByClassification(blackMoves, 'excellent'),
    good: countByClassification(blackMoves, 'good'),
    inaccuracy: countByClassification(blackMoves, 'inaccuracy'),
    mistake: countByClassification(blackMoves, 'mistake'),
    miss: countByClassification(blackMoves, 'miss'),
    blunder: countByClassification(blackMoves, 'blunder'),
  };

  return (
    <div className="bg-[#262421] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-white font-bold text-lg">Game Summary</h3>
          {playerProfile && (
            <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1 rounded">
              <span className="text-gray-400 text-xs">Player:</span>
              <span className="text-[#81b64c] font-bold text-sm">{playerProfile.username}</span>
              <span className="text-gray-500 text-xs">({playerProfile.rating})</span>
            </div>
          )}
        </div>
        <span className="text-gray-500 text-xs">Chess.com-style Expected Points Model</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* White Player */}
        <div className="bg-[#1a1a1a] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-bold text-sm">White</h4>
            <div className="text-2xl font-bold text-white">{whiteAccuracy}%</div>
          </div>
          
          <div className="w-full bg-[#3d3d3d] rounded-full h-1.5 mb-3">
            <div
              className="bg-[#81b64c] h-1.5 rounded-full transition-all"
              style={{ width: `${whiteAccuracy}%` }}
            />
          </div>
          
          <div className="space-y-1 text-xs">
            {whiteStats.brilliant > 0 && (
              <div className="flex justify-between text-[#1baca6]">
                <span>!! Brilliant</span>
                <span>{whiteStats.brilliant}</span>
              </div>
            )}
            {whiteStats.great > 0 && (
              <div className="flex justify-between text-[#5c9fc8]">
                <span>! Great</span>
                <span>{whiteStats.great}</span>
              </div>
            )}
            {whiteStats.book > 0 && (
              <div className="flex justify-between text-[#a88865]">
                <span>📚 Book</span>
                <span>{whiteStats.book}</span>
              </div>
            )}
            {whiteStats.best > 0 && (
              <div className="flex justify-between text-[#96bc4b]">
                <span>★ Best</span>
                <span>{whiteStats.best}</span>
              </div>
            )}
            {whiteStats.excellent > 0 && (
              <div className="flex justify-between text-[#96af8b]">
                <span>✓+ Excellent</span>
                <span>{whiteStats.excellent}</span>
              </div>
            )}
            {whiteStats.inaccuracy > 0 && (
              <div className="flex justify-between text-[#f0c15c]">
                <span>?! Inaccuracy</span>
                <span>{whiteStats.inaccuracy}</span>
              </div>
            )}
            {whiteStats.mistake > 0 && (
              <div className="flex justify-between text-[#e58f2a]">
                <span>? Mistake</span>
                <span>{whiteStats.mistake}</span>
              </div>
            )}
            {whiteStats.miss > 0 && (
              <div className="flex justify-between text-[#e07c3e]">
                <span>✗ Miss</span>
                <span>{whiteStats.miss}</span>
              </div>
            )}
            {whiteStats.blunder > 0 && (
              <div className="flex justify-between text-[#b33430]">
                <span>?? Blunder</span>
                <span>{whiteStats.blunder}</span>
              </div>
            )}
          </div>
        </div>

        {/* Black Player */}
        <div className="bg-[#1a1a1a] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-bold text-sm">Black</h4>
            <div className="text-2xl font-bold text-white">{blackAccuracy}%</div>
          </div>
          
          <div className="w-full bg-[#3d3d3d] rounded-full h-1.5 mb-3">
            <div
              className="bg-[#81b64c] h-1.5 rounded-full transition-all"
              style={{ width: `${blackAccuracy}%` }}
            />
          </div>
          
          <div className="space-y-1 text-xs">
            {blackStats.brilliant > 0 && (
              <div className="flex justify-between text-[#1baca6]">
                <span>!! Brilliant</span>
                <span>{blackStats.brilliant}</span>
              </div>
            )}
            {blackStats.great > 0 && (
              <div className="flex justify-between text-[#5c9fc8]">
                <span>! Great</span>
                <span>{blackStats.great}</span>
              </div>
            )}
            {blackStats.book > 0 && (
              <div className="flex justify-between text-[#a88865]">
                <span>📚 Book</span>
                <span>{blackStats.book}</span>
              </div>
            )}
            {blackStats.best > 0 && (
              <div className="flex justify-between text-[#96bc4b]">
                <span>★ Best</span>
                <span>{blackStats.best}</span>
              </div>
            )}
            {blackStats.excellent > 0 && (
              <div className="flex justify-between text-[#96af8b]">
                <span>✓+ Excellent</span>
                <span>{blackStats.excellent}</span>
              </div>
            )}
            {blackStats.inaccuracy > 0 && (
              <div className="flex justify-between text-[#f0c15c]">
                <span>?! Inaccuracy</span>
                <span>{blackStats.inaccuracy}</span>
              </div>
            )}
            {blackStats.mistake > 0 && (
              <div className="flex justify-between text-[#e58f2a]">
                <span>? Mistake</span>
                <span>{blackStats.mistake}</span>
              </div>
            )}
            {blackStats.miss > 0 && (
              <div className="flex justify-between text-[#e07c3e]">
                <span>✗ Miss</span>
                <span>{blackStats.miss}</span>
              </div>
            )}
            {blackStats.blunder > 0 && (
              <div className="flex justify-between text-[#b33430]">
                <span>?? Blunder</span>
                <span>{blackStats.blunder}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
