'use client';

import { useState, useEffect } from 'react';
import { fetchPlayerProfile, fetchChessComRecentGames, fetchLichessRecentGames, PlayerProfile, GameData } from '@/lib/chessApi';

interface PlayerRatingInputProps {
  onProfileLoad: (profile: PlayerProfile) => void;
  onGameSelect: (pgn: string, gameData: GameData) => void;
}

export default function PlayerRatingInput({ onProfileLoad, onGameSelect }: PlayerRatingInputProps) {
  const [username, setUsername] = useState('');
  const [platform, setPlatform] = useState<'chess.com' | 'lichess' | 'auto'>('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [recentGames, setRecentGames] = useState<GameData[]>([]);
  const [showGames, setShowGames] = useState(false);

  const handleFetchProfile = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fetchedProfile = await fetchPlayerProfile(
        username.trim(),
        platform === 'auto' ? undefined : platform
      );

      if (fetchedProfile) {
        setProfile(fetchedProfile);
        onProfileLoad(fetchedProfile);
        
        // Cache to localStorage
        localStorage.setItem('blunderlens_player_profile', JSON.stringify(fetchedProfile));
        localStorage.setItem('blunderlens_player_username', username.trim());
        
        // Auto-fetch recent games
        await handleFetchRecentGames(fetchedProfile);
      } else {
        setError('Player not found. Check username and platform.');
      }
    } catch (err) {
      setError('Failed to fetch player data. Please try again.');
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchRecentGames = async (profileData?: PlayerProfile) => {
    const targetProfile = profileData || profile;
    if (!targetProfile) return;

    setIsLoadingGames(true);
    try {
      let games: GameData[] = [];
      
      if (targetProfile.platform === 'chess.com') {
        games = await fetchChessComRecentGames(targetProfile.username, 10);
      } else if (targetProfile.platform === 'lichess') {
        games = await fetchLichessRecentGames(targetProfile.username, 10);
      }
      
      setRecentGames(games);
      setShowGames(true);
      
      // Cache games
      localStorage.setItem('blunderlens_recent_games', JSON.stringify(games));
    } catch (err) {
      console.error('Error fetching recent games:', err);
      setError('Failed to fetch recent games');
    } finally {
      setIsLoadingGames(false);
    }
  };

  const handleClearProfile = () => {
    setProfile(null);
    setUsername('');
    setError(null);
    setRecentGames([]);
    setShowGames(false);
    localStorage.removeItem('blunderlens_player_profile');
    localStorage.removeItem('blunderlens_player_username');
    localStorage.removeItem('blunderlens_recent_games');
    onProfileLoad(null as any);
  };

  const handleSelectGame = (game: GameData) => {
    onGameSelect(game.pgn, game);
    setShowGames(false);
  };

  const getTimeControlDisplay = (timeControl: string): string => {
    // Chess.com format: "600" or "600+5"
    // Lichess format: "blitz", "rapid", "bullet", "classical"
    
    if (timeControl.includes('+')) {
      const [base, increment] = timeControl.split('+');
      const baseMin = Math.floor(parseInt(base) / 60);
      return `${baseMin}+${increment}`;
    } else if (!isNaN(parseInt(timeControl))) {
      const baseMin = Math.floor(parseInt(timeControl) / 60);
      return `${baseMin} min`;
    }
    
    // Lichess format
    return timeControl.charAt(0).toUpperCase() + timeControl.slice(1);
  };

  const getTimeControlType = (timeControl: string): string => {
    if (timeControl.includes('bullet') || parseInt(timeControl) < 180) {
      return '⚡ Bullet';
    } else if (timeControl.includes('blitz') || parseInt(timeControl) < 600) {
      return '⚡ Blitz';
    } else if (timeControl.includes('rapid') || parseInt(timeControl) < 1800) {
      return '🕐 Rapid';
    } else {
      return '🕐 Classical';
    }
  };

  const getResultColor = (result: string, isWhite: boolean): string => {
    if (result === '1-0') return isWhite ? 'text-[#81b64c]' : 'text-[#b33430]';
    if (result === '0-1') return isWhite ? 'text-[#b33430]' : 'text-[#81b64c]';
    return 'text-gray-400';
  };

  const getResultText = (result: string, isWhite: boolean): string => {
    if (result === '1-0') return isWhite ? 'Win' : 'Loss';
    if (result === '0-1') return isWhite ? 'Loss' : 'Win';
    return 'Draw';
  };

  // Load cached profile on mount
  useEffect(() => {
    const cachedProfile = localStorage.getItem('blunderlens_player_profile');
    const cachedUsername = localStorage.getItem('blunderlens_player_username');
    const cachedGames = localStorage.getItem('blunderlens_recent_games');
    
    if (cachedProfile && cachedUsername) {
      try {
        const parsed = JSON.parse(cachedProfile);
        setProfile(parsed);
        setUsername(cachedUsername);
        onProfileLoad(parsed);
        
        if (cachedGames) {
          const parsedGames = JSON.parse(cachedGames);
          setRecentGames(parsedGames);
        }
      } catch (err) {
        console.error('Error loading cached data:', err);
      }
    }
  }, []);

  return (
    <div className="bg-[#262421] rounded-lg p-4">
      <h3 className="text-white font-bold text-sm mb-3">👤 Player Profile</h3>
      
      {!profile ? (
        <div className="space-y-3">
          {/* Username Input */}
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleFetchProfile()}
              placeholder="Enter username..."
              className="w-full bg-[#1a1a1a] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#81b64c]"
              disabled={isLoading}
            />
          </div>

          {/* Platform Selection */}
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Platform</label>
            <div className="flex gap-2">
              <button
                onClick={() => setPlatform('auto')}
                className={`flex-1 py-2 px-3 rounded text-xs font-bold transition-all ${
                  platform === 'auto'
                    ? 'bg-[#81b64c] text-white'
                    : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]'
                }`}
                disabled={isLoading}
              >
                Auto
              </button>
              <button
                onClick={() => setPlatform('chess.com')}
                className={`flex-1 py-2 px-3 rounded text-xs font-bold transition-all ${
                  platform === 'chess.com'
                    ? 'bg-[#81b64c] text-white'
                    : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]'
                }`}
                disabled={isLoading}
              >
                Chess.com
              </button>
              <button
                onClick={() => setPlatform('lichess')}
                className={`flex-1 py-2 px-3 rounded text-xs font-bold transition-all ${
                  platform === 'lichess'
                    ? 'bg-[#81b64c] text-white'
                    : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]'
                }`}
                disabled={isLoading}
              >
                Lichess
              </button>
            </div>
          </div>

          {/* Fetch Button */}
          <button
            onClick={handleFetchProfile}
            disabled={isLoading || !username.trim()}
            className="w-full bg-[#81b64c] hover:bg-[#72a642] disabled:bg-[#3d3d3d] text-white font-bold py-2 px-4 rounded transition-all text-sm"
          >
            {isLoading ? 'Loading...' : '🔍 Fetch Profile & Games'}
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-[#b33430] bg-opacity-20 border border-[#b33430] rounded p-2">
              <p className="text-[#ff6b6b] text-xs">{error}</p>
            </div>
          )}

          {/* Info */}
          <p className="text-gray-500 text-xs">
            💡 Load your profile + recent games for quick analysis
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Profile Display */}
          <div className="bg-[#1a1a1a] rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {profile.avatar && (
                  <img
                    src={profile.avatar}
                    alt={profile.username}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-white font-bold text-sm">
                      {profile.username}
                    </span>
                    {profile.title && (
                      <span className="bg-[#81b64c] text-white text-xs px-1 rounded font-bold">
                        {profile.title}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-400 text-xs capitalize">
                    {profile.platform}
                  </span>
                </div>
              </div>
              <button
                onClick={handleClearProfile}
                className="text-gray-400 hover:text-white text-xs"
                title="Clear profile"
              >
                ✕
              </button>
            </div>

            {/* Rating Badge */}
            <div className="flex items-center justify-between bg-[#262421] rounded p-2">
              <span className="text-gray-400 text-xs">Rating</span>
              <span className="text-[#81b64c] font-bold text-lg font-mono">
                {profile.rating}
              </span>
            </div>
          </div>

          {/* Recent Games Button */}
          <button
            onClick={() => setShowGames(!showGames)}
            disabled={isLoadingGames}
            className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-bold py-2 px-4 rounded transition-all text-sm flex items-center justify-between"
          >
            <span>📋 Recent Games ({recentGames.length})</span>
            <span>{showGames ? '▼' : '▶'}</span>
          </button>

          {/* Recent Games List */}
          {showGames && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {isLoadingGames ? (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-xs">Loading games...</p>
                </div>
              ) : recentGames.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-xs">No recent games found</p>
                </div>
              ) : (
                recentGames.map((game, index) => {
                  const isPlayerWhite = game.white.toLowerCase() === profile.username.toLowerCase();
                  const opponent = isPlayerWhite ? game.black : game.white;
                  const resultColor = getResultColor(game.result, isPlayerWhite);
                  const resultText = getResultText(game.result, isPlayerWhite);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectGame(game)}
                      className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded p-2 text-left transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-xs font-bold">
                            {isPlayerWhite ? '⬜' : '⬛'}
                          </span>
                          <span className="text-white text-xs">vs {opponent}</span>
                        </div>
                        <span className={`text-xs font-bold ${resultColor}`}>
                          {resultText}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">
                          {getTimeControlType(game.timeControl)}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {getTimeControlDisplay(game.timeControl)}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* Analysis Info */}
          <div className="bg-[#2a2520] rounded p-2 border border-[#3d3d3d]">
            <p className="text-[#81b64c] text-xs">
              ✓ Analysis adjusted for {profile.rating}-rated player
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
