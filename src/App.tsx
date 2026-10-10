import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { TelemetryPanel } from './components/TelemetryPanel';
import { NokiaHandset } from './components/NokiaHandset';
import { ConfigPanel } from './components/ConfigPanel';
import { HighScoresView } from './components/HighScoresView';
import { HowToPlayView } from './components/HowToPlayView';
import { SoundSettingsView } from './components/SoundSettingsView';
import { InitialsEntryModal } from './components/InitialsEntryModal';
import { ProfileModal } from './components/ProfileModal';
import { Footer } from './components/Footer';
import { audioEngine } from './audio/audioEngine';
import {
  GameState,
  DifficultyPreset,
  WallMode,
  MapType,
  Point,
  BonusBug,
  GameTelemetry,
  HighScoreRecord,
  UserStats,
} from './types/game';
import { GAME_MAPS } from './utils/maps';
import { Smartphone, Volume2, VolumeX } from 'lucide-react';

const GRID_SIZE = 20;

const INITIAL_HIGH_SCORES: HighScoreRecord[] = [
  {
    id: '1',
    initials: 'TAN',
    score: 480,
    difficulty: 'classic',
    wallMode: 'solid',
    mapType: 'open',
    date: '2000-09-01',
    snakeLength: 35,
  },
  {
    id: '2',
    initials: 'NOK',
    score: 390,
    difficulty: 'turbo',
    wallMode: 'wrap',
    mapType: 'pillars',
    date: '2000-09-15',
    snakeLength: 29,
  },
  {
    id: '3',
    initials: 'NEO',
    score: 310,
    difficulty: 'classic',
    wallMode: 'solid',
    mapType: 'corners',
    date: '2001-01-20',
    snakeLength: 24,
  },
  {
    id: '4',
    initials: 'ACE',
    score: 240,
    difficulty: 'casual',
    wallMode: 'wrap',
    mapType: 'cross',
    date: '2001-03-12',
    snakeLength: 19,
  },
  {
    id: '5',
    initials: 'RET',
    score: 160,
    difficulty: 'classic',
    wallMode: 'solid',
    mapType: 'box',
    date: '2002-05-04',
    snakeLength: 14,
  },
];

