import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Difficulty, GridItem, GameStats, GameSettings } from './types';
import { DIFFICULTY_CONFIGS } from './constants';
import { generateGrid, performSwap, checkGuess } from './utils/gameLogic';
import { soundManager } from './utils/sound';
import { Menu } from './components/Menu';
import { GridItem as GridItemComponent } from './components/GridItem';
import { Header } from './components/Header';
import { GameOver } from './components/GameOver';
import { SettingsModal } from './components/SettingsModal';
import { LevelUpOverlay } from './components/LevelUpOverlay';

const App: React.FC = () => {
  // Game Configuration State
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.NORMAL);
  const [settings, setSettings] = useState<GameSettings>({
    isDarkMode: false,
    sfxVolume: 0.5,
    musicVolume: 0.3
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  // Gameplay State
  const [grid, setGrid] = useState<GridItem[]>([]);
  const [swappedIds, setSwappedIds] = useState<string[]>([]); // The solution
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // User's input
  
  // Stats
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    lives: 3,
    round: 1,
    streak: 0
  });
  
  // Visual/Feedback State
  const [message, setMessage] = useState<string>('');
  const [roundResult, setRoundResult] = useState<'CORRECT' | 'WRONG' | null>(null);
  
  // Timers and Refs
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Effects ---

  // 1. Audio settings update (THIS WAS MISSING/BROKEN IN YOUR SNIPPET)
  useEffect(() => {
    soundManager.setVolume(settings.sfxVolume, settings.musicVolume);
  }, [settings.sfxVolume, settings.musicVolume]);

  // 2. Global listener to start music on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      soundManager.startMusic();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // 3. Dark Mode
  useEffect(() => {
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.isDarkMode]);

  // --- Game Loop Control ---

  const startGame = (selectedDifficulty: Difficulty) => {
    soundManager.playClick();
   
    setDifficulty(selectedDifficulty);
    setStats({ score: 0, lives: 3, round: 1, streak: 0 });
    
    setGameState(GameState.PREPARING);
    setMessage('Memorize the Grid');
    
    const config = DIFFICULTY_CONFIGS[selectedDifficulty];
    const newGrid = generateGrid(config.gridSize);
    setGrid(newGrid);
    
    timerRef.current = setTimeout(() => {
      triggerSwap(newGrid, config.itemsToSwap);
    }, 2000);
  };

  const triggerSwap = useCallback((currentGrid: GridItem[], swapCount: number) => {
    // 1. Perform swap logic
    const { newGrid, swappedIds } = performSwap(currentGrid, swapCount);
    setGrid(newGrid);
    setSwappedIds(swappedIds);
    soundManager.playSwap();
    
    // 2. Update State
    setGameState(GameState.SWAPPED);
    setMessage(`Find the ${swapCount} changes`);
    setSelectedIds([]); 
  }, []);

  const handleTileClick = (id: string) => {
    if (gameState !== GameState.SWAPPED) return;
    if (selectedIds.includes(id)) return; // Prevent double click

    soundManager.playPop();
    const newSelection = [...selectedIds, id];
    setSelectedIds(newSelection);

    const config = DIFFICULTY_CONFIGS[difficulty];
    const requiredCount = config.itemsToSwap;

    if (newSelection.length === requiredCount) {
        verifyRound(newSelection);
    }
  };

  const verifyRound = (userSelection: string[]) => {
    const isCorrect = checkGuess(userSelection, swappedIds);
    setGameState(GameState.ROUND_RESULT);

    if (isCorrect) {
        // Success Logic
        soundManager.playCorrect();
        setRoundResult('CORRECT');
        setMessage('Perfect Match!');
        const config = DIFFICULTY_CONFIGS[difficulty];
        
        const streakBonus = stats.streak * 50;
        const newScore = stats.score + config.pointsPerRound + (stats.round * 10) + streakBonus;
        const newStreak = stats.streak + 1;
        
        let nextDifficulty = difficulty;
        let didLevelUp = false;

        if (newStreak >= 5) {
            didLevelUp = true;
            if (difficulty === Difficulty.EASY) nextDifficulty = Difficulty.NORMAL;
            else if (difficulty === Difficulty.NORMAL) nextDifficulty = Difficulty.HARD;
            else if (difficulty === Difficulty.HARD) nextDifficulty = Difficulty.EXPERT;
            else if (difficulty === Difficulty.EXPERT) nextDifficulty = Difficulty.MASTER;
            else if (difficulty === Difficulty.MASTER) nextDifficulty = Difficulty.LEGEND;
        }

        setStats(prev => ({
            ...prev,
            score: newScore,
            round: prev.round + 1,
            streak: didLevelUp ? 0 : newStreak 
        }));
        
        if (didLevelUp && nextDifficulty !== difficulty) {
             soundManager.playLevelUp();
             setShowLevelUp(true);
             setTimeout(() => setShowLevelUp(false), 2500);
        }

        timerRef.current = setTimeout(() => {
            if (didLevelUp && nextDifficulty !== difficulty) {
                setDifficulty(nextDifficulty); 
                prepareNewLevel(nextDifficulty);
            } else {
                prepareNextRound();
            }
        }, 1500);

    } else {
        // Failure Logic
        soundManager.playWrong();
        setRoundResult('WRONG');
        setMessage('Incorrect');
        const newLives = stats.lives - 1;
        
        setStats(prev => ({ ...prev, lives: newLives, streak: 0 }));

        if (newLives <= 0) {
            timerRef.current = setTimeout(() => {
                soundManager.playGameOver();
                setGameState(GameState.GAME_OVER);
            }, 1500);
        } else {
             timerRef.current = setTimeout(() => {
                prepareNextRound();
            }, 1500);
        }
    }
  };

  const prepareNextRound = () => {
    setRoundResult(null);
    setSelectedIds([]);
    setGameState(GameState.PREPARING);
    setMessage('Watch Closely...');
    
    const config = DIFFICULTY_CONFIGS[difficulty];
    const speedup = Math.min(1000, stats.round * 50); 
    const delay = Math.max(800, 2000 - speedup); 

    timerRef.current = setTimeout(() => {
        triggerSwap(grid, config.itemsToSwap);
    }, delay);
  };

  const prepareNewLevel = (newDiff: Difficulty) => {
    setRoundResult(null);
    setSelectedIds([]);
    setGameState(GameState.PREPARING);
    setMessage('Level Up! Expanding...');
    
    const config = DIFFICULTY_CONFIGS[newDiff];
    const newGrid = generateGrid(config.gridSize);
    setGrid(newGrid);

    timerRef.current = setTimeout(() => {
        triggerSwap(newGrid, config.itemsToSwap);
    }, 2500); 
  };

  useEffect(() => {
    return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const getGridCols = () => {
    const total = grid.length;
    const side = Math.ceil(Math.sqrt(total));
    if (side <= 3) return 'grid-cols-3';
    if (side === 4) return 'grid-cols-4';
    if (side === 5) return 'grid-cols-5';
    if (side === 6) return 'grid-cols-6';
    if (side === 8) return 'grid-cols-8';
    if (side >= 10) return 'grid-cols-10';
    return 'grid-cols-4';
  };

  return (
    <div className={`min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text flex flex-col relative overflow-hidden selection:bg-pastel-blue selection:text-white font-sans transition-colors duration-500`}>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pastel-blue/20 dark:bg-pastel-blue/5 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pastel-purple/20 dark:bg-pastel-purple/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
          <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-pastel-yellow/10 dark:bg-pastel-yellow/5 rounded-full blur-[80px]"></div>
      </div>

      {showLevelUp && <LevelUpOverlay />}
      {showSettings && <SettingsModal settings={settings} onUpdate={setSettings} onClose={() => setShowSettings(false)} />}

      <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto p-4 z-10">
        
        {gameState === GameState.MENU && (
          <Menu 
            onStart={startGame} 
            onOpenSettings={() => { soundManager.playClick(); setShowSettings(true); }}
          />
        )}

        {(gameState === GameState.PREPARING || gameState === GameState.SWAPPED || gameState === GameState.ROUND_RESULT) && (
            <div className="flex flex-col h-full justify-center animate-fade-in relative">
                <Header 
                    stats={stats} 
                    message={message} 
                    isWarning={roundResult === 'WRONG'}
                    isSuccess={roundResult === 'CORRECT'}
                    onHome={() => {
                        soundManager.playClick();
                        setGameState(GameState.MENU);
                    }}
                />
                
                {/* 
                   Fix: Removed min-h-[50vh] (it pushed content down).
                   Added overflow-hidden to prevent scrollbars.
                */}
                <div className="flex-1 flex items-center justify-center py-2 overflow-hidden">
                    
                    {/* 
                       Fix: Changed size logic.
                       w-[min(90vw,65vh)] -> This makes the square strictly follow 
                       whichever dimension is smaller (width on phones, height on laptops).
                       This ensures it never goes off-screen vertically.
                    */}
                    <div className={`
                        grid ${getGridCols()} 
                        gap-2 sm:gap-3 
                        w-[min(90vw,65vh)] 
                        aspect-square 
                        transition-all duration-500
                    `}>
                        {grid.map((item) => {
                            const isSelected = selectedIds.includes(item.id);
                            
                            let isCorrectReveal = false;
                            let isWrongReveal = false;

                            if (gameState === GameState.ROUND_RESULT) {
                                if (swappedIds.includes(item.id)) {
                                    if (roundResult === 'CORRECT') isCorrectReveal = true;
                                    if (roundResult === 'WRONG') isCorrectReveal = true; 
                                }
                                
                                if (roundResult === 'WRONG' && isSelected && !swappedIds.includes(item.id)) {
                                    isWrongReveal = true;
                                }
                            }

                            return (
                                <GridItemComponent
                                    key={item.id}
                                    item={item}
                                    isSelected={isSelected}
                                    isCorrect={isCorrectReveal}
                                    isWrong={isWrongReveal}
                                    disabled={gameState !== GameState.SWAPPED}
                                    onClick={handleTileClick}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        )}

        {gameState === GameState.GAME_OVER && (
            <GameOver 
                stats={stats} 
                difficultyLabel={DIFFICULTY_CONFIGS[difficulty].label}
                currentDifficulty={difficulty}
                onRetry={() => startGame(difficulty)} 
                onHome={() => {
                    soundManager.playClick();
                    setGameState(GameState.MENU);
                }} 
            />
        )}
      </div>

      <div className="p-4 text-center text-xs text-slate-300 dark:text-slate-600">
        SwapSpot v3.0
      </div>
    </div>
  );
};

export default App;