'use client';

interface EvaluationBarProps {
  evaluation: number;
  mate?: number;
}

export default function EvaluationBar({ evaluation, mate }: EvaluationBarProps) {
  // Normalize evaluation to percentage (cap at +10/-10)
  const maxEval = 10;
  const cappedEval = Math.max(-maxEval, Math.min(maxEval, evaluation));
  const whitePercentage = ((cappedEval + maxEval) / (maxEval * 2)) * 100;

  return (
    <div className="flex flex-col h-full w-12 bg-[#262421] rounded-lg overflow-hidden">
      {/* White advantage (top) */}
      <div 
        className="bg-white transition-all duration-300 flex items-end justify-center"
        style={{ height: `${whitePercentage}%` }}
      >
        {whitePercentage > 15 && (
          <span className="text-black text-xs font-bold mb-1">
            {mate ? `M${mate}` : evaluation > 0 ? `+${evaluation.toFixed(1)}` : ''}
          </span>
        )}
      </div>
      
      {/* Black advantage (bottom) */}
      <div 
        className="bg-[#262421] transition-all duration-300 flex items-start justify-center"
        style={{ height: `${100 - whitePercentage}%` }}
      >
        {whitePercentage < 85 && (
          <span className="text-white text-xs font-bold mt-1">
            {mate ? `M${-mate}` : evaluation < 0 ? evaluation.toFixed(1) : ''}
          </span>
        )}
      </div>
    </div>
  );
}
