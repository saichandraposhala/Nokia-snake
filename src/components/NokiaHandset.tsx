import React, { useRef, useEffect } from 'react';
import { Play, ChevronUp, ChevronDown, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { GameState, Point, BonusBug, MapType } from '../types/game';

interface NokiaHandsetProps {
  gameState: GameState;
  score: number;
  highScore: number;
  snake: Point[];
  food: Point;
  bonusBug: BonusBug | null;
  direction: Point;
  currentMap: MapType;
  barriers: Point[];
  causeOfDeath?: 'wall' | 'self' | null;
  onStartGame: () => void;
  onPauseGame: () => void;
  onResumeGame: () => void;
  onSteer: (dir: Point) => void;
  onKeyClickFeedback: () => void;
}

export const NokiaHandset: React.FC<NokiaHandsetProps> = ({
  gameState,
  score,
  highScore,
  snake,
  food,
  bonusBug,
  direction,
  currentMap,
  barriers,
  causeOfDeath,
  onStartGame,
  onPauseGame,
  onResumeGame,
  onSteer,
  onKeyClickFeedback,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const GRID_SIZE = 20;
  const CANVAS_DIM = 400;
  const CELL_SIZE = CANVAS_DIM / GRID_SIZE; // 20px

  const formatScore = (val: number) => String(val).padStart(5, '0');

  // Render the canvas playfield
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    // 1. Clear background to authentic Nokia STN olive
    ctx.fillStyle = '#9bbc0f';
    ctx.fillRect(0, 0, CANVAS_DIM, CANVAS_DIM);

    // 2. Double border lines (LCD perimeter border)
    ctx.strokeStyle = '#0f380f';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, CANVAS_DIM - 2, CANVAS_DIM - 2);
    ctx.lineWidth = 1;
    ctx.strokeRect(4, 4, CANVAS_DIM - 8, CANVAS_DIM - 8);

    // 2.5 Render Map Static Internal Barriers (Nokia Brick Blocks)
    if (barriers && barriers.length > 0) {
      for (const b of barriers) {
        const bx = b.x * CELL_SIZE;
        const by = b.y * CELL_SIZE;

        // Solid brick body
        ctx.fillStyle = '#0f380f';
        ctx.fillRect(bx + 1, by + 1, CELL_SIZE - 2, CELL_SIZE - 2);

        // Authentic retro brick mortar pattern / center texture
        ctx.fillStyle = '#9bbc0f';
        ctx.fillRect(bx + 3, by + 3, 3, 3);
        ctx.fillRect(bx + CELL_SIZE - 6, by + 3, 3, 3);
        ctx.fillRect(bx + 3, by + CELL_SIZE - 6, 3, 3);
        ctx.fillRect(bx + CELL_SIZE - 6, by + CELL_SIZE - 6, 3, 3);
        ctx.fillRect(bx + 8, by + 8, 4, 4);
      }
    }

    // 3. Render Food Egg (Retro hollow diamond / cross cluster)
    const fx = food.x * CELL_SIZE;
    const fy = food.y * CELL_SIZE;
    const pad = 4;
    const innerSize = CELL_SIZE - pad * 2;

    ctx.fillStyle = '#0f380f';
    ctx.fillRect(fx + pad + 2, fy + pad, innerSize - 4, innerSize);
    ctx.fillRect(fx + pad, fy + pad + 2, innerSize, innerSize - 4);
    // Hollow center
    ctx.fillStyle = '#9bbc0f';
    ctx.fillRect(fx + pad + 4, fy + pad + 4, innerSize - 8, innerSize - 8);

    // 4. Render Bonus Bug (if active - classic Snake II creature!)
    if (bonusBug) {
      const bx = bonusBug.x * CELL_SIZE;
      const by = bonusBug.y * CELL_SIZE;
      ctx.fillStyle = '#0f380f';

      // Bug body
      ctx.fillRect(bx + 4, by + 4, 12, 12);
      // Bug antennae / legs
      ctx.fillRect(bx + 2, by + 2, 3, 3);
      ctx.fillRect(bx + 15, by + 2, 3, 3);
      ctx.fillRect(bx + 1, by + 9, 3, 2);
      ctx.fillRect(bx + 16, by + 9, 3, 2);
      ctx.fillRect(bx + 2, by + 15, 3, 3);
      ctx.fillRect(bx + 15, by + 15, 3, 3);

      // Flashing spot in bug
      if (Math.floor(Date.now() / 150) % 2 === 0) {
        ctx.fillStyle = '#9bbc0f';
        ctx.fillRect(bx + 7, by + 7, 6, 6);
      }
    }

    // 5. Render Snake Segments
    ctx.fillStyle = '#0f380f';
    for (let i = 0; i < snake.length; i++) {
      const seg = snake[i];
      const sx = seg.x * CELL_SIZE;
      const sy = seg.y * CELL_SIZE;

      if (i === 0) {
        // Head segment
        ctx.fillStyle = '#0f380f';
        ctx.fillRect(sx + 1, sy + 1, CELL_SIZE - 2, CELL_SIZE - 2);

        // Directional eyes (inverted green pixels)
        ctx.fillStyle = '#9bbc0f';
        if (direction.x === 1) {
          // Moving Right
          ctx.fillRect(sx + CELL_SIZE - 5, sy + 4, 2, 2);
          ctx.fillRect(sx + CELL_SIZE - 5, sy + CELL_SIZE - 6, 2, 2);
        } else if (direction.x === -1) {
          // Moving Left
          ctx.fillRect(sx + 3, sy + 4, 2, 2);
          ctx.fillRect(sx + 3, sy + CELL_SIZE - 6, 2, 2);
        } else if (direction.y === 1) {
          // Moving Down
          ctx.fillRect(sx + 4, sy + CELL_SIZE - 5, 2, 2);
          ctx.fillRect(sx + CELL_SIZE - 6, sy + CELL_SIZE - 5, 2, 2);
        } else if (direction.y === -1) {
          // Moving Up
          ctx.fillRect(sx + 4, sy + 3, 2, 2);
          ctx.fillRect(sx + CELL_SIZE - 6, sy + 3, 2, 2);
        }
      } else {
        // Body segment with 1px border gap for authentic tiled look
        ctx.fillStyle = '#0f380f';
        ctx.fillRect(sx + 1, sy + 1, CELL_SIZE - 2, CELL_SIZE - 2);

        // Subtle center pixel pattern for snakeskin scales
        if (i % 2 === 1) {
          ctx.fillStyle = '#9bbc0f';
          ctx.fillRect(sx + 9, sy + 9, 2, 2);
        }
      }
    }
  }, [snake, food, bonusBug, direction, gameState, barriers, currentMap]);

  // Handler for Navi button
  const handleNaviClick = () => {
    onKeyClickFeedback();
    if (gameState === 'START' || gameState === 'GAMEOVER') {
      onStartGame();
    } else if (gameState === 'PLAYING') {
      onPauseGame();
    } else if (gameState === 'PAUSED') {
      onResumeGame();
    }
  };

  const handleClearClick = () => {
    onKeyClickFeedback();
    if (gameState === 'PLAYING') {
      onPauseGame();
    } else if (gameState === 'PAUSED') {
      onResumeGame();
    }
  };

  const handleNumKey = (key: string) => {
    onKeyClickFeedback();
    if (key === '2') {
      if (gameState === 'START') onStartGame();
      else onSteer({ x: 0, y: -1 });
    } else if (key === '8') {
      if (gameState === 'START') onStartGame();
      else onSteer({ x: 0, y: 1 });
    } else if (key === '4') {
      if (gameState === 'START') onStartGame();
      else onSteer({ x: -1, y: 0 });
    } else if (key === '6') {
      if (gameState === 'START') onStartGame();
      else onSteer({ x: 1, y: 0 });
    } else if (key === '5') {
      if (gameState === 'START' || gameState === 'GAMEOVER') onStartGame();
      else if (gameState === 'PLAYING') onPauseGame();
      else if (gameState === 'PAUSED') onResumeGame();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Physical Nokia Chassis Container */}
      <div className="relative w-full max-w-[430px] rounded-3xl p-6 sm:p-7 flex flex-col items-center bg-[#243344] shadow-[0_30px_70px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.18),inset_0_-4px_6px_rgba(0,0,0,0.6)] select-none border border-[#3b4c5e]">
        {/* Outer Highlight Inset Ring simulation */}
        <div className="absolute inset-1.5 rounded-3xl pointer-events-none opacity-40 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]" />

        {/* TOP SPEAKER & BRANDING SECTION */}
        <div className="w-full flex flex-col items-center pt-2 pb-4">
          {/* Recessed Ear Speaker Pill Slit */}
          <div className="w-16 h-2 rounded-full bg-[#131b24] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.15)] mb-3 flex items-center justify-center">
            <div className="w-12 h-1 rounded-full bg-[#0a0f14] opacity-80" />
          </div>
          {/* Silver Embossed NOKIA Brand Name */}
          <div className="tracking-[0.28em] font-headline-md text-[17px] font-bold text-[#b4c4d4] drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)] flex items-center gap-1.5">
            <span>N</span>
            <span>O</span>
            <span>K</span>
            <span>I</span>
            <span>A</span>
          </div>
        </div>

        {/* LCD BEZEL ASSEMBLY (Matte Silver/Graphite Shield) */}
        <div className="w-full rounded-2xl bg-[#3a4856] p-3 shadow-[inset_0_3px_6px_rgba(0,0,0,0.7),0_2px_2px_rgba(255,255,255,0.15)] flex flex-col items-center border border-[#4b5b6b]">
          {/* Recessed Inner Protective Lens Frame */}
          <div className="w-full rounded-xl bg-[#18232e] p-2 shadow-[inset_0_4px_8px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col items-center border border-[#10171f]">
            {/* Subtle Glass Reflection Sheen across diagonal */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-20" />

            {/* AUTHENTIC MONOCHROME LCD DISPLAY (#9BBC0F background) */}
            <div className="relative w-full rounded-sm bg-[#9bbc0f] shadow-[inset_0_2px_4px_rgba(15,56,15,0.4)] overflow-hidden flex flex-col items-center">
              {/* Dot Matrix Subpixel Texture Layer */}
              <div
                className="absolute inset-0 pointer-events-none z-10 opacity-30"
                style={{
                  backgroundImage: 'radial-gradient(#0f380f 0.75px, transparent 0.75px)',
                  backgroundSize: '4px 4px',
                }}
              />

              {/* LCD Header Status Bar */}
              <div className="w-full flex items-center justify-between px-2.5 pt-1.5 pb-0.5 text-[#0f380f] font-headline-sm select-none z-10 border-b border-[#0f380f]/20">
                {/* Signal Antenna & 4 Bars */}
                <div className="flex items-center gap-1">
                  <span className="font-mono text-[11px] font-bold leading-none">▲</span>
                  <div className="flex items-end gap-[1.5px] h-3">
                    <div className="w-[2.5px] h-1 bg-[#0f380f]" />
                    <div className="w-[2.5px] h-1.5 bg-[#0f380f]" />
                    <div className="w-[2.5px] h-2 bg-[#0f380f]" />
                    <div className="w-[2.5px] h-2.5 bg-[#0f380f]" />
                  </div>
                </div>

                {/* Center Game Tag */}
                <span className="font-headline-sm text-headline-sm tracking-wider font-bold">
                  SNAKE II
                </span>

                {/* Battery Indicator: Shell with 4 Segments */}
                <div className="flex items-center gap-1">
                  <div className="flex items-center p-[1px] border border-[#0f380f] h-3 w-5 gap-[1px]">
                    <div className="w-[3px] h-full bg-[#0f380f]" />
                    <div className="w-[3px] h-full bg-[#0f380f]" />
                    <div className="w-[3px] h-full bg-[#0f380f]" />
                    <div className="w-[3px] h-full bg-[#0f380f]" />
                  </div>
                  <div className="w-[1.5px] h-1.5 bg-[#0f380f]" />
                </div>
              </div>

              {/* Sub-Header: Score & High Score Readout */}
              <div className="w-full flex items-center justify-between px-3 py-0.5 text-[#0f380f] font-headline-sm text-headline-sm z-10">
                <div className="flex items-center gap-1">
                  <span className="font-label-lcd-status text-label-lcd-status font-bold">SCR:</span>
                  <span className="font-bold tracking-wider">{formatScore(score)}</span>
                </div>
                {bonusBug && (
                  <div className="flex items-center gap-1 text-[10px] animate-pulse">
                    <span>🐞</span>
                    <span>+{bonusBug.points}</span>
                  </div>
                )}
                {!bonusBug && (
                  <div className="font-label-lcd-status text-label-lcd-status tracking-widest text-[#0f380f]/80">
                    MAP:{currentMap.toUpperCase()}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <span className="font-label-lcd-status text-label-lcd-status font-bold">HI:</span>
                  <span className="font-bold tracking-wider">{formatScore(highScore)}</span>
                </div>
              </div>

              {/* Canvas Playfield Area (20x20 Grid @ 400x400 Virtual) */}
              <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[360px] p-2 flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_DIM}
                  height={CANVAS_DIM}
                  className="w-full h-full block bg-[#9bbc0f]"
                />

                {/* In-LCD Interactive Overlay Modal (Start / Pause / Game Over) */}
                {gameState !== 'PLAYING' && (
                  <div className="absolute inset-4 z-20 flex flex-col items-center justify-center text-center p-3 transition-opacity">
                    <div className="bg-[#9bbc0f] p-3 shadow-md border-2 border-[#0f380f] flex flex-col items-center gap-2 max-w-[90%]">
                      <div className="font-headline-lg text-headline-lg text-[#0f380f] font-bold tracking-widest uppercase">
                        {gameState === 'START' && 'SNAKE II'}
                        {gameState === 'PAUSED' && 'PAUSED'}
                        {gameState === 'GAMEOVER' && 'GAME OVER'}
                      </div>

                      <div className="font-body-sm text-body-sm text-[#0f380f] font-bold uppercase leading-tight">
                        {gameState === 'START' && (
                          <div className="flex flex-col gap-0.5">
                            <span>MAP: {currentMap.toUpperCase()}</span>
                            <span>PRESS NAVI OR SPACE TO PLAY</span>
                          </div>
                        )}
                        {gameState === 'PAUSED' && 'PRESS SPACE TO RESUME'}
                        {gameState === 'GAMEOVER' && (
                          <div className="flex flex-col gap-1">
                            <span>SCORE: {formatScore(score)}</span>
                            {causeOfDeath === 'wall' && (
                              <span className="text-[10px] bg-[#0f380f] text-[#9bbc0f] px-1 py-0.5">
                                [ WALL / BARRIER CRASH ]
                              </span>
                            )}
                            {causeOfDeath === 'self' && (
                              <span className="text-[10px] bg-[#0f380f] text-[#9bbc0f] px-1 py-0.5">
                                [ SELF-BITE CRUNCH ]
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleNaviClick}
                        className="mt-1 px-3 py-1 bg-[#0f380f] text-[#9bbc0f] font-headline-sm text-headline-sm tracking-wider uppercase active:scale-95 transition-transform cursor-pointer border border-[#0f380f]"
                      >
                        {gameState === 'START' && 'START GAME'}
                        {gameState === 'PAUSED' && 'RESUME'}
                        {gameState === 'GAMEOVER' && 'PLAY AGAIN'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* LCD Bottom Navigation Guide Bar */}
              <div className="w-full flex items-center justify-between px-3 pb-1 text-[#0f380f] font-label-lcd-status text-label-lcd-status z-10 font-bold border-t border-[#0f380f]/10">
                <span>MENU</span>
                <span>SELECT</span>
                <span>BACK</span>
              </div>
            </div>
          </div>
        </div>

        {/* HARDWARE NAVIGATION CLUSTER (Navi-Key, Clear, Arrow Rockers) */}
        <div className="w-full mt-5 px-2 flex flex-col gap-3">
          {/* Upper Navigation Row: Clear / Navi-Key / Direction Scrollers */}
          <div className="grid grid-cols-12 gap-2 items-center">
            {/* Clear / C Key */}
            <button
              type="button"
              onClick={handleClearClick}
              title="Back / Clear"
              className="col-span-3 h-10 rounded-full bg-[#1b2530] text-[#8ea4be] hover:text-white flex items-center justify-center font-headline-md font-bold shadow-[0_4px_0_#0c1218,0_6px_10px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#0c1218] transition-all cursor-pointer border border-[#2b3a4a]"
            >
              C
            </button>

            {/* Main Navi-Key (Large Silver/Blue Pill Button) */}
            <button
              type="button"
              onClick={handleNaviClick}
              title="Primary Navi Confirm / Pause / Start"
              className="col-span-6 h-12 rounded-full bg-gradient-to-b from-[#415366] to-[#253240] text-[#e2ecf7] flex items-center justify-center font-headline-md text-headline-md font-bold shadow-[0_5px_0_#111922,0_8px_12px_rgba(0,0,0,0.6)] active:translate-y-1 active:shadow-[0_2px_0_#111922] transition-all cursor-pointer border border-[#52677d]"
            >
              <span className="flex items-center gap-1.5 tracking-wider uppercase text-xs">
                <Play className="w-3.5 h-3.5 fill-current" />
                NAVI
              </span>
            </button>

            {/* Secondary Up/Down Rocker Softkey */}
            <div className="col-span-3 h-10 rounded-full bg-[#1b2530] shadow-[0_4px_0_#0c1218,0_6px_10px_rgba(0,0,0,0.5)] flex items-center justify-around px-1 border border-[#2b3a4a]">
              <button
                type="button"
                onClick={() => {
                  onKeyClickFeedback();
                  if (gameState === 'START') onStartGame();
                  else onSteer({ x: 0, y: -1 });
                }}
                title="Up"
                className="w-1/2 h-full flex items-center justify-center text-[#8ea4be] hover:text-white active:scale-90 transition-transform cursor-pointer"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onKeyClickFeedback();
                  if (gameState === 'START') onStartGame();
                  else onSteer({ x: 0, y: 1 });
                }}
                title="Down"
                className="w-1/2 h-full flex items-center justify-center text-[#8ea4be] hover:text-white active:scale-90 transition-transform cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TACTILE NUMERIC KEYPAD (3x4 Layout with directional indicators on 2, 4, 6, 8) */}
          <div className="grid grid-cols-3 gap-2.5 mt-2">
            {/* 1 */}
            <button
              type="button"
              onClick={() => handleNumKey('1')}
              className="h-11 rounded-lg bg-[#1e2a36] text-[#b8c8dc] hover:text-white flex flex-col items-center justify-center shadow-[0_4px_0_#0f1720,0_5px_8px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#0f1720] transition-all cursor-pointer border border-[#2c3d4e]"
            >
              <span className="font-label-keypad text-label-keypad font-bold">1</span>
              <span className="font-label-keypad-sub text-label-keypad-sub text-[#8c9387] tracking-wider">
                . _ @
              </span>
            </button>

            {/* 2 (UP ARROW) */}
            <button
              type="button"
              onClick={() => handleNumKey('2')}
              title="Steer Up (2)"
              className="h-11 rounded-lg bg-[#27384a] text-[#b2d42f] hover:text-white flex flex-col items-center justify-center shadow-[0_4px_0_#0f1720,0_5px_8px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#0f1720] transition-all group cursor-pointer border border-[#3d5168]"
            >
              <div className="flex items-center gap-0.5">
                <span className="font-label-keypad text-label-keypad font-bold">2</span>
                <ArrowUp className="w-3 h-3 text-[#b2d42f]" />
              </div>
              <span className="font-label-keypad-sub text-label-keypad-sub text-[#8c9387] group-hover:text-[#b2d42f] tracking-widest uppercase">
                ABC
              </span>
            </button>

            {/* 3 */}
            <button
              type="button"
              onClick={() => handleNumKey('3')}
              className="h-11 rounded-lg bg-[#1e2a36] text-[#b8c8dc] hover:text-white flex flex-col items-center justify-center shadow-[0_4px_0_#0f1720,0_5px_8px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#0f1720] transition-all cursor-pointer border border-[#2c3d4e]"
            >
              <span className="font-label-keypad text-label-keypad font-bold">3</span>
              <span className="font-label-keypad-sub text-label-keypad-sub text-[#8c9387] tracking-widest uppercase">
                DEF
              </span>
            </button>

            {/* 4 (LEFT ARROW) */}
            <button
              type="button"
              onClick={() => handleNumKey('4')}
              title="Steer Left (4)"
              className="h-11 rounded-lg bg-[#27384a] text-[#b2d42f] hover:text-white flex flex-col items-center justify-center shadow-[0_4px_0_#0f1720,0_5px_8px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#0f1720] transition-all group cursor-pointer border border-[#3d5168]"
            >
              <div className="flex items-center gap-0.5">
                <ArrowLeft className="w-3 h-3 text-[#b2d42f]" />
                <span className="font-label-keypad text-label-keypad font-bold">4</span>
              </div>
              <span className="font-label-keypad-sub text-label-keypad-sub text-[#8c9387] group-hover:text-[#b2d42f] tracking-widest uppercase">
                GHI
              </span>
            </button>

            {/* 5 (CENTER ACTION) */}
            <button
              type="button"
              onClick={() => handleNumKey('5')}
              title="Action / Pause (5)"
              className="h-11 rounded-lg bg-[#1e2a36] text-[#b8c8dc] hover:text-white flex flex-col items-center justify-center shadow-[0_4px_0_#0f1720,0_5px_8px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#0f1720] transition-all cursor-pointer border border-[#2c3d4e]"
            >
              <span className="font-label-keypad text-label-keypad font-bold">5</span>
              <span className="font-label-keypad-sub text-label-keypad-sub text-[#8c9387] tracking-widest uppercase">
                JKL
              </span>
            </button>

            {/* 6 (RIGHT ARROW) */}
            <button
              type="button"
              onClick={() => handleNumKey('6')}
              title="Steer Right (6)"
              className="h-11 rounded-lg bg-[#27384a] text-[#b2d42f] hover:text-white flex flex-col items-center justify-center shadow-[0_4px_0_#0f1720,0_5px_8px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#0f1720] transition-all group cursor-pointer border border-[#3d5168]"
            >
              <div className="flex items-center gap-0.5">
                <span className="font-label-keypad text-label-keypad font-bold">6</span>
                <ArrowRight className="w-3 h-3 text-[#b2d42f]" />
              </div>
              <span className="font-label-keypad-sub text-label-keypad-sub text-[#8c9387] group-hover:text-[#b2d42f] tracking-widest uppercase">
                MNO
              </span>
            </button>

            {/* 7 */}
            <button
              type="button"
              onClick={() => handleNumKey('7')}
              className="h-11 rounded-lg bg-[#1e2a36] text-[#b8c8dc] hover:text-white flex flex-col items-center justify-center shadow-[0_4px_0_#0f1720,0_5px_8px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#0f1720] transition-all cursor-pointer border border-[#2c3d4e]"
            >
              <span className="font-label-keypad text-label-keypad font-bold">7</span>
              <span className="font-label-keypad-sub text-label-keypad-sub text-[#8c9387] tracking-widest uppercase">
                PQRS
              </span>
            </button>

            {/* 8 (DOWN ARROW) */}
            <button
              type="button"
              onClick={() => handleNumKey('8')}
              title="Steer Down (8)"
              className="h-11 rounded-lg bg-[#27384a] text-[#b2d42f] hover:text-white flex flex-col items-center justify-center shadow-[0_4px_0_#0f1720,0_5px_8px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#0f1720] transition-all group cursor-pointer border border-[#3d5168]"
            >
              <div className="flex items-center gap-0.5">
                <span className="font-label-keypad text-label-keypad font-bold">8</span>
                <ArrowDown className="w-3 h-3 text-[#b2d42f]" />
              </div>
              <span className="font-label-keypad-sub text-label-keypad-sub text-[#8c9387] group-hover:text-[#b2d42f] tracking-widest uppercase">
                TUV
              </span>
            </button>

            {/* 9 */}
            <button
              type="button"
              onClick={() => handleNumKey('9')}
              className="h-11 rounded-lg bg-[#1e2a36] text-[#b8c8dc] hover:text-white flex flex-col items-center justify-center shadow-[0_4px_0_#0f1720,0_5px_8px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#0f1720] transition-all cursor-pointer border border-[#2c3d4e]"
            >
              <span className="font-label-keypad text-label-keypad font-bold">9</span>
              <span className="font-label-keypad-sub text-label-keypad-sub text-[#8c9387] tracking-widest uppercase">
                WXYZ
              </span>
            </button>

            {/* * */}
            <button
              type="button"
              onClick={() => handleNumKey('*')}
              className="h-11 rounded-lg bg-[#1e2a36] text-[#b8c8dc] hover:text-white flex flex-col items-center justify-center shadow-[0_4px_0_#0f1720,0_5px_8px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#0f1720] transition-all cursor-pointer border border-[#2c3d4e]"
            >
              <span className="font-label-keypad text-label-keypad font-bold">*</span>
              <span className="font-label-keypad-sub text-label-keypad-sub text-[#8c9387]">♫</span>
            </button>

            {/* 0 */}
            <button
              type="button"
              onClick={() => handleNumKey('0')}
              className="h-11 rounded-lg bg-[#1e2a36] text-[#b8c8dc] hover:text-white flex flex-col items-center justify-center shadow-[0_4px_0_#0f1720,0_5px_8px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#0f1720] transition-all cursor-pointer border border-[#2c3d4e]"
            >
              <span className="font-label-keypad text-label-keypad font-bold">0</span>
              <span className="font-label-keypad-sub text-label-keypad-sub text-[#8c9387]">␣</span>
            </button>

            {/* # */}
            <button
              type="button"
              onClick={() => handleNumKey('#')}
              className="h-11 rounded-lg bg-[#1e2a36] text-[#b8c8dc] hover:text-white flex flex-col items-center justify-center shadow-[0_4px_0_#0f1720,0_5px_8px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#0f1720] transition-all cursor-pointer border border-[#2c3d4e]"
            >
              <span className="font-label-keypad text-label-keypad font-bold">#</span>
              <span className="font-label-keypad-sub text-label-keypad-sub text-[#8c9387]">⇧</span>
            </button>
          </div>
        </div>

        {/* Bottom Micro-Hole & Lanyard Cutout */}
        <div className="mt-4 flex items-center justify-center gap-3 opacity-60">
          <div className="w-1.5 h-1.5 rounded-full bg-[#111922] shadow-inner" />
          <div className="w-2.5 h-1 rounded-full bg-[#111922] shadow-inner" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#111922] shadow-inner" />
        </div>
      </div>
    </div>
  );
};
