import React, { useState, useEffect } from 'react';
import { GameStats, Difficulty } from '../types';
import { RotateCcw, Home, Frown, Save, Loader2 } from 'lucide-react';
import { isHighScore, saveScore } from '../utils/storage';

interface GameOverProps {
  stats: GameStats;
  difficultyLabel: string;
  currentDifficulty: Difficulty;
  onRetry: () => void;
  onHome: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ stats, currentDifficulty, onRetry, onHome }) => {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isHigh, setIsHigh] = useState(false);
  const [checkingScore, setCheckingScore] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check high score asynchronously
    const check = async () => {
        const result = await isHighScore(stats.score);
        setIsHigh(result);
        setCheckingScore(false);
    };
    check();
  }, [stats.score]);

  const handleSubmitScore = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    
    await saveScore({
        name: name.trim().substring(0, 15),
        score: stats.score,
        difficulty: currentDifficulty,
        date: Date.now()
    });
    
    setIsSaving(false);
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 animate-scale-in px-6 z-20">
      
      <div className="relative">
        <div className="absolute inset-0 bg-pastel-red blur-3xl opacity-20 rounded-full"></div>
        <div className="relative bg-white dark:bg-slate-800 p-6 rounded-full shadow-lg mb-2">
            <Frown className="w-16 h-16 text-pastel-red" />
        </div>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-4xl font-black text-slate-800 dark:text-white">
          Run Ended
        </h2>
        <p className="text-slate-400 font-medium">Don't give up!</p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <div className="grid grid-cols-2 gap-8 text-center divide-x divide-slate-100 dark:divide-slate-700">
            <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Final Score</p>
                <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.score}</p>
            </div>
            <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Rounds</p>
                <p className="text-3xl font-black text-pastel-blue">{stats.round}</p>
            </div>
        </div>
      </div>

      {!submitted && (
         <div className="w-full max-w-sm min-h-[80px] flex items-center justify-center">
            {checkingScore ? (
                <div className="flex gap-2 text-slate-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Checking leaderboard...
                </div>
            ) : isHigh ? (
                <div className="w-full bg-pastel-yellow/20 dark:bg-pastel-yellow/10 border border-pastel-yellow p-4 rounded-xl text-center space-y-3 animate-pulse-fast">
                    <p className="text-yellow-700 dark:text-yellow-400 font-bold uppercase text-xs tracking-wider">New High Score!</p>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="ENTER NAME" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={15}
                            disabled={isSaving}
                            className="flex-1 px-4 py-2 rounded-lg border-none focus:ring-2 focus:ring-pastel-yellow bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-bold text-center uppercase disabled:opacity-50"
                        />
                        <button 
                            onClick={handleSubmitScore}
                            disabled={!name || isSaving}
                            className="bg-pastel-yellow text-yellow-900 p-2 rounded-lg hover:bg-yellow-400 disabled:opacity-50 transition-colors"
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-slate-400 text-sm">Score to beat: Top 5</div>
            )}
         </div>
      )}
      
      {submitted && (
         <div className="w-full max-w-sm bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-xl text-center">
            <p className="text-green-600 dark:text-green-400 font-bold text-sm">Score Submitted!</p>
         </div>
      )}

      <div className="flex flex-col w-full max-w-xs gap-3">
        <button 
            onClick={onRetry}
            className="flex items-center justify-center gap-2 w-full py-4 bg-pastel-blue text-white font-bold rounded-xl shadow-lg hover:bg-sky-400 hover:shadow-sky-200 transition-all active:scale-95"
        >
            <RotateCcw className="w-5 h-5" />
            Play Again
        </button>
        <button 
            onClick={onHome}
            className="flex items-center justify-center gap-2 w-full py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
        >
            <Home className="w-5 h-5" />
            Main Menu
        </button>
      </div>
    </div>
  );
};