import React from 'react';
import { Keyboard, Zap, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#040e1f] text-[#c2c9bc] py-6 border-t border-[#152031] shadow-[0_-1px_12px_rgba(0,0,0,0.6)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Keyboard Controls */}
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Keyboard className="w-4 h-4 text-[#a4d39a]" />
            <span className="font-headline-sm text-headline-sm text-[#d8e3fb] uppercase">
              Keyboard Controls
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-[#c2c9bc]">
            [2, 4, 6, 8] or [Arrow Keys] to Turn • [Space / Soft-R] to Pause • [Enter / Navi-Key] to Restart / Accept
          </p>
        </div>

        {/* Center: Specs Badges */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <div className="flex items-center gap-1.5 text-[#c2c9bc]">
            <Zap className="w-4 h-4 text-[#a4d39a]" />
            <span className="font-body-sm text-body-sm">84×48 Integer Scale</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#c2c9bc]">
            <Cpu className="w-4 h-4 text-[#b2d42f]" />
            <span className="font-body-sm text-body-sm">Web Audio Synthesizer</span>
          </div>
        </div>

        {/* Right: Copyright & Initiative */}
        <div className="text-center md:text-right flex flex-col gap-1">
          <p className="font-body-sm text-body-sm">
            © 1999–2025 Nokia Retro Preservation Initiative.
          </p>
          <p className="font-label-lcd-status text-label-lcd-status uppercase text-[#c2c9bc]">
            Crafted for Retro Purists & Nostalgia Enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
};