export default function App() {
  // Navigation Tabs
  const [currentTab, setCurrentTab] = useState<
    'game' | 'how-to-play' | 'high-scores' | 'sound-settings'
  >('game');

  // Game Settings & Map Layout
  const [currentMap, setCurrentMap] = useState<MapType>('open');
  const [difficulty, setDifficulty] = useState<DifficultyPreset>('classic');
  const [wallMode, setWallMode] = useState<WallMode>('solid');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [bonusBugEnabled, setBonusBugEnabled] = useState<boolean>(true);

  // Active map barriers
  const barriers = GAME_MAPS[currentMap].barriers;

  // Difficulty base tick
  const getBaseTick = (diff: DifficultyPreset) => {
    switch (diff) {
      case 'casual':
        return 180;
      case 'classic':
        return 150;
      case 'turbo':
        return 90;
    }
  };

  const [currentTick, setCurrentTick] = useState<number>(150);

  // Game Engine State
  const [gameState, setGameState] = useState<GameState>('START');
  const [snake, setSnake] = useState<Point[]>([
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 },
  ]);
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [food, setFood] = useState<Point>({ x: 14, y: 10 });
  const [bonusBug, setBonusBug] = useState<BonusBug | null>(null);
  const [score, setScore] = useState<number>(0);
  const [eggsEaten, setEggsEaten] = useState<number>(0);
  const [bonusEaten, setBonusEaten] = useState<number>(0);
  const [causeOfDeath, setCauseOfDeath] = useState<'wall' | 'self' | null>(null);

  // High Scores & Leaderboard
  const [highScores, setHighScores] = useState<HighScoreRecord[]>(() => {
    try {
      const stored = localStorage.getItem('nokia_snake_leaderboard');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_HIGH_SCORES;
  });

  const [allTimeHigh, setAllTimeHigh] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('nokia_snake_hi');
      if (stored) return parseInt(stored, 10) || 480;
    } catch {
      // fallback
    }
    return 480;
  });

  // User Lifetime Stats
  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
      const stored = localStorage.getItem('nokia_snake_user_stats');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return {
      totalGames: 0,
      totalEggs: 0,
      highestScore: 480,
      longestSnake: 35,
      totalPlayTimeSeconds: 120,
    };
  });

  const [showInitialsModal, setShowInitialsModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // References for reliable real-time tick loop
  const inputQueueRef = useRef<Point[]>([]);
  const lastTickTimeRef = useRef<number>(0);
  const playTimerRef = useRef<number>(0);

  // Helper: Spawn Food (Ensures food does not spawn on snake, bug, or static barriers)
  const spawnFood = useCallback(
    (currentSnake: Point[], currentBug: BonusBug | null, currentBarriers: Point[]) => {
      const emptyCells: Point[] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
          const onSnake = currentSnake.some((seg) => seg.x === x && seg.y === y);
          const onBug = currentBug && currentBug.x === x && currentBug.y === y;
          const onBarrier = currentBarriers.some((b) => b.x === x && b.y === y);
          if (!onSnake && !onBug && !onBarrier) {
            emptyCells.push({ x, y });
          }
        }
      }
      if (emptyCells.length > 0) {
        const rand = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[rand];
      }
      return { x: 5, y: 5 };
    },
    []
  );

  // Helper: Spawn Bonus Bug (Ensures bug does not spawn on barriers)
  const maybeSpawnBonusBug = useCallback(
    (currentSnake: Point[], currentFood: Point, currentBarriers: Point[]) => {
      if (!bonusBugEnabled) return null;
      if (Math.random() < 0.28) {
        const emptyCells: Point[] = [];
        for (let x = 2; x < GRID_SIZE - 2; x++) {
          for (let y = 2; y < GRID_SIZE - 2; y++) {
            const onSnake = currentSnake.some((seg) => seg.x === x && seg.y === y);
            const onFood = currentFood.x === x && currentFood.y === y;
            const onBarrier = currentBarriers.some((b) => b.x === x && b.y === y);
            if (!onSnake && !onFood && !onBarrier) {
              emptyCells.push({ x, y });
            }
          }
        }
        if (emptyCells.length > 0) {
          const rand = Math.floor(Math.random() * emptyCells.length);
          const cell = emptyCells[rand];
          return {
            x: cell.x,
            y: cell.y,
            type: Math.random() > 0.5 ? 'ladybug' : 'spider',
            points: 50,
            timer: 45,
            maxTimer: 45,
          } as BonusBug;
        }
      }
      return null;
    },
    [bonusBugEnabled]
  );

  // Reset Game
  const handleStartGame = useCallback(() => {
    const initialSnake: Point[] = [
      { x: 9, y: 10 },
      { x: 8, y: 10 },
      { x: 7, y: 10 },
    ];
    setSnake(initialSnake);
    setDirection({ x: 1, y: 0 });
    inputQueueRef.current = [];
    setScore(0);
    setEggsEaten(0);
    setBonusEaten(0);
    setCauseOfDeath(null);
    setBonusBug(null);

    const baseT = getBaseTick(difficulty);
    setCurrentTick(baseT);

    const initialFood = spawnFood(initialSnake, null, barriers);
    setFood(initialFood);

    setGameState('PLAYING');
    lastTickTimeRef.current = performance.now();
    audioEngine.playKeyClick();

    // Increment games count
    setUserStats((prev) => {
      const updated = { ...prev, totalGames: prev.totalGames + 1 };
      try {
        localStorage.setItem('nokia_snake_user_stats', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [difficulty, spawnFood, barriers]);

  // Handle Game Map Layout Change
  const handleMapChange = (newMap: MapType) => {
    audioEngine.playKeyClick();
    setCurrentMap(newMap);
    const newBarriers = GAME_MAPS[newMap].barriers;

    const initialSnake: Point[] = [
      { x: 9, y: 10 },
      { x: 8, y: 10 },
      { x: 7, y: 10 },
    ];
    setSnake(initialSnake);
    setDirection({ x: 1, y: 0 });
    inputQueueRef.current = [];
    setScore(0);
    setEggsEaten(0);
    setBonusEaten(0);
    setBonusBug(null);
    setFood(spawnFood(initialSnake, null, newBarriers));
    setGameState('START');
  };

  // Pause / Resume
  const handlePauseGame = () => {
    if (gameState === 'PLAYING') {
      setGameState('PAUSED');
      audioEngine.playKeyClick();
    }
  };

  const handleResumeGame = () => {
    if (gameState === 'PAUSED') {
      setGameState('PLAYING');
      lastTickTimeRef.current = performance.now();
      audioEngine.playKeyClick();
    }
  };

  // Queue Direction (with FIFO protection against 180° immediate self-inversions)
  const handleSteer = useCallback(
    (newDir: Point) => {
      audioEngine.playKeyClick();
      const lastPlanned =
        inputQueueRef.current.length > 0
          ? inputQueueRef.current[inputQueueRef.current.length - 1]
          : direction;

      // Disallow 180° inversion
      if (newDir.x === -lastPlanned.x && newDir.y === -lastPlanned.y) {
        return;
      }
      // Disallow duplicate command
      if (newDir.x === lastPlanned.x && newDir.y === lastPlanned.y) {
        return;
      }

      if (inputQueueRef.current.length < 2) {
        inputQueueRef.current.push(newDir);
      }
    },
    [direction]
  );

  // Trigger Game Over with specific collision sounds and the iconic "faaah" sound
  const triggerGameOver = useCallback(
    (cause: 'wall' | 'self') => {
      setGameState('GAMEOVER');
      setCauseOfDeath(cause);

      // Play specific collision sound requested by user:
      // "hits a wall" -> playWallCrash()
      // "different sound when it bites itself for collisions" -> playSelfBite()
      if (cause === 'wall') {
        audioEngine.playWallCrash();
      } else {
        audioEngine.playSelfBite();
      }

      // "if game over use faaah sound"
      setTimeout(() => {
        audioEngine.playFaaah();
      }, 160);

      // Update High Score if beaten
      if (score > allTimeHigh) {
        setAllTimeHigh(score);
        try {
          localStorage.setItem('nokia_snake_hi', String(score));
        } catch {}
      }

      // Update User Lifetime Stats
      setUserStats((prev) => {
        const updated = {
          ...prev,
          highestScore: Math.max(prev.highestScore, score),
          longestSnake: Math.max(prev.longestSnake, snake.length),
        };
        try {
          localStorage.setItem('nokia_snake_user_stats', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // Prompt for arcade initials if high score or decent score
      if (score >= 40) {
        setTimeout(() => {
          setShowInitialsModal(true);
        }, 1100);
      }
    },
    [allTimeHigh, score, snake.length]
  );

  // Main Discrete Game Tick
  const tick = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    // 1. Process queued direction
    let activeDir = direction;
    if (inputQueueRef.current.length > 0) {
      activeDir = inputQueueRef.current.shift()!;
      setDirection(activeDir);
    }

    // 2. Play snake move sound as requested: "and when it moves"
    audioEngine.playMoveTick();

    // 3. Calculate new head position
    let newHeadX = snake[0].x + activeDir.x;
    let newHeadY = snake[0].y + activeDir.y;

    // 4. Boundary collision or wrap-around
    if (wallMode === 'wrap') {
      if (newHeadX < 0) newHeadX = GRID_SIZE - 1;
      if (newHeadX >= GRID_SIZE) newHeadX = 0;
      if (newHeadY < 0) newHeadY = GRID_SIZE - 1;
      if (newHeadY >= GRID_SIZE) newHeadY = 0;
    } else {
      // Solid Walls: check perimeter bounds
      if (newHeadX < 0 || newHeadX >= GRID_SIZE || newHeadY < 0 || newHeadY >= GRID_SIZE) {
        triggerGameOver('wall');
        return;
      }
    }

    // 4.5 Static Internal Barrier Collision
    const hitBarrier = barriers.some((b) => b.x === newHeadX && b.y === newHeadY);
    if (hitBarrier) {
      triggerGameOver('wall');
      return;
    }

    // 5. Check self-collision (bites itself)
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === newHeadX && snake[i].y === newHeadY) {
        triggerGameOver('self');
        return;
      }
    }

    const newHead: Point = { x: newHeadX, y: newHeadY };
    const nextSnake = [newHead, ...snake];

    // 6. Check Egg consumption (Chomp sound!)
    let didEatEgg = false;
    let nextFood = food;
    let nextBug = bonusBug;

    if (newHeadX === food.x && newHeadY === food.y) {
      didEatEgg = true;
      const newScore = score + 10;
      setScore(newScore);
      setEggsEaten((prev) => prev + 1);

      // User request: "add music like chomp when snake eats"
      audioEngine.playChomp();

      // Progressive speed acceleration: 2ms faster down to 70ms ceiling
      setCurrentTick((prev) => Math.max(70, prev - 2));

      // Update user lifetime stats
      setUserStats((prev) => {
        const updated = { ...prev, totalEggs: prev.totalEggs + 1 };
        try {
          localStorage.setItem('nokia_snake_user_stats', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // Spawn next egg (passing barriers)
      nextFood = spawnFood(nextSnake, nextBug, barriers);
      setFood(nextFood);

      // Chance to spawn bonus insect if none currently active
      if (!nextBug) {
        const spawned = maybeSpawnBonusBug(nextSnake, nextFood, barriers);
        if (spawned) {
          nextBug = spawned;
          setBonusBug(nextBug);
        }
      }
    }

    // 7. Check Bonus Bug consumption
    if (nextBug && newHeadX === nextBug.x && newHeadY === nextBug.y) {
      const bugPoints = nextBug.points;
      setScore((prev) => prev + bugPoints);
      setBonusEaten((prev) => prev + 1);
      audioEngine.playBonusEat();
      nextBug = null;
      setBonusBug(null);
    } else if (nextBug) {
      // Count down bug timer
      if (nextBug.timer <= 1) {
        nextBug = null;
        setBonusBug(null);
      } else {
        // Occasionally move bug randomly by 1 cell
        let bugX = nextBug.x;
        let bugY = nextBug.y;
        if (Math.random() < 0.25) {
          const bugDirs = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
          ];
          const bd = bugDirs[Math.floor(Math.random() * bugDirs.length)];
          const tryX = Math.max(1, Math.min(GRID_SIZE - 2, bugX + bd.x));
          const tryY = Math.max(1, Math.min(GRID_SIZE - 2, bugY + bd.y));
          const bugOnSnake = nextSnake.some((seg) => seg.x === tryX && seg.y === tryY);
          const bugOnBarrier = barriers.some((b) => b.x === tryX && b.y === tryY);
          if (!bugOnSnake && !bugOnBarrier) {
            bugX = tryX;
            bugY = tryY;
          }
        }
        nextBug = {
          ...nextBug,
          x: bugX,
          y: bugY,
          timer: nextBug.timer - 1,
        };
        setBonusBug(nextBug);
      }
    }

    // If no egg was eaten, remove tail
    if (!didEatEgg) {
      nextSnake.pop();
    }

    setSnake(nextSnake);
  }, [
    gameState,
    direction,
    snake,
    wallMode,
    food,
    bonusBug,
    score,
    triggerGameOver,
    spawnFood,
    maybeSpawnBonusBug,
    barriers,
  ]);

  // RequestAnimationFrame Clock with dynamic tick accumulator
  useEffect(() => {
    let animId: number;

    const loop = (timestamp: number) => {
      if (!lastTickTimeRef.current) lastTickTimeRef.current = timestamp;
      const delta = timestamp - lastTickTimeRef.current;

      if (gameState === 'PLAYING' && delta >= currentTick) {
        tick();
        lastTickTimeRef.current = timestamp;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, currentTick, tick]);

  // Playtime Tracker
  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const interval = setInterval(() => {
      playTimerRef.current += 1;
      if (playTimerRef.current % 10 === 0) {
        setUserStats((prev) => {
          const updated = {
            ...prev,
            totalPlayTimeSeconds: prev.totalPlayTimeSeconds + 10,
          };
          try {
            localStorage.setItem('nokia_snake_user_stats', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Global Keyboard Controls Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter'];
      if (gameKeys.includes(e.key)) {
        e.preventDefault();
      }

      // Steer Up
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === '8') {
        if (gameState === 'START') handleStartGame();
        else handleSteer({ x: 0, y: -1 });
      }
      // Steer Down
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.key === '2') {
        if (gameState === 'START') handleStartGame();
        else handleSteer({ x: 0, y: 1 });
      }
      // Steer Left
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' || e.key === '4') {
        if (gameState === 'START') handleStartGame();
        else handleSteer({ x: -1, y: 0 });
      }
      // Steer Right
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' || e.key === '6') {
        if (gameState === 'START') handleStartGame();
        else handleSteer({ x: 1, y: 0 });
      }
      // Space (Start / Pause)
      else if (e.key === ' ') {
        if (gameState === 'START' || gameState === 'GAMEOVER') {
          handleStartGame();
        } else if (gameState === 'PLAYING') {
          handlePauseGame();
        } else if (gameState === 'PAUSED') {
          handleResumeGame();
        }
      }
      // Enter (Start / Restart)
      else if (e.key === 'Enter') {
        if (gameState === 'START' || gameState === 'GAMEOVER') {
          handleStartGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleStartGame, handleSteer]);

  // Toggle Sound
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioEngine.setEnabled(next);
    audioEngine.playKeyClick();
  };

  // Change Difficulty
  const handleDifficultyChange = (newDiff: DifficultyPreset) => {
    audioEngine.playKeyClick();
    setDifficulty(newDiff);
    const baseT = getBaseTick(newDiff);
    if (gameState === 'START' || gameState === 'GAMEOVER') {
      setCurrentTick(baseT);
    }
  };

  // Change Wall Mode
  const handleWallModeChange = (newMode: WallMode) => {
    audioEngine.playKeyClick();
    setWallMode(newMode);
  };

  // Clear Leaderboard High Scores
  const handleClearScores = () => {
    setHighScores([]);
    try {
      localStorage.removeItem('nokia_snake_leaderboard');
    } catch {}
    audioEngine.playKeyClick();
  };

  // Clear Record Data
  const handleResetRecordData = () => {
    setAllTimeHigh(0);
    try {
      localStorage.removeItem('nokia_snake_hi');
    } catch {}
    audioEngine.playKeyClick();
  };

  // Save High Score with initials
  const handleSaveInitials = (initials: string) => {
    const newRecord: HighScoreRecord = {
      id: String(Date.now()),
      initials,
      score,
      difficulty,
      wallMode,
      mapType: currentMap,
      date: new Date().toISOString().split('T')[0],
      snakeLength: snake.length,
    };

    const updated = [newRecord, ...highScores].sort((a, b) => b.score - a.score).slice(0, 50);
    setHighScores(updated);
    try {
      localStorage.setItem('nokia_snake_leaderboard', JSON.stringify(updated));
    } catch {}
    setShowInitialsModal(false);
  };

  // Live Telemetry Object
  const telemetry: GameTelemetry = {
    currentTick,
    velocity: 1000 / currentTick,
    eggsEaten,
    snakeLength: snake.length,
    gridCoverage: (snake.length / (GRID_SIZE * GRID_SIZE)) * 100,
    sessionScore: score,
    highScore: allTimeHigh,
    bonusEaten,
    currentMap,
    causeOfDeath,
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#081425] text-[#d8e3fb]">
      {/* Top Fixed Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          audioEngine.playKeyClick();
          setCurrentTab(tab);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenProfile={() => {
          audioEngine.playKeyClick();
          setShowProfileModal(true);
        }}
      />

      {/* Main Content Area */}
      <main className="w-full pt-16 flex-1 flex flex-col">
        {currentTab === 'game' && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
            {/* Top Nostalgic Status Banner matching screenshot */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-[#152031] border border-[#1f2a3c] shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#0f380f] flex items-center justify-center text-[#a4d39a] border border-[#a4d39a]/30 shadow-inner">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-headline-lg text-headline-lg text-[#a4d39a] tracking-wide">
                      NOKIA 3310 HARDWARE EMULATOR
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#b2d42f]/15 text-[#b2d42f] font-label-lcd-status text-label-lcd-status uppercase tracking-widest border border-[#b2d42f]/30">
                      ROM v4.45
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-[#c2c9bc]">
                    Uncompromising 1999 monochrome architecture with physical key matrices & monophonic buzzer synthesis.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Status Indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#111c2d] border border-[#1f2a3c] shadow-sm">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      gameState === 'PLAYING'
                        ? 'bg-[#a4d39a] animate-pulse'
                        : gameState === 'PAUSED'
                        ? 'bg-[#b2d42f]'
                        : gameState === 'GAMEOVER'
                        ? 'bg-[#ffb4ab]'
                        : 'bg-[#a4d39a]'
                    }`}
                  />
                  <span className="font-headline-sm text-headline-sm text-[#d8e3fb]">STATUS:</span>
                  <span
                    className={`font-headline-sm text-headline-sm uppercase ${
                      gameState === 'PLAYING'
                        ? 'text-[#a4d39a]'
                        : gameState === 'PAUSED'
                        ? 'text-[#b2d42f]'
                        : gameState === 'GAMEOVER'
                        ? 'text-[#ffb4ab]'
                        : 'text-[#b2d42f]'
                    }`}
                  >
                    {gameState === 'START'
                      ? 'READY'
                      : gameState === 'PLAYING'
                      ? 'RUNNING'
                      : gameState === 'PAUSED'
                      ? 'PAUSED'
                      : 'GAME OVER'}
                  </span>
                </div>

                {/* Buzzer Button */}
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1f2a3c] hover:bg-[#2a3548] text-[#d8e3fb] transition-all active:scale-95 shadow-sm border border-[#2a3548]"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-[#b2d42f]" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-[#ffb4ab]" />
                  )}
                  <span className="font-headline-sm text-headline-sm uppercase">
                    {soundEnabled ? 'BUZZER ON' : 'MUTED'}
                  </span>
                </button>
              </div>
            </div>

            {/* Main Workspace Bento Layout: Left Telemetry, Center Nokia Handset, Right Config */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT TELEMETRY PANEL (Cols 1-3) */}
              <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">
                <TelemetryPanel telemetry={telemetry} />
              </div>

              {/* CENTER NOKIA 3310 HARDWARE CHASSIS (Cols 4-9) */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
                <NokiaHandset
                  gameState={gameState}
                  score={score}
                  highScore={allTimeHigh}
                  snake={snake}
                  food={food}
                  bonusBug={bonusBug}
                  direction={direction}
                  currentMap={currentMap}
                  barriers={barriers}
                  causeOfDeath={causeOfDeath}
                  onStartGame={handleStartGame}
                  onPauseGame={handlePauseGame}
                  onResumeGame={handleResumeGame}
                  onSteer={handleSteer}
                  onKeyClickFeedback={() => audioEngine.playKeyClick()}
                />
              </div>

              {/* RIGHT SETTINGS & MODES PANEL (Cols 10-12) */}
              <div className="lg:col-span-3 flex flex-col gap-6 order-3">
                <ConfigPanel
                  difficulty={difficulty}
                  onDifficultyChange={handleDifficultyChange}
                  wallMode={wallMode}
                  onWallModeChange={handleWallModeChange}
                  currentMap={currentMap}
                  onMapChange={handleMapChange}
                  soundEnabled={soundEnabled}
                  onToggleSound={handleToggleSound}
                  bonusBugEnabled={bonusBugEnabled}
                  onToggleBonusBug={() => {
                    audioEngine.playKeyClick();
                    setBonusBugEnabled(!bonusBugEnabled);
                  }}
                  onResetHighScore={handleResetRecordData}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: How to Play / Specs */}
        {currentTab === 'how-to-play' && (
          <HowToPlayView
            onPlayClick={() => {
              audioEngine.playKeyClick();
              setCurrentTab('game');
            }}
          />
        )}

        {/* Tab 3: High Scores Leaderboard */}
        {currentTab === 'high-scores' && (
          <HighScoresView
            scores={highScores}
            onClearScores={handleClearScores}
            onPlayClick={() => {
              audioEngine.playKeyClick();
              setCurrentTab('game');
            }}
          />
        )}

        {/* Tab 4: Sound FX Settings & Laboratory */}
        {currentTab === 'sound-settings' && (
          <SoundSettingsView
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}
      </main>

      {/* Arcade Initials High Score Modal */}
      <InitialsEntryModal
        isOpen={showInitialsModal}
        score={score}
        onSave={handleSaveInitials}
        onClose={() => setShowInitialsModal(false)}
      />

      {/* Player Career Stats Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        stats={userStats}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
