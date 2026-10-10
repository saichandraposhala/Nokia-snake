import React, { useState } from 'react';
import { Trophy, Check, X } from 'lucide-react';

interface InitialsEntryModalProps {
  score: number;
  isOpen: boolean;
  onSave: (initials: string) => void;
  onClose: () => void;
}

export const InitialsEntryModal: React.FC<InitialsEntryModalProps> = ({
  score,
  isOpen,
  onSave,
  onClose,
}) => {
  const [initials, setInitials] = useState('NOK');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = (initials.trim().toUpperCase() || 'AAA').slice(0, 3);
    onSave(clean);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm rounded-2xl bg-[#152031] border-2 border-[#a4d39a] p-6 shadow-2xl flex flex-col gap-5 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#0f380f] flex items-center justify-center text-[#a4d39a] border border-[#a4d39a]/40 shadow-inner">
          <Trophy className="w-6 h-6" />
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="font-headline-lg text-lg text-[#a4d39a] uppercase">New High Score!</h2>
          <span className="font-headline-md text-2xl text-[#d8e3fb] font-bold">
            {String(score).padStart(5, '0')} PTS
          </span>
          <p className="font-body-sm text-xs text-[#c2c9bc]">
            Enter your 3-letter arcade initials to register on the Nokia Hall of Fame.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-center items-center gap-2">
            <input
              type="text"
              maxLength={3}
              autoFocus
              value={initials}
              onChange={(e) => setInitials(e.target.value.toUpperCase())}
              className="w-36 text-center font-mono text-3xl tracking-[0.3em] font-bold py-2 bg-[#081425] text-[#a4d39a] border-2 border-[#a4d39a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b2d42f]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="submit"
              className="py-2.5 px-4 rounded-lg bg-[#0f380f] hover:bg-[#1b551b] text-[#a4d39a] font-headline-sm uppercase text-xs font-bold border border-[#a4d39a]/40 flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              Save Record
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-lg bg-[#1f2a3c] hover:bg-[#2a384f] text-[#c2c9bc] font-headline-sm uppercase text-xs border border-[#2a384f] flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <X className="w-4 h-4" />
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
