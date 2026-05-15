'use client';

import { MoveAnalysis } from './ChessAnalyzer';

interface EvaluationGraphProps {
  analysis: MoveAnalysis[];
  currentMoveIndex: number;
  onMoveClick: (index: number) => void;
}

export default function EvaluationGraph({ analysis, currentMoveIndex, onMoveClick }: EvaluationGraphProps) {
  if (analysis.length === 0) return null;

  const maxEval = 5; // Cap evaluation at +5/-5 for better visualization
  const graphHeight = 120;
  const graphWidth = Math.max(analysis.length * 8, 400);

  const normalizeEval = (evaluation: number) => {
    const capped = Math.max(-maxEval, Math.min(maxEval, evaluation));
    return ((capped + maxEval) / (maxEval * 2)) * graphHeight;
  };

  const points = analysis.map((move, index) => {
    const x = (index / (analysis.length - 1 || 1)) * graphWidth;
    const y = graphHeight - normalizeEval(move.evaluation);
    return { x, y, index };
  });

  const pathData = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  return (
    <div className="bg-[#262421] rounded-lg p-4">
      <h3 className="text-white font-bold mb-3 text-sm">Evaluation</h3>
      
      <div className="relative bg-[#1a1a1a] rounded overflow-x-auto">
        <svg 
          width={graphWidth} 
          height={graphHeight}
          className="w-full"
          style={{ minWidth: '300px' }}
        >
          {/* Center line (0.0 evaluation) */}
          <line
            x1="0"
            y1={graphHeight / 2}
            x2={graphWidth}
            y2={graphHeight / 2}
            stroke="#3d3d3d"
            strokeWidth="1"
            strokeDasharray="4"
          />
          
          {/* Evaluation path */}
          <path
            d={pathData}
            fill="none"
            stroke="#81b64c"
            strokeWidth="2"
          />
          
          {/* Points */}
          {points.map((point) => {
            const move = analysis[point.index];
            let color = '#81b64c'; // default green
            
            if (move.classification === 'brilliant') color = '#1baca6'; // cyan
            else if (move.classification === 'blunder') color = '#b33430'; // red
            else if (move.classification === 'mistake') color = '#e58f2a'; // orange
            else if (move.classification === 'inaccuracy') color = '#f0c15c'; // yellow
            
            return (
              <circle
                key={point.index}
                cx={point.x}
                cy={point.y}
                r={point.index === currentMoveIndex - 1 ? 5 : 2.5}
                fill={color}
                className="cursor-pointer hover:r-4 transition-all"
                onClick={() => onMoveClick(point.index + 1)}
              />
            );
          })}
        </svg>
        
        {/* Labels */}
        <div className="flex justify-between text-[10px] text-gray-600 mt-1 px-1">
          <span>White winning</span>
          <span>Equal</span>
          <span>Black winning</span>
        </div>
      </div>
    </div>
  );
}
