'use client';

import { MoveAnalysis } from './ChessAnalyzer';
import { getLichessOpeningUrl, getChessComOpeningUrl } from '@/lib/openings';

interface AnalysisPanelProps {
  analysis: MoveAnalysis[];
  currentMoveIndex: number;
}

export default function AnalysisPanel({ analysis, currentMoveIndex }: AnalysisPanelProps) {
  const currentAnalysis = analysis[currentMoveIndex - 1];

  const getClassificationColor = (classification?: string) => {
    switch (classification) {
      case 'brilliant':
        return 'bg-[#1baca6]';
      case 'great':
        return 'bg-[#5c9fc8]';
      case 'best':
        return 'bg-[#96bc4b]';
      case 'excellent':
        return 'bg-[#96af8b]';
      case 'good':
        return 'bg-[#96bc4b]';
      case 'book':
        return 'bg-[#a88865]';
      case 'inaccuracy':
        return 'bg-[#f0c15c]';
      case 'mistake':
        return 'bg-[#e58f2a]';
      case 'miss':
        return 'bg-[#e07c3e]';
      case 'blunder':
        return 'bg-[#b33430]';
      default:
        return 'bg-[#3d3d3d]';
    }
  };

  const getClassificationEmoji = (classification?: string) => {
    switch (classification) {
      case 'brilliant':
        return '!!';
      case 'great':
        return '!';
      case 'best':
        return '★';
      case 'excellent':
        return '✓+';
      case 'good':
        return '✓';
      case 'book':
        return '📚';
      case 'inaccuracy':
        return '?!';
      case 'mistake':
        return '?';
      case 'miss':
        return '✗';
      case 'blunder':
        return '??';
      default:
        return '';
    }
  };

  return (
    <div className="bg-[#262421] rounded-lg p-4 h-full">
      <h2 className="text-white font-bold mb-2 text-sm">🤖 Analysis</h2>
      <p className="text-gray-500 text-xs mb-3">
        Based on Stockfish depth 14 & Expected Points Model
      </p>

      {analysis.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-400 text-sm">No analysis yet</p>
          <p className="text-gray-600 text-xs mt-1">
            Click "Analyze Game" to start
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Current Move Analysis */}
          {currentAnalysis && (
            <div className="bg-[#1a1a1a] rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-bold text-sm">
                  Move {currentAnalysis.moveNumber}: {currentAnalysis.move}
                </h3>
                {currentAnalysis.classification && (
                  <span
                    className={`${getClassificationColor(
                      currentAnalysis.classification
                    )} text-white px-2 py-0.5 rounded text-xs font-bold`}
                  >
                    {getClassificationEmoji(currentAnalysis.classification)}
                  </span>
                )}
              </div>

              {/* Evaluation */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400">Evaluation</span>
                  <span className="text-white font-mono font-bold">
                    {currentAnalysis.evaluation > 0 ? '+' : ''}
                    {currentAnalysis.evaluation.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Expected Points Loss & Win Probability */}
              {currentMoveIndex > 1 && (
                <div className="bg-[#262421] rounded p-2 mb-2 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-400 text-xs">Expected Points Loss:</p>
                    <p className="text-[#e58f2a] font-bold font-mono text-sm">
                      {currentAnalysis.expectedPointsLoss !== undefined
                        ? `${(currentAnalysis.expectedPointsLoss * 100).toFixed(1)}%`
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-400 text-xs">Win Probability:</p>
                    <p className="text-[#81b64c] font-bold font-mono text-sm">
                      {currentAnalysis.winProbability !== undefined
                        ? `${(currentAnalysis.winProbability * 100).toFixed(1)}%`
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-[#3d3d3d]">
                    <p className="text-gray-400 text-xs">Centipawn Loss:</p>
                    <p className="text-gray-500 font-mono text-xs">
                      {(() => {
                        const prevAnalysis = analysis[currentMoveIndex - 2];
                        if (prevAnalysis) {
                          const loss = Math.abs(currentAnalysis.evaluation - prevAnalysis.evaluation) * 100;
                          return `${Math.round(loss)} cp`;
                        }
                        return '0 cp';
                      })()}
                    </p>
                  </div>
                </div>
              )}

              {/* Best Move */}
              {currentAnalysis.bestMove && (
                <div className="bg-[#262421] rounded p-2 mb-2">
                  <p className="text-gray-400 text-xs">Best Move:</p>
                  <p className="text-[#81b64c] font-bold font-mono text-sm">
                    {currentAnalysis.bestMove}
                  </p>
                </div>
              )}

              {/* AI Explanation */}
              {currentAnalysis.explanation && (
                <div className="bg-[#2a2520] rounded p-3 border border-[#3d3d3d]">
                  <p className="text-[#81b64c] text-xs font-bold mb-1">
                    💬 Coach:
                  </p>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {currentAnalysis.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
