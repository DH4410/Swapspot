import React, { useEffect, useState } from 'react';
import { Difficulty, LeaderboardEntry } from '../types';
import { DIFFICULTY_CONFIGS } from '../constants';
import { Brain, Play, Trophy, Sparkles, Settings, Globe, Smartphone } from 'lucide-react';
import { getLeaderboard } from '../utils/storage';
import { isSupabaseConfigured } from '../utils/supabase';

interface MenuProps {
  onStart: (difficulty: Difficulty) => void;
  onOpenSettings: () => void;
}

export const Menu: React.FC<MenuProps> = ({ onStart, onOpenSettings }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoadingLB, setIsLoadingLB] = useState(true);
  const [isGlobal, setIsGlobal] = useState(false);

  const fetchLeaderboard = async () => {
    setIsLoadingLB(true);
    const data = await getLeaderboard();
    setLeaderboard(data);
    setIsGlobal(isSupabaseConfigured());
    setIsLoadingLB(false);
  };

  useEffect(() => {
    fetchLeaderboard();
    
    // Listeners for updates
    const handleStorageChange = () => fetchLeaderboard();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('leaderboardUpdate', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('leaderboardUpdate', handleStorageChange);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] w-full max-w-4xl mx-auto p-6 space-y-8 animate-slide-up">
      
      {/* Decorative Particles */}
      <div className="absolute top-0 left-10 w-24 h-24 bg-pastel-blue/20 dark:bg-pastel-blue/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-pastel-purple/20 dark:bg-pastel-purple/10 rounded-full blur-xl animate-pulse delay-700" />
      
      {/* Header Section */}
      <div className="text-center space-y-2 relative z-10">
        <div className="flex justify-center mb-6 relative">
             <div className="absolute inset-0 bg-pastel-blue blur-2xl opacity-40 rounded-full animate-pulse-fast"></div>
             <div className="relative bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 transition-colors">
                <Brain className="w-16 h-16 text-pastel-blue" />
             </div>
             <Sparkles className="absolute -top-4 -right-4 w-10 h-10 text-pastel-yellow animate-bounce" />
             
             <button 
               onClick={onOpenSettings}
               className="absolute top-1/2 -right-24 -translate-y-1/2 p-3 bg-white dark:bg-slate-800 rounded-full shadow-md text-slate-400 hover:text-pastel-blue hover:scale-110 transition-all"
               title="Settings"
             >
                <Settings className="w-6 h-6" />
             </button>
        </div>
        <h1 className="text-6xl font-black tracking-tight text-slate-800 dark:text-white drop-shadow-sm">
          Swap<span className="text-pastel-blue">Spot</span>
        </h1>
        <p className="text-slate-400 dark:text-slate-500 font-medium tracking-wide text-lg">
          Train your brain, fast.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full z-10">
        
        {/* Difficulty Selection */}
        <div className="space-y-3">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center mb-2">Start Challenge</p>
          {(Object.keys(DIFFICULTY_CONFIGS) as Difficulty[]).map((diff) => {
             const config = DIFFICULTY_CONFIGS[diff];
             let colorClass = "hover:border-pastel-blue hover:text-pastel-blue dark:hover:border-pastel-blue dark:hover:text-pastel-blue";
             if (diff === Difficulty.MASTER) colorClass = "hover:border-pastel-purple hover:text-pastel-purple dark:hover:border-pastel-purple dark:hover:text-pastel-purple";
             if (diff === Difficulty.LEGEND) colorClass = "hover:border-pastel-red hover:text-pastel-red dark:hover:border-pastel-red dark:hover:text-pastel-red";

             return (
              <button
                key={diff}
                onClick={() => onStart(diff)}
                className={`
                  w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300
                  bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-2 border-slate-100 dark:border-slate-700 shadow-sm
                  hover:shadow-md active:scale-95 flex items-center justify-between group
                  ${colorClass}
                `}
              >
                <span className="flex items-center gap-2">
                   {config.label}
                   {config.itemsToSwap > 2 && <span className="text-[10px] bg-pastel-yellow text-slate-700 px-2 py-0.5 rounded-full shadow-sm">TRIPLE</span>}
                </span>
                <Play className="w-5 h-5 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all" fill="currentColor" />
              </button>
             );
          })}
        </div>

        {/* Leaderboard Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-lg p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-pastel-yellow fill-pastel-yellow" />
                  <h3 className="font-bold text-slate-700 dark:text-slate-200">Leaderboard</h3>
                </div>
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                   {isGlobal ? <Globe className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                   {isGlobal ? 'Global' : 'Local'}
                </div>
            </div>
            
            <div className="flex-1 space-y-3 relative min-h-[160px]">
                {isLoadingLB ? (
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-pastel-blue border-t-transparent rounded-full animate-spin"></div>
                   </div>
                ) : leaderboard.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm italic opacity-60">
                        <p>No records yet.</p>
                        <p>Be the first!</p>
                    </div>
                ) : (
                    leaderboard.map((entry, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm group animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className={`
                                    w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full font-bold text-xs
                                    ${idx === 0 ? 'bg-pastel-yellow text-yellow-700' : 
                                      idx === 1 ? 'bg-slate-200 text-slate-600' : 
                                      idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 dark:bg-slate-700 text-slate-400'}
                                `}>
                                    {idx + 1}
                                </span>
                                <div className="flex flex-col truncate">
                                    <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">{entry.name}</span>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold">{entry.difficulty}</span>
                                </div>
                            </div>
                            <span className="font-mono font-bold text-pastel-blue">{entry.score.toLocaleString()}</span>
                        </div>
                    ))
                )}
            </div>
        </div>

      </div>
    </div>
  );
};