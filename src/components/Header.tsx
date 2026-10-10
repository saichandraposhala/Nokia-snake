import React from 'react';
import { Gamepad2, Volume2, VolumeX, User } from 'lucide-react';

interface HeaderProps {
  currentTab: 'game' | 'how-to-play' | 'high-scores' | 'sound-settings';
  onTabChange: (tab: 'game' | 'how-to-play' | 'high-scores' | 'sound-settings') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  soundEnabled,
  onToggleSound,
  onOpenProfile,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#081425]/90 backdrop-blur-xl border-b border-[#1f2a3c] shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div
          onClick={() => onTabChange('game')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded bg-[#152031] flex items-center justify-center shadow-inner group-hover:bg-[#1f2a3c] transition-colors">
            <Gamepad2 className="w-5 h-5 text-[#a4d39a]" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md tracking-wider text-[#a4d39a] uppercase">
              NOKIA 3310
            </span>
            <span className="font-label-keypad-sub text-label-keypad-sub uppercase text-[#c2c9bc] tracking-widest">
              Retro Arcade • 84x48 LCD
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onTabChange('game')}
            className={`px-3 py-1.5 uppercase transition-all rounded font-headline-sm text-headline-sm ${
              currentTab === 'game'
                ? 'bg-[#0f380f] text-[#a4d39a] border border-[#a4d39a]/30 font-bold shadow-sm'
                : 'text-[#c2c9bc] hover:bg-[#152031] hover:text-[#d8e3fb]'
            }`}
          >
            Game Screen
          </button>
          <button
            type="button"
            onClick={() => onTabChange('how-to-play')}
            className={`px-3 py-1.5 uppercase transition-all rounded font-headline-sm text-headline-sm ${
              currentTab === 'how-to-play'
                ? 'bg-[#0f380f] text-[#a4d39a] border border-[#a4d39a]/30 font-bold shadow-sm'
                : 'text-[#c2c9bc] hover:bg-[#152031] hover:text-[#d8e3fb]'
            }`}
          >
            How to Play / Specs
          </button>
          <button
            type="button"
            onClick={() => onTabChange('high-scores')}
            className={`px-3 py-1.5 uppercase transition-all rounded font-headline-sm text-headline-sm ${
              currentTab === 'high-scores'
                ? 'bg-[#0f380f] text-[#a4d39a] border border-[#a4d39a]/30 font-bold shadow-sm'
                : 'text-[#c2c9bc] hover:bg-[#152031] hover:text-[#d8e3fb]'
            }`}
          >
            High Scores
          </button>
          <button
            type="button"
            onClick={() => onTabChange('sound-settings')}
            className={`px-3 py-1.5 uppercase transition-all rounded font-headline-sm text-headline-sm ${
              currentTab === 'sound-settings'
                ? 'bg-[#0f380f] text-[#a4d39a] border border-[#a4d39a]/30 font-bold shadow-sm'
                : 'text-[#c2c9bc] hover:bg-[#152031] hover:text-[#d8e3fb]'
            }`}
          >
            Sound FX Settings
          </button>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Sound Toggle Button */}
          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#152031] hover:bg-[#1f2a3c] transition-colors text-[#c2c9bc] hover:text-[#d8e3fb] active:scale-95"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#b2d42f]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#ffb4ab]" />
            )}
            <span className="font-label-lcd-status text-label-lcd-status uppercase hidden sm:inline">
              {soundEnabled ? 'Monophonic' : 'Muted'}
            </span>
          </button>

          {/* Firmware / Version Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#040e1f] border border-[#152031]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#b2d42f] animate-pulse"></span>
            <span className="font-label-lcd-status text-label-lcd-status uppercase text-[#c2c9bc]">
              v1.0.0-PROD
            </span>
          </div>

          {/* User Profile / Stats */}
          <button
            type="button"
            onClick={onOpenProfile}
            title="Player Stats"
            className="w-8 h-8 rounded-full bg-[#a4d39a] hover:bg-[#bfefb4] text-[#0f380f] flex items-center justify-center transition-all active:scale-95 shadow-md"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav pills bar */}
      <div className="flex md:hidden overflow-x-auto px-4 py-1.5 bg-[#081425] border-t border-[#152031] gap-2">
        <button
          type="button"
          onClick={() => onTabChange('game')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded font-headline-sm uppercase ${
            currentTab === 'game' ? 'bg-[#0f380f] text-[#a4d39a] font-bold' : 'text-[#c2c9bc]'
          }`}
        >
          Game
        </button>
        <button
          type="button"
          onClick={() => onTabChange('how-to-play')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded font-headline-sm uppercase ${
            currentTab === 'how-to-play' ? 'bg-[#0f380f] text-[#a4d39a] font-bold' : 'text-[#c2c9bc]'
          }`}
        >
          How to Play
        </button>
        <button
          type="button"
          onClick={() => onTabChange('high-scores')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded font-headline-sm uppercase ${
            currentTab === 'high-scores' ? 'bg-[#0f380f] text-[#a4d39a] font-bold' : 'text-[#c2c9bc]'
          }`}
        >
          High Scores
        </button>
        <button
          type="button"
          onClick={() => onTabChange('sound-settings')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded font-headline-sm uppercase ${
            currentTab === 'sound-settings' ? 'bg-[#0f380f] text-[#a4d39a] font-bold' : 'text-[#c2c9bc]'
          }`}
        >
          Sound FX
        </button>
      </div>
    </header>
  );
};
