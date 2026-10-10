import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, Sparkles, Activity, Play, Radio, Check } from 'lucide-react';
import { audioEngine } from '../audio/audioEngine';

interface SoundSettingsViewProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const SoundSettingsView: React.FC<SoundSettingsViewProps> = ({
  soundEnabled,
  onToggleSound,
}) => {
  const [masterVolume, setMasterVolume] = useState<number>(80);
  const [moveSoundEnabled, setMoveSoundEnabled] = useState<boolean>(true);
  const [moveSoundVol, setMoveSoundVol] = useState<number>(30);
  const [activeSoundKey, setActiveSoundKey] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  // Live Oscilloscope Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderWaveform = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear with dark greenish LCD tone
      ctx.fillStyle = '#081425';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = '#152031';
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (audioEngine.analyser && soundEnabled) {
        const bufferLength = audioEngine.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        audioEngine.analyser.getByteTimeDomainData(dataArray);

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#a4d39a';
        ctx.shadowColor = '#a4d39a';
        ctx.shadowBlur = 6;
        ctx.beginPath();

        const sliceWidth = (width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      } else {
        // Flatline resting beam
        ctx.strokeStyle = '#2a3548';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(renderWaveform);
    };

    renderWaveform();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [soundEnabled]);

  const handlePlaySound = (type: string, playFn: () => void) => {
    setActiveSoundKey(type);
    playFn();
    setTimeout(() => {
      setActiveSoundKey(null);
    }, 400);
  };

  const handleVolumeChange = (newVal: number) => {
    setMasterVolume(newVal);
    audioEngine.setMasterVolume(newVal / 100);
  };

  const handleMoveSoundToggle = () => {
    const next = !moveSoundEnabled;
    setMoveSoundEnabled(next);
    audioEngine.moveSoundEnabled = next;
  };

  const handleMoveSoundVol = (val: number) => {
    setMoveSoundVol(val);
    audioEngine.moveSoundVolume = val / 100;
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Sound Settings Hero */}
      <div className="p-6 rounded-xl bg-[#152031] border border-[#1f2a3c] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0f380f] flex items-center justify-center text-[#a4d39a] border border-[#a4d39a]/40 shadow-inner shrink-0">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-lg text-xl sm:text-2xl text-[#a4d39a] uppercase tracking-wide">
                Sound FX Synthesis Lab
              </h1>
              <span className="px-2 py-0.5 rounded bg-[#b2d42f]/15 text-[#b2d42f] font-label-lcd-status text-label-lcd-status uppercase tracking-widest border border-[#b2d42f]/30">
                PIEZO BUZZER
              </span>
            </div>
            <p className="font-body-md text-body-md text-[#c2c9bc]">
              Hardware PWM monophonic audio engine with real-time waveform inspection and arcade soundboard.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleSound}
          className={`flex items-center gap-2 px-4 py-2.5 rounded font-headline-sm text-headline-sm uppercase transition-all active:scale-95 shadow-md ${
            soundEnabled
              ? 'bg-[#0f380f] text-[#a4d39a] border border-[#a4d39a]/40'
              : 'bg-[#1f2a3c] text-[#ffb4ab] border border-[#93000a]'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-[#b2d42f]" /> : <VolumeX className="w-4 h-4" />}
          <span>{soundEnabled ? 'BUZZER ONLINE' : 'MUTED'}</span>
        </button>
      </div>

      {/* Real-time CRT Oscilloscope */}
      <div className="p-6 rounded-xl bg-[#152031] border border-[#1f2a3c] flex flex-col gap-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#a4d39a]" />
            <h2 className="font-headline-md text-headline-md uppercase text-[#d8e3fb]">
              Acoustic Oscilloscope & Waveform
            </h2>
          </div>
          <span className="font-label-lcd-status text-label-lcd-status uppercase text-[#a4d39a] px-2 py-0.5 rounded bg-[#081425] border border-[#1f2a3c]">
            Web Audio FFT 256
          </span>
        </div>

        <div className="relative w-full h-36 rounded-lg overflow-hidden border border-[#2a3548] shadow-inner bg-[#081425]">
          <canvas ref={canvasRef} width={800} height={144} className="w-full h-full block" />
          <div className="absolute top-2 right-3 font-mono text-[10px] text-[#a4d39a]/60 uppercase tracking-widest">
            CH1: 8-BIT MONO PIEZO
          </div>
        </div>
      </div>

      {/* Interactive Soundboard Grid */}
      <div className="p-6 rounded-xl bg-[#152031] border border-[#1f2a3c] flex flex-col gap-5 shadow-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#b2d42f]" />
          <h2 className="font-headline-md text-headline-md uppercase text-[#d8e3fb]">
            Arcade Soundboard (Trigger & Preview)
          </h2>
        </div>
        <p className="font-body-sm text-body-sm text-[#c2c9bc]">
          Click any pad to audition the synthesized sound effects configured for gameplay:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* 1. Chomp */}
          <button
            type="button"
            onClick={() => handlePlaySound('chomp', () => audioEngine.playChomp())}
            className={`p-4 rounded-xl border flex flex-col gap-2 text-left transition-all active:scale-95 cursor-pointer ${
              activeSoundKey === 'chomp'
                ? 'bg-[#0f380f] border-[#a4d39a] shadow-lg shadow-[#a4d39a]/20 translate-y-0.5'
                : 'bg-[#111c2d] border-[#1f2a3c] hover:border-[#a4d39a]/50 hover:bg-[#1a273a]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🥚</span>
              <Play className="w-4 h-4 text-[#a4d39a]" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-sm text-[#a4d39a] uppercase">Chomp (Eat Egg)</span>
              <span className="font-body-sm text-[11px] text-[#c2c9bc]">
                Frequency-swept FM crunch & swallow
              </span>
            </div>
          </button>

          {/* 2. Move Tick */}
          <button
            type="button"
            onClick={() => handlePlaySound('move', () => audioEngine.playMoveTick())}
            className={`p-4 rounded-xl border flex flex-col gap-2 text-left transition-all active:scale-95 cursor-pointer ${
              activeSoundKey === 'move'
                ? 'bg-[#0f380f] border-[#b2d42f] shadow-lg shadow-[#b2d42f]/20 translate-y-0.5'
                : 'bg-[#111c2d] border-[#1f2a3c] hover:border-[#b2d42f]/50 hover:bg-[#1a273a]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🐾</span>
              <Play className="w-4 h-4 text-[#b2d42f]" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-sm text-[#b2d42f] uppercase">Move Tick (Step)</span>
              <span className="font-body-sm text-[11px] text-[#c2c9bc]">
                Low pulse tick on each grid hop
              </span>
            </div>
          </button>

          {/* 3. Wall Crash */}
          <button
            type="button"
            onClick={() => handlePlaySound('wall', () => audioEngine.playWallCrash())}
            className={`p-4 rounded-xl border flex flex-col gap-2 text-left transition-all active:scale-95 cursor-pointer ${
              activeSoundKey === 'wall'
                ? 'bg-[#3b1219] border-[#ffb4ab] shadow-lg shadow-[#ffb4ab]/20 translate-y-0.5'
                : 'bg-[#111c2d] border-[#1f2a3c] hover:border-[#ffb4ab]/50 hover:bg-[#1a273a]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🧱</span>
              <Play className="w-4 h-4 text-[#ffb4ab]" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-sm text-[#ffb4ab] uppercase">Wall Crash (Thud)</span>
              <span className="font-body-sm text-[11px] text-[#c2c9bc]">
                Heavy dull sub-bass brick impact
              </span>
            </div>
          </button>

          {/* 4. Self-Bite */}
          <button
            type="button"
            onClick={() => handlePlaySound('self', () => audioEngine.playSelfBite())}
            className={`p-4 rounded-xl border flex flex-col gap-2 text-left transition-all active:scale-95 cursor-pointer ${
              activeSoundKey === 'self'
                ? 'bg-[#3b1219] border-amber-400 shadow-lg shadow-amber-400/20 translate-y-0.5'
                : 'bg-[#111c2d] border-[#1f2a3c] hover:border-amber-400/50 hover:bg-[#1a273a]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🐍</span>
              <Play className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-sm text-amber-400 uppercase">Self-Bite (Crunch)</span>
              <span className="font-body-sm text-[11px] text-[#c2c9bc]">
                Dissonant dual-oscillator body snap
              </span>
            </div>
          </button>

          {/* 5. Faaah Game Over */}
          <button
            type="button"
            onClick={() => handlePlaySound('faaah', () => audioEngine.playFaaah())}
            className={`p-4 rounded-xl border flex flex-col gap-2 text-left transition-all active:scale-95 cursor-pointer ${
              activeSoundKey === 'faaah'
                ? 'bg-[#0f380f] border-[#a4d39a] shadow-lg shadow-[#a4d39a]/20 translate-y-0.5'
                : 'bg-[#111c2d] border-[#1f2a3c] hover:border-[#a4d39a]/50 hover:bg-[#1a273a]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🎺</span>
              <Play className="w-4 h-4 text-[#a4d39a]" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-sm text-[#a4d39a] uppercase">Faaah (Game Over)</span>
              <span className="font-body-sm text-[11px] text-[#c2c9bc]">
                Iconic sad descending defeat trombone
              </span>
            </div>
          </button>

          {/* 6. Key Click */}
          <button
            type="button"
            onClick={() => handlePlaySound('key', () => audioEngine.playKeyClick())}
            className={`p-4 rounded-xl border flex flex-col gap-2 text-left transition-all active:scale-95 cursor-pointer ${
              activeSoundKey === 'key'
                ? 'bg-[#152031] border-[#d8e3fb] shadow-lg shadow-[#d8e3fb]/20 translate-y-0.5'
                : 'bg-[#111c2d] border-[#1f2a3c] hover:border-[#d8e3fb]/50 hover:bg-[#1a273a]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🕹️</span>
              <Play className="w-4 h-4 text-[#d8e3fb]" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-sm text-[#d8e3fb] uppercase">Keypad Click</span>
              <span className="font-body-sm text-[11px] text-[#c2c9bc]">
                1100Hz hardware rubber switch click
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Audio Tuning Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-[#152031] border border-[#1f2a3c] flex flex-col gap-4 shadow-lg">
          <span className="font-headline-md text-headline-md uppercase text-[#d8e3fb]">
            Master Synthesizer Gain
          </span>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              value={masterVolume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full accent-[#a4d39a] h-2 bg-[#081425] rounded-lg cursor-pointer"
            />
            <span className="font-mono text-sm text-[#a4d39a] font-bold w-12 text-right">
              {masterVolume}%
            </span>
          </div>
          <span className="font-body-sm text-xs text-[#c2c9bc]">
            Controls the overall output amplitude fed into the Web Audio destination node.
          </span>
        </div>

        <div className="p-6 rounded-xl bg-[#152031] border border-[#1f2a3c] flex flex-col gap-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="font-headline-md text-headline-md uppercase text-[#d8e3fb]">
              Movement Step Sound
            </span>
            <button
              type="button"
              onClick={handleMoveSoundToggle}
              className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase transition-colors ${
                moveSoundEnabled ? 'bg-[#0f380f] text-[#a4d39a]' : 'bg-[#1f2a3c] text-[#ffb4ab]'
              }`}
            >
              {moveSoundEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="5"
              max="100"
              value={moveSoundVol}
              disabled={!moveSoundEnabled}
              onChange={(e) => handleMoveSoundVol(Number(e.target.value))}
              className="w-full accent-[#b2d42f] h-2 bg-[#081425] rounded-lg cursor-pointer disabled:opacity-30"
            />
            <span className="font-mono text-sm text-[#b2d42f] font-bold w-12 text-right">
              {moveSoundVol}%
            </span>
          </div>
          <span className="font-body-sm text-xs text-[#c2c9bc]">
            Adjustable acoustic feedback produced whenever the snake advances to a new grid cell.
          </span>
        </div>
      </div>
    </div>
  );
};
