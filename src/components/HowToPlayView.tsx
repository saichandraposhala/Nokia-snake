import React from 'react';
import { Cpu, Gamepad2, Sparkles, BookOpen, Layers, ShieldCheck, Zap } from 'lucide-react';

interface HowToPlayViewProps {
  onPlayClick: () => void;
}

export const HowToPlayView: React.FC<HowToPlayViewProps> = ({ onPlayClick }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Hero Intro */}
      <div className="p-6 sm:p-8 rounded-xl bg-[#152031] border border-[#1f2a3c] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-[#0f380f] flex items-center justify-center text-[#a4d39a] border border-[#a4d39a]/40 shadow-inner shrink-0">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="font-headline-lg text-xl sm:text-2xl text-[#a4d39a] uppercase tracking-wide">
                Nokia 3310 Architecture & Specs
              </h1>
              <span className="px-2 py-0.5 rounded bg-[#b2d42f]/15 text-[#b2d42f] font-label-lcd-status text-label-lcd-status uppercase tracking-widest border border-[#b2d42f]/30">
                1999 MANUAL
              </span>
            </div>
            <p className="font-body-md text-body-md text-[#c2c9bc]">
              Comprehensive technical specification and gameplay protocol for the classic Snake II ROM engine.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onPlayClick}
          className="px-5 py-2.5 rounded bg-[#0f380f] hover:bg-[#1a551a] text-[#a4d39a] border border-[#a4d39a]/50 font-headline-md text-headline-md uppercase transition-all active:scale-95 shadow-md whitespace-nowrap"
        >
          PLAY NOW
        </button>
      </div>

      {/* Grid of Spec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hardware Specifications */}
        <div className="p-6 rounded-xl bg-[#152031] border border-[#1f2a3c] flex flex-col gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6 text-[#a4d39a]" />
            <h2 className="font-headline-md text-headline-md uppercase text-[#d8e3fb]">
              Hardware Architecture
            </h2>
          </div>
          <div className="flex flex-col gap-3 font-body-sm text-body-sm text-[#c2c9bc]">
            <div className="p-3 rounded bg-[#081425] border border-[#1f2a3c] flex flex-col gap-1">
              <span className="font-headline-sm text-xs text-[#a4d39a] uppercase">Display Controller</span>
              <p>Philips PCD8544 48×84 pixel monochrome LCD controller with serial SPI interface and passive STN reflective matrix.</p>
            </div>
            <div className="p-3 rounded bg-[#081425] border border-[#1f2a3c] flex flex-col gap-1">
              <span className="font-headline-sm text-xs text-[#b2d42f] uppercase">Processing Unit</span>
              <p>Texas Instruments MAD2WD1 (ARM7TDMI 13 MHz core) paired with 2 MB NOR Flash ROM and 384 KB SRAM.</p>
            </div>
            <div className="p-3 rounded bg-[#081425] border border-[#1f2a3c] flex flex-col gap-1">
              <span className="font-headline-sm text-xs text-[#d8e3fb] uppercase">Acoustic Transducer</span>
              <p>Monophonic piezo-electric buzzer driven by hardware PWM square-wave synthesis (200 Hz – 2000 Hz).</p>
            </div>
          </div>
        </div>

        {/* Game Rules & Mechanics */}
        <div className="p-6 rounded-xl bg-[#152031] border border-[#1f2a3c] flex flex-col gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-6 h-6 text-[#b2d42f]" />
            <h2 className="font-headline-md text-headline-md uppercase text-[#d8e3fb]">
              Snake II Gameplay Protocol
            </h2>
          </div>
          <div className="flex flex-col gap-3 font-body-sm text-body-sm text-[#c2c9bc]">
            <div className="p-3 rounded bg-[#081425] border border-[#1f2a3c] flex flex-col gap-1">
              <span className="font-headline-sm text-xs text-[#a4d39a] uppercase">Base Objective</span>
              <p>Steer the snake across the 20×20 coordinate field to consume eggs. Each egg eaten extends the snake length by 1 cell and awards 10 points.</p>
            </div>
            <div className="p-3 rounded bg-[#081425] border border-[#1f2a3c] flex flex-col gap-1">
              <span className="font-headline-sm text-xs text-[#b2d42f] uppercase">Velocity Scaling</span>
              <p>Each egg devoured accelerates the game loop clock by 2 ms down to a lightning-fast 70 ms ceiling.</p>
            </div>
            <div className="p-3 rounded bg-[#081425] border border-[#1f2a3c] flex flex-col gap-1">
              <span className="font-headline-sm text-xs text-[#d8e3fb] uppercase">Bonus Insects</span>
              <p>Periodically, an insect appears with an active countdown. Consuming it before it flees awards huge bonus points (50–100 pts)!</p>
            </div>
          </div>
        </div>

        {/* Input Controls Matrix */}
        <div className="p-6 rounded-xl bg-[#152031] border border-[#1f2a3c] flex flex-col gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-[#a4d39a]" />
            <h2 className="font-headline-md text-headline-md uppercase text-[#d8e3fb]">
              Control Matrix
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-[#c2c9bc] border-collapse">
              <thead>
                <tr className="border-b border-[#1f2a3c] text-[#a4d39a]">
                  <th className="py-2 px-3">Action</th>
                  <th className="py-2 px-3">Keyboard</th>
                  <th className="py-2 px-3">Nokia Keypad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2a3c]/60">
                <tr>
                  <td className="py-2 px-3 text-[#d8e3fb] font-bold">Steer Up</td>
                  <td className="py-2 px-3">Arrow Up / W</td>
                  <td className="py-2 px-3 text-[#b2d42f] font-bold">Key 2 (▲)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-[#d8e3fb] font-bold">Steer Down</td>
                  <td className="py-2 px-3">Arrow Down / S</td>
                  <td className="py-2 px-3 text-[#b2d42f] font-bold">Key 8 (▼)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-[#d8e3fb] font-bold">Steer Left</td>
                  <td className="py-2 px-3">Arrow Left / A</td>
                  <td className="py-2 px-3 text-[#b2d42f] font-bold">Key 4 (◀)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-[#d8e3fb] font-bold">Steer Right</td>
                  <td className="py-2 px-3">Arrow Right / D</td>
                  <td className="py-2 px-3 text-[#b2d42f] font-bold">Key 6 (▶)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-[#d8e3fb] font-bold">Start / Pause</td>
                  <td className="py-2 px-3">Spacebar / Enter</td>
                  <td className="py-2 px-3 text-[#a4d39a] font-bold">NAVI / Key 5</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-[#d8e3fb] font-bold">Clear / Exit</td>
                  <td className="py-2 px-3">Escape</td>
                  <td className="py-2 px-3 text-red-300 font-bold">C Button</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Game Map Layouts & Maze Architecture */}
        <div className="p-6 rounded-xl bg-[#152031] border border-[#1f2a3c] flex flex-col gap-4 shadow-md md:col-span-2">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-[#a4d39a]" />
            <h2 className="font-headline-md text-headline-md uppercase text-[#d8e3fb]">
              Game Map Layouts & Static Barrier Modes
            </h2>
          </div>
          <p className="font-body-sm text-body-sm text-[#c2c9bc]">
            Inspired by Taneli Armanto's authentic Snake II maze packs, you can select from 5 tactical screen layouts:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-3 rounded bg-[#081425] border border-[#1f2a3c] flex flex-col gap-1">
              <span className="font-headline-sm text-xs text-[#a4d39a] uppercase">1. Classic Open</span>
              <p className="text-xs text-[#c2c9bc]">Zero static barriers. Pure open-field reflex challenges across 400 cells.</p>
            </div>
            <div className="p-3 rounded bg-[#081425] border border-[#1f2a3c] flex flex-col gap-1">
              <span className="font-headline-sm text-xs text-[#b2d42f] uppercase">2. Twin Pillars</span>
              <p className="text-xs text-[#c2c9bc]">Two vertical monolith barriers forming 3 narrow high-speed corridors.</p>
            </div>
            <div className="p-3 rounded bg-[#081425] border border-[#1f2a3c] flex flex-col gap-1">
              <span className="font-headline-sm text-xs text-[#d8e3fb] uppercase">3. Four Bastions</span>
              <p className="text-xs text-[#c2c9bc]">Corner fortification L-brackets penalizing wide drift turns on edges.</p>
            </div>
            <div className="p-3 rounded bg-[#081425] border border-[#1f2a3c] flex flex-col gap-1">
              <span className="font-headline-sm text-xs text-[#a4d39a] uppercase">4. Crossroads Maze</span>
              <p className="text-xs text-[#c2c9bc]">Cruciform central gates partitioning the playfield into 4 sectors.</p>
            </div>
            <div className="p-3 rounded bg-[#081425] border border-[#1f2a3c] flex flex-col gap-1">
              <span className="font-headline-sm text-xs text-[#b2d42f] uppercase">5. Inner Sanctum</span>
              <p className="text-xs text-[#c2c9bc]">Fortified center box ring with 4 narrow entry portals for high risk runs.</p>
            </div>
          </div>
        </div>

        {/* Heritage & Historical Trivia */}
        <div className="p-6 rounded-xl bg-[#152031] border border-[#1f2a3c] flex flex-col gap-4 shadow-md md:col-span-2">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#b2d42f]" />
            <h2 className="font-headline-md text-headline-md uppercase text-[#d8e3fb]">
              The Armanto Legacy
            </h2>
          </div>
          <div className="font-body-sm text-body-sm text-[#c2c9bc] leading-relaxed flex flex-col gap-3">
            <p>
              In 1997, Finnish design engineer <strong className="text-[#a4d39a]">Taneli Armanto</strong> created Snake for the Nokia 6110, aiming to test infrared two-player communication. The simplicity and addictive risk-reward loops turned it into a global phenomenon.
            </p>
            <p>
              When the <strong className="text-[#d8e3fb]">Nokia 3310</strong> launched in September 2000, it included <strong className="text-[#b2d42f]">Snake II</strong>, which introduced maze borders, wrap-around toroidal geometry, and scurrying bonus bugs.
            </p>
            <div className="p-3 rounded bg-[#081425] border border-[#1f2a3c] flex items-center gap-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-[#a4d39a] shrink-0" />
              <span>Over 350 million Nokia 3310 devices were manufactured worldwide, making Snake II one of the most played video games in human history.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
