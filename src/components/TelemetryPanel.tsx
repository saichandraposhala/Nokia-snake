import React from 'react';
import { Activity, Keyboard, Terminal } from 'lucide-react';
import { GameTelemetry } from '../types/game';

interface TelemetryPanelProps {
  telemetry: GameTelemetry;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ telemetry }) => {
  const formatScore = (val: number) => String(val).padStart(5, '0');

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Live Telemetry Card */}
      <div className="p-5 rounded-lg bg-[#152031] border border-[#1f2a3c] flex flex-col gap-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#a4d39a]" />
            <h2 className="font-headline-md text-headline-md uppercase text-[#d8e3fb]">
              Game Telemetry
            </h2>
          </div>
          <span className="font-label-lcd-status text-label-lcd-status text-[#c2c9bc] tracking-wider px-1.5 py-0.5 rounded bg-[#040e1f] border border-[#1f2a3c]">
            REALTIME
          </span>
        </div>

        {/* 4 Stat Boxes */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded bg-[#111c2d] border border-[#1f2a3c]/60 flex flex-col gap-1">
            <span className="font-label-lcd-status text-label-lcd-status uppercase text-[#c2c9bc]">
              Current Tick
            </span>
            <span className="font-headline-md text-headline-md text-[#a4d39a]">
              {telemetry.currentTick} ms
            </span>
          </div>

          <div className="p-3 rounded bg-[#111c2d] border border-[#1f2a3c]/60 flex flex-col gap-1">
            <span className="font-label-lcd-status text-label-lcd-status uppercase text-[#c2c9bc]">
              Velocity
            </span>
            <span className="font-headline-md text-headline-md text-[#b2d42f]">
              {telemetry.velocity.toFixed(1)} t/s
            </span>
          </div>

          <div className="p-3 rounded bg-[#111c2d] border border-[#1f2a3c]/60 flex flex-col gap-1">
            <span className="font-label-lcd-status text-label-lcd-status uppercase text-[#c2c9bc]">
              Eggs Eaten
            </span>
            <span className="font-headline-md text-headline-md text-[#d8e3fb]">
              {telemetry.eggsEaten}
            </span>
          </div>

          <div className="p-3 rounded bg-[#111c2d] border border-[#1f2a3c]/60 flex flex-col gap-1">
            <span className="font-label-lcd-status text-label-lcd-status uppercase text-[#c2c9bc]">
              Snake Length
            </span>
            <span className="font-headline-md text-headline-md text-[#d8e3fb]">
              {telemetry.snakeLength} cells
            </span>
          </div>
        </div>

        {/* Grid Density / Coverage */}
        <div className="p-3 rounded bg-[#111c2d] border border-[#1f2a3c]/60 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="font-label-lcd-status text-label-lcd-status uppercase text-[#c2c9bc]">
              Grid Density / Coverage
            </span>
            <span className="font-body-md text-body-md text-[#a4d39a]">
              {telemetry.gridCoverage.toFixed(2)}%
            </span>
          </div>
          <div className="w-full h-2 rounded bg-[#2a3548] overflow-hidden">
            <div
              className="h-full bg-[#a4d39a] transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0.75, telemetry.gridCoverage))}%` }}
            />
          </div>
        </div>

        {/* Session High Score Comparison */}
        <div className="p-3 rounded bg-[#111c2d] border border-[#1f2a3c]/60 flex flex-col gap-2">
          <span className="font-label-lcd-status text-label-lcd-status uppercase text-[#c2c9bc]">
            Current Session Record
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-body-md text-body-md text-[#d8e3fb]">Active Session</span>
            <span className="font-headline-md text-headline-md text-[#a4d39a]">
              {formatScore(telemetry.sessionScore)}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-body-md text-body-md text-[#c2c9bc]">All-Time High</span>
            <span className="font-headline-md text-headline-md text-[#b2d42f]">
              {formatScore(telemetry.highScore)}
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1 border-t border-[#1f2a3c]/40">
            <span className="font-body-md text-body-md text-[#c2c9bc]">Active Layout</span>
            <span className="font-headline-sm text-xs text-[#a4d39a] uppercase">
              {telemetry.currentMap}
            </span>
          </div>
        </div>
      </div>

      {/* Controls Reference Card */}
      <div className="p-5 rounded-lg bg-[#152031] border border-[#1f2a3c] flex flex-col gap-4 shadow-md">
        <div className="flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-[#b2d42f]" />
          <h3 className="font-headline-md text-headline-md uppercase text-[#d8e3fb]">
            Input Protocol
          </h3>
        </div>
        <div className="flex flex-col gap-2 font-body-sm text-body-sm text-[#c2c9bc]">
          <div className="flex justify-between items-center py-1 border-b border-[#1f2a3c]/40">
            <span className="text-[#d8e3fb] font-body-md">Arrow Keys / WASD</span>
            <span className="px-2 py-0.5 rounded bg-[#2a3548] text-[#a4d39a] font-mono text-[10px]">
              Steer Snake
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-[#1f2a3c]/40">
            <span className="text-[#d8e3fb] font-body-md">Numpad [2, 4, 6, 8]</span>
            <span className="px-2 py-0.5 rounded bg-[#2a3548] text-[#b2d42f] font-mono text-[10px]">
              Nokia Classic
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-[#1f2a3c]/40">
            <span className="text-[#d8e3fb] font-body-md">Spacebar</span>
            <span className="px-2 py-0.5 rounded bg-[#2a3548] text-[#d8e3fb] font-mono text-[10px]">
              Start / Pause
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[#d8e3fb] font-body-md">Enter / Navi-Key</span>
            <span className="px-2 py-0.5 rounded bg-[#2a3548] text-[#d8e3fb] font-mono text-[10px]">
              Accept / Restart
            </span>
          </div>
        </div>
      </div>

      {/* System Architecture Badge */}
      <div className="p-4 rounded-lg bg-[#040e1f] border border-[#152031] flex items-center gap-3">
        <Terminal className="w-6 h-6 text-[#a4d39a] shrink-0" />
        <div className="flex flex-col">
          <span className="font-headline-sm text-headline-sm text-[#d8e3fb] uppercase">
            Discrete Tick Loop
          </span>
          <span className="font-body-sm text-body-sm text-[#c2c9bc]">
            FIFO Input Buffer prevents self-inversion collisions
          </span>
        </div>
      </div>
    </div>
  );
};
