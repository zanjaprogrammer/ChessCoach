// Chess.com and Lichess API integration
// Fetch player data and recent games

export interface PlayerProfile {
  username: string;
  rating: number;
  platform: 'chess.com' | 'lichess';
  avatar?: string;
  title?: string;
}

export interface GameData {
  pgn: string;
  white: string;
  black: string;
  result: string;
  timeControl: string;
  date: string;
}

/**
 * Fetch Chess.com player profile
 * API: https://api.chess.com/pub/player/{username}
 */
export async function fetchChessComProfile(username: string): Promise<PlayerProfile | null> {
  try {
    const response = await fetch(`https://api.chess.com/pub/player/${username}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    
    // Get rating from stats
    const statsResponse = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
    if (!statsResponse.ok) return null;
    
    const stats = await statsResponse.json();
    
    // Get rating from rapid, blitz, or bullet (whichever is available)
    const rating = stats.chess_rapid?.last.rating || 
                   stats.chess_blitz?.last.rating || 
                   stats.chess_bullet?.last.rating || 
                   1500;
    
    return {
      username: data.username,
      rating,
      platform: 'chess.com',
      avatar: data.avatar,
      title: data.title
    };
  } catch (error) {
    console.error('Error fetching Chess.com profile:', error);
    return null;
  }
}

/**
 * Fetch Lichess player profile
 * API: https://lichess.org/api/user/{username}
 */
export async function fetchLichessProfile(username: string): Promise<PlayerProfile | null> {
  try {
    const response = await fetch(`https://lichess.org/api/user/${username}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    
    // Get rating from rapid, blitz, or bullet
    const rating = data.perfs?.rapid?.rating || 
                   data.perfs?.blitz?.rating || 
                   data.perfs?.bullet?.rating || 
                   1500;
    
    return {
      username: data.username,
      rating,
      platform: 'lichess',
      title: data.title
    };
  } catch (error) {
    console.error('Error fetching Lichess profile:', error);
    return null;
  }
}

/**
 * Fetch recent games from Chess.com
 * API: https://api.chess.com/pub/player/{username}/games/{YYYY}/{MM}
 */
export async function fetchChessComRecentGames(username: string, limit: number = 10): Promise<GameData[]> {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    const response = await fetch(`https://api.chess.com/pub/player/${username}/games/${year}/${month}`);
    if (!response.ok) return [];
    
    const data = await response.json();
    
    return data.games.slice(0, limit).map((game: any) => ({
      pgn: game.pgn,
      white: game.white.username,
      black: game.black.username,
      result: game.white.result,
      timeControl: game.time_control,
      date: new Date(game.end_time * 1000).toISOString()
    }));
  } catch (error) {
    console.error('Error fetching Chess.com games:', error);
    return [];
  }
}

/**
 * Fetch recent games from Lichess
 * API: https://lichess.org/api/games/user/{username}
 */
export async function fetchLichessRecentGames(username: string, limit: number = 10): Promise<GameData[]> {
  try {
    const response = await fetch(
      `https://lichess.org/api/games/user/${username}?max=${limit}&pgnInJson=true`,
      {
        headers: {
          'Accept': 'application/x-ndjson'
        }
      }
    );
    
    if (!response.ok) return [];
    
    const text = await response.text();
    const games = text.trim().split('\n').map(line => JSON.parse(line));
    
    return games.map((game: any) => ({
      pgn: game.pgn,
      white: game.players.white.user?.name || 'Anonymous',
      black: game.players.black.user?.name || 'Anonymous',
      result: game.winner === 'white' ? '1-0' : game.winner === 'black' ? '0-1' : '1/2-1/2',
      timeControl: game.speed,
      date: new Date(game.createdAt).toISOString()
    }));
  } catch (error) {
    console.error('Error fetching Lichess games:', error);
    return [];
  }
}

/**
 * Auto-detect platform and fetch profile
 */
export async function fetchPlayerProfile(username: string, platform?: 'chess.com' | 'lichess'): Promise<PlayerProfile | null> {
  if (platform === 'chess.com') {
    return fetchChessComProfile(username);
  } else if (platform === 'lichess') {
    return fetchLichessProfile(username);
  }
  
  // Try both platforms
  const chessComProfile = await fetchChessComProfile(username);
  if (chessComProfile) return chessComProfile;
  
  const lichessProfile = await fetchLichessProfile(username);
  if (lichessProfile) return lichessProfile;
  
  return null;
}
