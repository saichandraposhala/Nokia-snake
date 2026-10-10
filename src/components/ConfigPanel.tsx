import React, { useState } from 'react';
import { Sliders, Square, Repeat, Volume2, RotateCcw, Bug, History, Grid, LayoutGrid, Columns, PlusCircle, Maximize2 } from 'lucide-react';
import { DifficultyPreset, WallMode, MapType } from '../types/game';
import { MAP_LIST, GAME_MAPS } from '../utils/maps';

interface ConfigPanelProps {
  difficulty: DifficultyPreset;
  onDifficultyChange: (diff: DifficultyPreset) => void;
  wallMode: WallMode;
  onWallModeChange: (mode: WallMode) => void;
  currentMap: MapType;
  onMapChange: (map: MapType) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  bonusBugEnabled: boolean;
  onToggleBonusBug: () => void;
  onResetHighScore: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  difficulty,
  onDifficultyChange,
  wallMode,
  onWallModeChange,
  currentMap,
  onMapChange,
  soundEnabled,
  onToggleSound,
  bonusBugEnabled,
  onToggleBonusBug,
  onResetHighScore,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleConfirmReset = () => {
    onResetHighScore();
    setShowConfirmReset(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Game Configuration Card */}
      <div className="p-5 rounded-lg bg-[#152031] border border-[#1f2a3c] flex flex-col gap-5 shadow-md">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#a4d39a]" />
          <h2 className="font-headline-md text-headline-md uppercase text-[#d8e3fb]">
            Configuration
          </h2>
        </div>

        {/* Game Map Layout Selector */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-lcd-status text-label-lcd-status uppercase text-[#c2c9bc]">
              Game Map / Maze Layout
            </span>
            <span className="text-[10px] text-[#a4d39a] font-mono">
              {GAME_MAPS[currentMap].barriers.length} BARRIERS
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-1 rounded bg-[#111c2d] border border-[#1f2a3c]/60">
            {MAP_LIST.map((m) => {
              const isActive = currentMap === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onMapChange(m.id)}
                  title={m.description}
                  className={`px-2 py-1.5 rounded flex flex-col items-center justify-center gap-0.5 text-center transition-all active:scale-95 cursor-pointer ${
                    isActive
                      ? 'bg-[#0f380f] text-[#a4d39a] border border-[#a4d39a]/40 font-bold shadow-sm'
                      : 'text-[#c2c9bc] hover:text-[#d8e3fb] hover:bg-[#152031]'
                  }`}
                >
                  <span className="font-headline-sm text-[11px] uppercase tracking-wider">
                    {m.label}
                  </span>
                  <span className="text-[9px] text-[#8c9387] opacity-80">
                    {m.barriers.length === 0 ? 'No Walls' : `${m.barriers.length} Bricks`}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="font-body-sm text-[11px] text-[#c2c9bc] leading-tight px-1 italic">
            {GAME_MAPS[currentMap].description}
          </p>
        </div>

        {/* Difficulty Preset */}
        <div className="flex flex-col gap-2">
          <span className="font-label-lcd-status text-label-lcd-status uppercase text-[#c2c9bc]">
            Difficulty / Base Velocity
          </span>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded bg-[#111c2d] border border-[#1f2a3c]/60">
            <button
              type="button"
              onClick={() => onDifficultyChange('casual')}
              className={`px-2 py-1.5 rounded text-center font-headline-sm text-headline-sm transition-all active:scale-95 ${
                difficulty === 'casual'
                  ? 'bg-[#0f380f] text-[#a4d39a] border border-[#a4d39a]/40 font-bold shadow-sm'
                  : 'text-[#c2c9bc] hover:text-[#d8e3fb]'
              }`}
            >
              180ms
            </button>
            <button
              type="button"
              onClick={() => onDifficultyChange('classic')}
              className={`px-2 py-1.5 rounded text-center font-headline-sm text-headline-sm transition-all active:scale-95 ${
                difficulty === 'classic'
                  ? 'bg-[#0f380f] text-[#a4d39a] border border-[#a4d39a]/40 font-bold shadow-sm'
                  : 'text-[#c2c9bc] hover:text-[#d8e3fb]'
              }`}
            >
              150ms
            </button>
            <button
              type="button"
              onClick={() => onDifficultyChange('turbo')}
              className={`px-2 py-1.5 rounded text-center font-headline-sm text-headline-sm transition-all active:scale-95 ${
                difficulty === 'turbo'
                  ? 'bg-[#0f380f] text-[#a4d39a] border border-[#a4d39a]/40 font-bold shadow-sm'
                  : 'text-[#c2c9bc] hover:text-[#d8e3fb]'
              }`}
            >
              90ms
            </button>
          </div>
        </div>

        {/* Boundary Physics Mode */}
        <div className="flex flex-col gap-2">
          <span className="font-label-lcd-status text-label-lcd-status uppercase text-[#c2c9bc]">
            Boundary Physics
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onWallModeChange('solid')}
              className={`p-2.5 rounded flex flex-col items-center gap-1.5 text-center font-headline-sm text-headline-sm transition-all active:scale-95 ${
                wallMode === 'solid'
                  ? 'bg-[#0f380f] text-[#a4d39a] border border-[#a4d39a]/40 font-bold shadow-sm'
                  : 'bg-[#111c2d] border border-[#1f2a3c]/60 text-[#c2c9bc] hover:text-[#d8e3fb]'
              }`}
            >
              <Square className="w-4 h-4" />
              <span>SOLID WALLS</span>
            </button>

            <button
              type="button"
              onClick={() => onWallModeChange('wrap')}
              className={`p-2.5 rounded flex flex-col items-center gap-1.5 text-center font-headline-sm text-headline-sm transition-all active:scale-95 ${
                wallMode === 'wrap'
                  ? 'bg-[#0f380f] text-[#a4d39a] border border-[#a4d39a]/40 font-bold shadow-sm'
                  : 'bg-[#111c2d] border border-[#1f2a3c]/60 text-[#c2c9bc] hover:text-[#d8e3fb]'
              }`}
            >
              <Repeat className="w-4 h-4" />
              <span>WRAP-AROUND</span>
            </button>
          </div>
        </div>

        {/* Monophonic Audio Switch */}
        <div className="flex items-center justify-between p-3 rounded bg-[#111c2d] border border-[#1f2a3c]/60">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-5 h-5 text-[#b2d42f]" />
            <div className="flex flex-col">
              <span className="font-body-md text-body-md text-[#d8e3fb]">Monophonic Audio</span>
              <span className="font-body-sm text-body-sm text-[#c2c9bc]">8-bit Piezo Buzzer</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleSound}
            aria-label="Toggle Sound"
            className={`w-10 h-6 rounded-full p-0.5 flex items-center transition-colors ${
              soundEnabled ? 'bg-[#94b500] justify-end' : 'bg-[#2a3548] justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-[#081425] shadow-md" />
          </button>
        </div>

        {/* Bonus Bug Feature Toggle */}
        <div className="flex items-center justify-between p-3 rounded bg-[#111c2d] border border-[#1f2a3c]/60">
          <div className="flex items-center gap-2.5">
            <Bug className="w-5 h-5 text-[#a4d39a]" />
            <div className="flex flex-col">
              <span className="font-body-md text-body-md text-[#d8e3fb]">Bonus Insects</span>
              <span className="font-body-sm text-body-sm text-[#c2c9bc]">Snake II Timed Bugs</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleBonusBug}
            aria-label="Toggle Bonus Insects"
            className={`w-10 h-6 rounded-full p-0.5 flex items-center transition-colors ${
              bonusBugEnabled ? 'bg-[#94b500] justify-end' : 'bg-[#2a3548] justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-[#081425] shadow-md" />
          </button>
        </div>

        {/* High Score Management */}
        <div className="pt-1 flex flex-col gap-2">
          {!showConfirmReset ? (
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="w-full py-2 px-3 rounded bg-[#1f2a3c] hover:bg-[#93000a] hover:text-[#ffdad6] text-[#c2c9bc] transition-all font-headline-sm text-headline-sm uppercase flex items-center justify-center gap-2 active:scale-95 border border-[#2a3548]"
            >
              <RotateCcw className="w-4 h-4" />
              CLEAR RECORD DATA
            </button>
          ) : (
            <div className="p-3 rounded bg-[#2a1215] border border-[#93000a] flex flex-col gap-2 text-center">
              <span className="font-body-sm text-body-sm text-[#ffb4ab]">
                Are you sure you want to erase all high scores?
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="py-1 px-2 rounded bg-[#93000a] text-[#ffdad6] font-headline-sm text-xs uppercase"
                >
                  YES, ERASE
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="py-1 px-2 rounded bg-[#1f2a3c] text-[#d8e3fb] font-headline-sm text-xs uppercase"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Classic Heritage Information */}
      <div className="p-5 rounded-lg bg-[#152031] border border-[#1f2a3c] flex flex-col gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#a4d39a]" />
          <h3 className="font-headline-md text-headline-md uppercase text-[#d8e3fb]">
            Device Spec
          </h3>
        </div>
        <p className="font-body-sm text-body-sm text-[#c2c9bc] leading-relaxed">
          The Nokia 3310 (announced Sep 2000) featured an 84×48 monochromatic LCD and PCD8544 controller. Snake II was programmed by Taneli Armanto, introducing wrap-around mazes, bonus insects, and customizable game speeds.
        </p>
        <div className="flex items-center justify-between font-label-lcd-status text-label-lcd-status text-[#a4d39a] pt-1 border-t border-[#1f2a3c]/60">
          <span>GRID: 20 × 20 COORD</span>
          <span>PIXEL RATIO: 1:1</span>
        </div>
      </div>
    </div>
  );
};
