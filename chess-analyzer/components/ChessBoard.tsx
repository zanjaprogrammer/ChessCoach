'use client';

import { useEffect, useState } from 'react';
import SimpleChessBoard from './SimpleChessBoard';
import EvaluationBar from './EvaluationBar';
import { Chess } from 'chess.js';

interface ChessBoardProps {
  game: Chess | null;
  currentMoveIndex: number;
  onMoveChange: (index: number) => void;
  currentEvaluation?: number;
}

export default function ChessBoard({ game, currentMoveIndex, onMoveChange, currentEvaluation = 0 }: ChessBoardProps) {
  const [position, setPosition] = useState('start');
  const [moves, setMoves] = useState<string[]>([]);

  useEffect(() => {
    if (!game) {
      setPosition('start');
      setMoves([]);
      return;
    }

    const history = game.history();
    setMoves(history);

    // Recreate position up to currentMoveIndex
    const tempGame = new Chess();
    for (let i = 0; i < currentMoveIndex; i++) {
      tempGame.move(history[i]);
    }
    setPosition(tempGame.fen());
  }, [game, currentMoveIndex]);

  const handlePrevious = () => {
    if (currentMoveIndex > 0) {
      onMoveChange(currentMoveIndex - 1);
    }
  };

  const handleNext = () => {
    if (game && currentMoveIndex < moves.length) {
      onMoveChange(currentMoveIndex + 1);
    }
  };

  const handleFirst = () => {
    onMoveChange(0);
  };

  const handleLast = () => {
    if (game) {
      onMoveChange(moves.length);
    }
  };

  return (
    <div className="bg-[#262421] rounded-lg p-4">
      {/* Board with Evaluation Bar */}
      <div className="flex gap-2 mb-4">
        {/* Evaluation Bar */}
        <div className="h-[400px]">
          <EvaluationBar evaluation={currentEvaluation} />
        </div>
        
        {/* Chess Board */}
        <div className="flex-1 flex justify-center">
          <SimpleChessBoard position={position} />
        </div>
      </div>

      {/* Controls */}
      {game && (
        <div className="space-y-3">
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={handleFirst}
              disabled={currentMoveIndex === 0}
              className="bg-[#81b64c] hover:bg-[#72a642] disabled:bg-[#3d3d3d] disabled:text-gray-600 text-white font-bold py-2 px-4 rounded transition-all"
            >
              ⏮️
            </button>
            <button
              onClick={handlePrevious}
              disabled={currentMoveIndex === 0}
              className="bg-[#81b64c] hover:bg-[#72a642] disabled:bg-[#3d3d3d] disabled:text-gray-600 text-white font-bold py-2 px-4 rounded transition-all"
            >
              ◀️
            </button>
            <button
              onClick={handleNext}
              disabled={currentMoveIndex >= moves.length}
              className="bg-[#81b64c] hover:bg-[#72a642] disabled:bg-[#3d3d3d] disabled:text-gray-600 text-white font-bold py-2 px-4 rounded transition-all"
            >
              ▶️
            </button>
            <button
              onClick={handleLast}
              disabled={currentMoveIndex >= moves.length}
              className="bg-[#81b64c] hover:bg-[#72a642] disabled:bg-[#3d3d3d] disabled:text-gray-600 text-white font-bold py-2 px-4 rounded transition-all"
            >
              ⏭️
            </button>
          </div>

          {/* Move counter */}
          <div className="text-center text-gray-400 text-sm">
            Move {currentMoveIndex} / {moves.length}
          </div>
        </div>
      )}

      {!game && (
        <div className="text-center text-gray-400 py-8">
          <p className="text-lg">Upload PGN untuk memulai</p>
        </div>
      )}
    </div>
  );
}
