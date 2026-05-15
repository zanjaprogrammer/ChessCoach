'use client';

import { Chess } from 'chess.js';

interface SimpleChessBoardProps {
  position: string;
}

// Better piece rendering with proper chess font
const ChessPiece = ({ piece, color }: { piece: string; color: string }) => {
  const pieceMap: { [key: string]: string } = {
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙'
  };
  
  const symbol = pieceMap[color === 'w' ? piece.toUpperCase() : piece];
  
  return (
    <div 
      className="text-5xl leading-none select-none"
      style={{
        fontFamily: 'Arial Unicode MS, Lucida Sans Unicode, sans-serif',
        textShadow: color === 'w' 
          ? '0 1px 2px rgba(0,0,0,0.3), 0 0 1px rgba(0,0,0,0.5)' 
          : '0 1px 2px rgba(255,255,255,0.2)',
        filter: color === 'w' ? 'brightness(1.1)' : 'brightness(0.9)',
      }}
    >
      {symbol}
    </div>
  );
};

export default function SimpleChessBoard({ position }: SimpleChessBoardProps) {
  let board;
  
  try {
    const chess = new Chess(position);
    board = chess.board();
  } catch (error) {
    const chess = new Chess();
    board = chess.board();
  }
  
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div className="inline-block rounded-lg overflow-hidden shadow-2xl">
      <div className="grid grid-cols-8 gap-0">
        {ranks.map((rank, rankIndex) => (
          files.map((file, fileIndex) => {
            const square = board[rankIndex][fileIndex];
            const isLight = (rankIndex + fileIndex) % 2 === 0;
            const piece = square ? square.type : null;
            const color = square ? square.color : null;
            
            return (
              <div
                key={`${file}${rank}`}
                className={`w-14 h-14 flex items-center justify-center relative ${
                  isLight ? 'bg-[#eeeed2]' : 'bg-[#769656]'
                }`}
              >
                {piece && color && (
                  <ChessPiece piece={piece} color={color} />
                )}
                
                {/* Coordinates */}
                {fileIndex === 0 && (
                  <span className={`absolute top-0.5 left-1 text-[11px] font-bold ${
                    isLight ? 'text-[#769656]' : 'text-[#eeeed2]'
                  }`}>
                    {rank}
                  </span>
                )}
                {rankIndex === 7 && (
                  <span className={`absolute bottom-0.5 right-1 text-[11px] font-bold ${
                    isLight ? 'text-[#769656]' : 'text-[#eeeed2]'
                  }`}>
                    {file}
                  </span>
                )}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
}
