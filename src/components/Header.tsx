import React from 'react';
import { Heart, Star, LogOut, Flame } from 'lucide-react';
import { GameStats } from '../types';

interface HeaderProps {
  stats: GameStats;
  message: string;
  isWarning?: boolean;
  isSuccess?: boolean;
  onHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ stats, message, isWarning, isSuccess, onHome }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6 flex flex-col gap-4 animate-slide-down">
      
      {/* Top Navigation & Stats */}
      <div className="flex items-center justify-between">
         <button 
           onClick={onHome}
           className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
           title="Exit to Menu"
         >
            <LogOut className="w-5 h-5" />
         </button>

         {/* Stats Card */}
         <div className="flex items-center gap-4 md:gap-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-6 py-2 shadow-sm transition-colors">
            
            {/* Score */}
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-pastel-yellow fill-pastel-yellow" />
              <span className="font-bold text-lg text-slate-700 dark:text-slate-200">
                {stats.score}
              </span>
            </div>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

            {/* Streak */}
            <div className="flex items-center gap-1.5" title="Current Streak (5 to Level Up)">
               <Flame className={`w-5 h-5 ${stats.streak > 2 ? 'text-orange-400 fill-orange-400 animate-pulse' : 'text-slate-300 dark:text-slate-600'}`} />
               <span className="font-bold text-slate-600 dark:text-slate-400 text-sm">{stats.streak}/5</span>
            </div>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

            {/* Lives */}
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 transition-all duration-300 ${
                    i < stats.lives ? 'fill-pastel-red text-pastel-red' : 'fill-slate-100 dark:fill-slate-700 text-slate-200 dark:text-slate-600'
                  }`}
                />
              ))}
            </div>
         </div>

         {/* Spacer to balance the home button */}
         <div className="w-9"></div>
      </div>

      {/* Message Bar */}
      <div className="text-center">
        <h2 
          className={`text-xl font-black tracking-tight uppercase transition-all duration-300 transform ${
            isWarning ? 'text-pastel-red scale-110' : isSuccess ? 'text-pastel-green scale-110' : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          {message}
        </h2>
      </div>
    </div>
  );
};
