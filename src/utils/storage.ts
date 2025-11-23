import { LeaderboardEntry } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const LB_KEY = 'swapspot_leaderboard';

// Helper for local storage
const getLocalLeaderboard = (): LeaderboardEntry[] => {
  try {
    const raw = localStorage.getItem(LB_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  // 1. Try Global (Supabase) if configured
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(10); // Get top 10 globally

      if (error) {
        console.error('Supabase fetch error:', error.message || error);
        throw error;
      }

      if (data) {
        return data as LeaderboardEntry[];
      }
    } catch (err) {
      console.warn('Failed to fetch global leaderboard, falling back to local');
    }
  }

  // 2. Fallback to Local
  return getLocalLeaderboard().slice(0, 5);
};

export const saveScore = async (entry: LeaderboardEntry): Promise<void> => {
  // 1. Save Global
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('leaderboard')
        .insert([{ 
           name: entry.name, 
           score: entry.score, 
           difficulty: entry.difficulty,
           date: entry.date
        }]);
      
      if (error) {
        console.error('Supabase save error:', error.message || error);
      }
    } catch (err) {
      console.error('Supabase save failed', err);
    }
  }

  // 2. Always Save Local (as backup and for fast UI)
  const current = getLocalLeaderboard();
  const updated = [...current, entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); 
  localStorage.setItem(LB_KEY, JSON.stringify(updated));
};

export const isHighScore = async (score: number): Promise<boolean> => {
  if (score === 0) return false;
  
  const currentLeaderboard = await getLeaderboard();
  
  // If leaderboard isn't full (less than 5), any score is a high score
  if (currentLeaderboard.length < 5) return true;
  
  // Otherwise, beat the lowest score on the board
  const lowestScore = currentLeaderboard[currentLeaderboard.length - 1].score;
  return score > lowestScore;
};

export const clearLeaderboard = () => {
  localStorage.removeItem(LB_KEY);
  // Note: We don't clear global DB from client for security reasons
};