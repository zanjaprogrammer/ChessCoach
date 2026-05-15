'use client';

import { useState } from 'react';
import PGNUploader from './PGNUploader';
import ChessBoard from './ChessBoard';
import AnalysisPanel from './AnalysisPanel';
import EvaluationGraph from './EvaluationGraph';
import GameSummary from './GameSummary';
import PlayerRatingInput from './PlayerRatingInput';
import { Chess } from 'chess.js';
import { stockfishEngine } from '@/lib/stockfish';
import { aiExplainer } from '@/lib/aiExplainer';
import { PlayerProfile, GameData } from '@/lib/chessApi';

export interface MoveAnalysis {
  moveNumber: number;
  move: string;
  fen: string;
  evaluation: number;
  bestMove?: string;
  bestMoveEvaluation?: number;
  classification?: 'brilliant' | 'great' | 'best' | 'excellent' | 'good' | 'book' | 'inaccuracy' | 'mistake' | 'miss' | 'blunder';
  explanation?: string;
  expectedPointsLoss?: number;
  winProbability?: number;
}

export default function ChessAnalyzer() {
  const [game, setGame] = useState<Chess | null>(null);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [analysis, setAnalysis] = useState<MoveAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);

  const handlePGNLoad = (pgn: string) => {
    try {
      const chess = new Chess();
      chess.loadPgn(pgn);
      setGame(chess);
      setCurrentMoveIndex(chess.history().length);
      setAnalysis([]);
    } catch (error) {
      alert('PGN tidak valid. Silakan coba lagi.');
      console.error('Error loading PGN:', error);
    }
  };

  const handleMoveChange = (index: number) => {
    setCurrentMoveIndex(index);
  };

  const handleProfileLoad = (profile: PlayerProfile | null) => {
    setPlayerProfile(profile);
  };

  const handleGameSelect = (pgn: string, gameData: GameData) => {
    // Load the selected game
    handlePGNLoad(pgn);
    
    // Show game info
    console.log('Selected game:', gameData);
  };

  const handleAnalyze = async () => {
    if (!game) return;
    
    setIsAnalyzing(true);
    setAnalysis([]);
    setAnalysisProgress(0);
    
    try {
      // Test Ollama connection
      await aiExplainer.testConnection();
      
      // Initialize Stockfish
      console.log('Initializing Stockfish...');
      await stockfishEngine.initialize();
      console.log('Stockfish ready!');
      
      const results: MoveAnalysis[] = [];
      const history = game.history();
      const tempGame = new Chess();
      let previousEval = 0;
      
      // Analyze each move
      for (let i = 0; i < history.length; i++) {
        const move = history[i];
        const isWhite = i % 2 === 0;
        
        // Make the move
        tempGame.move(move);
        
        // Get engine analysis (depth 14 like Chessigma for balance)
        console.log(`Analyzing move ${i + 1}/${history.length}: ${move}`);
        const analysis = await stockfishEngine.analyzePosition(tempGame.fen(), 14);
        
        // Get best move evaluation (for Miss detection)
        let bestMoveEval = analysis.evaluation;
        if (analysis.bestMove && analysis.bestMove !== move) {
          // Make best move to get its evaluation
          const testGame = new Chess(tempGame.fen());
          testGame.undo(); // Undo played move
          try {
            testGame.move(analysis.bestMove);
            const bestAnalysis = await stockfishEngine.analyzePosition(testGame.fen(), 10);
            bestMoveEval = bestAnalysis.evaluation;
          } catch (err) {
            console.error('Error analyzing best move:', err);
          }
        }
        
        // Get AI explanation with player rating
        const explanation = await aiExplainer.generateExplanation({
          move,
          evaluation: analysis.evaluation,
          previousEvaluation: previousEval,
          bestMove: analysis.bestMove,
          bestMoveEvaluation: bestMoveEval,
          position: tempGame.fen(),
          moveNumber: Math.floor(i / 2) + 1,
          isWhite,
          playerRating: playerProfile?.rating
        });
        
        results.push({
          moveNumber: Math.floor(i / 2) + 1,
          move,
          fen: tempGame.fen(),
          evaluation: analysis.evaluation,
          bestMove: analysis.bestMove,
          bestMoveEvaluation: bestMoveEval,
          classification: explanation.classification,
          explanation: explanation.explanation,
          expectedPointsLoss: explanation.expectedPointsLoss,
          winProbability: explanation.winProbability
        });
        
        previousEval = analysis.evaluation;
        
        // Update UI with progress
        setAnalysis([...results]);
        setAnalysisProgress(((i + 1) / history.length) * 100);
      }
      
      console.log('Analysis complete!');
      
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Terjadi kesalahan saat analisis. Pastikan Stockfish tersedia.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      stockfishEngine.quit();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Top Section - Game Summary (only show after analysis) */}
      {analysis.length > 0 && (
        <div className="mb-6">
          <GameSummary analysis={analysis} playerProfile={playerProfile} />
        </div>
      )}
      
      {/* Main Layout - Horizontal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Sidebar - Upload & Controls */}
        <div className="lg:col-span-3 space-y-4">
          {/* Player Rating Input */}
          <PlayerRatingInput 
            onProfileLoad={handleProfileLoad}
            onGameSelect={handleGameSelect}
          />
          
          <PGNUploader onPGNLoad={handlePGNLoad} />
          
          {game && (
            <div className="bg-[#262421] rounded-lg p-4">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-[#81b64c] hover:bg-[#72a642] disabled:bg-[#3d3d3d] text-white font-bold py-3 px-4 rounded-lg transition-all"
              >
                {isAnalyzing ? `Analyzing... ${Math.round(analysisProgress)}%` : '🔍 Analyze Game'}
              </button>
              
              {isAnalyzing && (
                <div className="mt-3">
                  <div className="w-full bg-[#3d3d3d] rounded-full h-2">
                    <div
                      className="bg-[#81b64c] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-4 text-gray-400 text-sm space-y-1">
                <p>Moves: {game.history().length}</p>
                <p>Current: {currentMoveIndex}</p>
                {analysis.length > 0 && (
                  <p className="text-[#81b64c]">✓ {analysis.length} analyzed</p>
                )}
                {playerProfile && (
                  <p className="text-[#81b64c]">
                    👤 {playerProfile.rating} rated
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* Evaluation Graph */}
          {analysis.length > 0 && (
            <div className="hidden lg:block">
              <EvaluationGraph 
                analysis={analysis} 
                currentMoveIndex={currentMoveIndex}
                onMoveClick={handleMoveChange}
              />
            </div>
          )}
        </div>

        {/* Center - Chess Board */}
        <div className="lg:col-span-6">
          <ChessBoard 
            game={game}
            currentMoveIndex={currentMoveIndex}
            onMoveChange={handleMoveChange}
            currentEvaluation={analysis[currentMoveIndex - 1]?.evaluation || 0}
          />
        </div>

        {/* Right Sidebar - Analysis */}
        <div className="lg:col-span-3">
          <AnalysisPanel 
            analysis={analysis}
            currentMoveIndex={currentMoveIndex}
          />
        </div>
      </div>
    </div>
  );
}
