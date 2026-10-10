import React, { useState } from 'react';
import { Trophy, Medal, Filter, RotateCcw } from 'lucide-react';
import { HighScoreRecord, DifficultyPreset, WallMode } from '../types/game';

interface HighScoresViewProps {
  scores: HighScoreRecord[];
  onClearScores: () => void;
  onPlayClick: () => void;
}

export const HighScoresView: React.FC<HighScoresViewProps> = ({
  scores,
  onClearScores,
  onPlayClick,
}) => {
  const [filterDiff, setFilterDiff] = useState<DifficultyPreset | 'all'>('all');
  const [filterMode, setFilterMode] = useState<WallMode | 'all'>('all');
  const [filterMap, setFilterMap] = useState<string>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredScores = scores
    .filter((s) => (filterDiff === 'all' ? true : s.difficulty === filterDiff))
    .filter((s) => (filterMode === 'all' ? true : s.wallMode === filterMode))
    .filter((s) => (filterMap === 'all' ? true : (s.mapType || 'open') === filterMap))
    .sort((a, b) => b.score - a.score);

  const formatScore = (val: number) => String(val).padStart(5, '0');

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Title Header */}
      <div className="p-6 rounded-xl bg-[#152031] border border-[#1f2a3c] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#0f380f] flex items-center justify-center text-[#a4d39a] border border-[#a4d39a]/30 shadow-inner">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-lg text-headline-lg text-[#a4d39a] uppercase tracking-wide">
                Nokia Arcade Leaderboard
              </h1>
              <span className="px-2 py-0.5 rounded bg-[#b2d42f]/15 text-[#b2d42f] font-label-lcd-status text-label-lcd-status uppercase tracking-widest border border-[#b2d42f]/30">
                HALL OF FAME
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-[#c2c9bc]">
              Preserved high scores from tournament sessions and retro handheld runs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPlayClick}
            className="px-4 py-2 rounded bg-[#0f380f] hover:bg-[#1a551a] text-[#a4d39a] border border-[#a4d39a]/40 font-headline-sm text-headline-sm uppercase transition-all active:scale-95 shadow-sm"
          >
            START NEW RUN
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl bg-[#111c2d] border border-[#1f2a3c] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#a4d39a]" />
          <span className="font-headline-sm text-xs text-[#d8e3fb] uppercase">Filter By:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 bg-[#081425] p-1 rounded border border-[#1f2a3c]">
            {(['all', 'casual', 'classic', 'turbo'] as const).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setFilterDiff(diff)}
                className={`px-2.5 py-1 rounded font-headline-sm text-[11px] uppercase transition-all ${
                  filterDiff === diff
                    ? 'bg-[#0f380f] text-[#a4d39a] font-bold border border-[#a4d39a]/30'
                    : 'text-[#c2c9bc] hover:text-[#d8e3fb]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Wall Mode Filter */}
          <div className="flex items-center gap-1 bg-[#081425] p-1 rounded border border-[#1f2a3c]">
            {(['all', 'solid', 'wrap'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setFilterMode(mode)}
                className={`px-2.5 py-1 rounded font-headline-sm text-[11px] uppercase transition-all ${
                  filterMode === mode
                    ? 'bg-[#0f380f] text-[#a4d39a] font-bold border border-[#a4d39a]/30'
                    : 'text-[#c2c9bc] hover:text-[#d8e3fb]'
                }`}
              >
                {mode === 'all' ? 'All Physics' : mode === 'solid' ? 'Solid' : 'Wrap'}
              </button>
            ))}
          </div>

          {/* Map Filter */}
          <div className="flex items-center gap-1 bg-[#081425] p-1 rounded border border-[#1f2a3c]">
            {(['all', 'open', 'pillars', 'corners', 'cross', 'box'] as const).map((mp) => (
              <button
                key={mp}
                type="button"
                onClick={() => setFilterMap(mp)}
                className={`px-2 py-1 rounded font-headline-sm text-[10px] uppercase transition-all ${
                  filterMap === mp
                    ? 'bg-[#0f380f] text-[#a4d39a] font-bold border border-[#a4d39a]/30'
                    : 'text-[#c2c9bc] hover:text-[#d8e3fb]'
                }`}
              >
                {mp}
              </button>
            ))}
          </div>

          {/* Clear Button */}
          {!showClearConfirm ? (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#1f2a3c] hover:bg-[#93000a] text-[#c2c9bc] hover:text-[#ffdad6] font-headline-sm text-xs uppercase transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Table
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-[#2a1215] p-1 rounded border border-[#93000a]">
              <span className="text-xs text-[#ffb4ab] px-1">Erase all?</span>
              <button
                type="button"
                onClick={() => {
                  onClearScores();
                  setShowClearConfirm(false);
                }}
                className="px-2 py-0.5 bg-[#93000a] text-[#ffdad6] text-xs font-bold rounded"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-2 py-0.5 bg-[#1f2a3c] text-[#d8e3fb] text-xs rounded"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-xl bg-[#152031] border border-[#1f2a3c] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f1722] border-b border-[#1f2a3c] text-[#c2c9bc] font-label-lcd-status text-label-lcd-status uppercase">
                <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                <th className="py-3.5 px-4">Player Tag</th>
                <th className="py-3.5 px-4">Score</th>
                <th className="py-3.5 px-4">Map Layout</th>
                <th className="py-3.5 px-4">Length</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Physics</th>
                <th className="py-3.5 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2a3c]/60 font-mono text-sm">
              {filteredScores.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#c2c9bc]">
                    No scores found matching this filter criteria. Complete a game to record a score!
                  </td>
                </tr>
              ) : (
                filteredScores.map((rec, idx) => {
                  return (
                    <tr
                      key={rec.id}
                      className={`hover:bg-[#1c293c] transition-colors ${
                        idx === 0 ? 'bg-[#0f380f]/15' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        {idx === 0 && <span className="text-yellow-400 font-bold">#1 👑</span>}
                        {idx === 1 && <span className="text-gray-300 font-bold">#2 🥈</span>}
                        {idx === 2 && <span className="text-amber-600 font-bold">#3 🥉</span>}
                        {idx > 2 && <span className="text-[#c2c9bc]">#{idx + 1}</span>}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-headline-md font-bold text-[#a4d39a] bg-[#040e1f] px-2 py-0.5 rounded border border-[#1f2a3c] tracking-widest">
                          {rec.initials}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-headline-md font-bold text-[#d8e3fb]">
                        {formatScore(rec.score)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs uppercase px-2 py-0.5 rounded bg-[#1f2a3c] text-[#a4d39a] border border-[#2a3548]">
                          {rec.mapType || 'open'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#c2c9bc]">
                        {rec.snakeLength} cells
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs uppercase px-2 py-0.5 rounded font-bold ${
                            rec.difficulty === 'turbo'
                              ? 'bg-red-950 text-red-300 border border-red-800'
                              : rec.difficulty === 'classic'
                              ? 'bg-[#0f380f] text-[#a4d39a] border border-[#a4d39a]/30'
                              : 'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}
                        >
                          {rec.difficulty}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs uppercase text-[#c2c9bc]">
                        {rec.wallMode === 'solid' ? 'Solid' : 'Wrap'}
                      </td>
                      <td className="py-3.5 px-4 text-right text-xs text-[#c2c9bc]">
                        {rec.date}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
