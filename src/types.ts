
export enum GameState {
  MENU = 'MENU',
  PREPARING = 'PREPARING', // Showing grid before swap
  SWAPPED = 'SWAPPED', // Swap happened, waiting for user input
  ROUND_RESULT = 'ROUND_RESULT', // Showing success/fail animation
  GAME_OVER = 'GAME_OVER',
}

export enum Difficulty {
  EASY = 'EASY',     // 3x3
  NORMAL = 'NORMAL', // 4x4
  HARD = 'HARD',     // 5x5
  EXPERT = 'EXPERT', // 6x6
  MASTER = 'MASTER', // 8x8
  LEGEND = 'LEGEND'  // 10x10
}

export interface GridItem {
  id: string;
  iconName: string; // Identifier for the icon
  color: string;
}

export interface GameStats {
  score: number;
  lives: number;
  round: number;
  streak: number; // Added for 5-in-a-row logic
}

export interface DifficultyConfig {
  gridSize: number;
  swapIntervalBase: number; // ms
  pointsPerRound: number;
  label: string;
  itemsToSwap: number; // New: 2 or 3 items
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  difficulty: Difficulty;
  date: number;
}

export interface GameSettings {
  isDarkMode: boolean;
  sfxVolume: number; // 0 to 1
  musicVolume: number; // 0 to 1
}