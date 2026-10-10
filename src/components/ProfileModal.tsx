import React from 'react';
import { User, Award, Clock, Hash, Zap, X } from 'lucide-react';
import { UserStats } from '../types/game';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  const getRankTitle = () => {
    if (stats.highestScore >= 500) return 'NOKIA SNAKE GRANDMASTER 👑';
    if (stats.highestScore >= 300) return 'ARCADE CHAMPION 🥇';
    if (stats.highestScore >= 150) return 'PIXEL RUNNER 🥈';
    if (stats.highestScore >= 50) return 'RETRO GAMER 🥉';
    return 'NOVICE ROOKIE';
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-[#152031] border border-[#1f2a3c] p-6 shadow-2xl flex flex-col gap-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#c2c9bc] hover:text-white p-1 rounded-lg hover:bg-[#1f2a3c] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 border-b border-[#1f2a3c] pb-4">
          <div className="w-14 h-14 rounded-full bg-[#a4d39a] text-[#0f380f] flex items-center justify-center font-bold text-xl shadow-md">
            <User className="w-8 h-8" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-headline-md text-headline-md text-[#d8e3fb]">Retro Operator Profile</h2>
            <span className="font-label-lcd-status text-label-lcd-status text-[#a4d39a] uppercase font-bold tracking-wider">
              {getRankTitle()}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 font-mono">
          <div className="p-3 rounded-lg bg-[#081425] border border-[#1f2a3c] flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-[#c2c9bc]">
              <Award className="w-4 h-4 text-[#a4d39a]" />
              <span>Highest Score</span>
            </div>
            <span className="text-xl font-bold text-[#a4d39a]">
              {String(stats.highestScore).padStart(5, '0')}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#081425] border border-[#1f2a3c] flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-[#c2c9bc]">
              <Zap className="w-4 h-4 text-[#b2d42f]" />
              <span>Max Length</span>
            </div>
            <span className="text-xl font-bold text-[#b2d42f]">{stats.longestSnake} cells</span>
          </div>

          <div className="p-3 rounded-lg bg-[#081425] border border-[#1f2a3c] flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-[#c2c9bc]">
              <Hash className="w-4 h-4 text-[#d8e3fb]" />
              <span>Total Games</span>
            </div>
            <span className="text-xl font-bold text-[#d8e3fb]">{stats.totalGames} runs</span>
          </div>

          <div className="p-3 rounded-lg bg-[#081425] border border-[#1f2a3c] flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-[#c2c9bc]">
              <Clock className="w-4 h-4 text-[#c2c9bc]" />
              <span>Time Played</span>
            </div>
            <span className="text-xl font-bold text-[#d8e3fb]">
              {formatTime(stats.totalPlayTimeSeconds)}
            </span>
          </div>
        </div>

        {/* Hardware Status */}
        <div className="p-3 rounded-lg bg-[#111c2d] border border-[#1f2a3c] flex items-center justify-between text-xs font-mono text-[#c2c9bc]">
          <span>HANDSET: NOKIA 3310-NHM-5NX</span>
          <span className="text-[#a4d39a]">AUTHENTICATED</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-lg bg-[#0f380f] hover:bg-[#1a551a] text-[#a4d39a] font-headline-sm uppercase text-xs font-bold border border-[#a4d39a]/40 transition-all active:scale-95"
        >
          Close Profile
        </button>
      </div>
    </div>
  );
};
