import React from 'react';
import { X, Moon, Sun, Volume2, Music, Trash2 } from 'lucide-react';
import { GameSettings } from '../types';
import { clearLeaderboard } from '../utils/storage';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdate: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onUpdate, onClose }) => {
  
  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all leaderboard data?')) {
        clearLeaderboard();
        // Dispatch custom event so Menu updates immediately
        window.dispatchEvent(new Event('leaderboardUpdate'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm animate-scale-in border border-slate-100 dark:border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.isDarkMode ? <Moon className="w-5 h-5 text-pastel-purple" /> : <Sun className="w-5 h-5 text-pastel-orange" />}
              <span className="font-medium text-slate-700 dark:text-slate-200">Dark Mode</span>
            </div>
            <button
              onClick={() => onUpdate({ ...settings, isDarkMode: !settings.isDarkMode })}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${settings.isDarkMode ? 'bg-pastel-purple' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${settings.isDarkMode ? 'translate-x-6' : ''}`} />
            </button>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-700" />

          {/* Audio Settings */}
          <div className="space-y-4">
             <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                   <div className="flex items-center gap-2"><Volume2 className="w-4 h-4" /> <span>Sound Effects</span></div>
                   <span>{Math.round(settings.sfxVolume * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.1" 
                  value={settings.sfxVolume}
                  onChange={(e) => onUpdate({...settings, sfxVolume: parseFloat(e.target.value)})}
                  className="w-full accent-pastel-blue h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer"
                />
             </div>

             <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                   <div className="flex items-center gap-2"><Music className="w-4 h-4" /> <span>Music</span></div>
                   <span>{Math.round(settings.musicVolume * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.1" 
                  value={settings.musicVolume}
                  onChange={(e) => onUpdate({...settings, musicVolume: parseFloat(e.target.value)})}
                  className="w-full accent-pastel-purple h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer"
                />
             </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-700" />

          {/* Data Management */}
          <button 
            onClick={handleClearData}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Reset Leaderboard
          </button>

        </div>
      </div>
    </div>
  );
};